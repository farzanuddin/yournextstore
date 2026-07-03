import type { APIMeGetResult } from "commerce-kit";
import { Commerce } from "commerce-kit";
import { fetchCategories, fetchCategory, fetchCollections, fetchProduct, fetchProducts } from "./fake-store";

// Override the API host (defaults to yns.store / yns.cx by key prefix). Useful for
// pointing at a dev deployment, e.g. YNS_API_URL=https://dev.axelgrubba.com
const endpoint = process.env.YNS_API_URL || undefined;

const USE_MOCK = !process.env.YNS_API_KEY || process.env.YNS_API_KEY === "dummy_key_for_dev";

// ─── In-memory cart store (for Fake Store mode only) ────────────────────

type CartItem = {
	variantId: string;
	quantity: number;
	price: string;
	images: string[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
};

const cartStore = new Map<string, { id: string; lineItems: CartItem[] }>();

function getOrCreateCart(cartId?: string): { id: string; lineItems: CartItem[] } {
	const id = cartId ?? `cart-${Math.random().toString(36).slice(2)}`;
	if (!cartStore.has(id)) {
		cartStore.set(id, { id, lineItems: [] });
	}
	return cartStore.get(id)!;
}

function cartToCommerceShape(cart: { id: string; lineItems: CartItem[] }) {
	return {
		id: cart.id,
		lineItems: cart.lineItems.map((item) => ({
			quantity: item.quantity,
			productVariant: {
				id: item.variantId,
				price: item.price,
				images: item.images,
				product: item.product,
			},
		})),
	};
}

// ─── Base commerce client ───────────────────────────────────────────────

const realCommerce = Commerce({
	token: process.env.YNS_API_KEY,
	endpoint,
});

// ─── Proxied commerce client ────────────────────────────────────────────

const mockCommerce = {
	...realCommerce,

	async productBrowse(params: Record<string, unknown>) {
		const searchQuery = (params.query as string) || (params.search as string) || undefined;
		const categorySlug = params.category as string | undefined;

		// Resolve category slug to ID if needed
		let categoryId: string | undefined;
		if (categorySlug) {
			const numId = Number(categorySlug);
			if (!Number.isNaN(numId)) {
				categoryId = categorySlug;
			} else {
				// Look up the category by slug
				const cat = await fetchCategory(categorySlug);
				categoryId = cat?.id;
			}
		}

		const result = await fetchProducts({
			offset: params.offset as number,
			limit: params.limit as number,
			search: searchQuery,
			categoryId,
		});
		// Commerce-kit uses meta.count, not meta.total
		return { ...result, meta: { ...result.meta, count: result.meta.total } };
	},

	async productGet(params: { idOrSlug: string }) {
		return fetchProduct(params.idOrSlug);
	},

	async productFilters() {
		const { data: categories } = await fetchCategories();
		return {
			priceBounds: { min: 0, max: 100000 },
			variantTypes: [],
			categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
			collections: categories.map((c) => ({ name: c.name, slug: c.slug })),
			brands: [],
		};
	},

	async collectionBrowse(params: { limit?: number }) {
		const result = await fetchCollections();
		if (params.limit) {
			result.data = result.data.slice(0, params.limit);
		}
		return result;
	},

	async collectionGet(params: { idOrSlug: string }) {
		const result = await fetchCollections();
		const match = result.data.find((c) => c.id === params.idOrSlug || c.slug === params.idOrSlug);
		if (!match) return null;
		return {
			...match,
			productCollections: [],
			active: true,
			filter: { type: "manual" as const },
		};
	},

	async categoriesBrowse(params: { active?: boolean; limit?: number }) {
		const result = await fetchCategories();
		if (params.limit) {
			result.data = result.data.slice(0, params.limit);
		}
		// Add parentId for compatibility with search page filtering
		return {
			data: result.data.map((c) => ({ ...c, parentId: undefined })),
		};
	},

	async categoryGet(params: { idOrSlug: string }) {
		return fetchCategory(params.idOrSlug);
	},

	async cartGet(params: { cartId: string }) {
		const cart = cartStore.get(params.cartId);
		return cart ? cartToCommerceShape(cart) : null;
	},

	async cartUpsert(params: { cartId?: string; variantId: string; quantity: number }) {
		// Fetch product to get its data
		const product = await fetchProduct(params.variantId.replace("v-", ""));
		if (!product) return null;

		const cart = getOrCreateCart(params.cartId);
		const existing = cart.lineItems.find((i) => i.variantId === params.variantId);

		if (existing) {
			existing.quantity += params.quantity;
		} else {
			cart.lineItems.push({
				variantId: params.variantId,
				quantity: params.quantity,
				price: product.variants[0].price,
				images: product.images,
				product: {
					id: product.id,
					name: product.name,
					slug: product.slug,
					images: product.images,
				},
			});
		}

		return cartToCommerceShape(cart);
	},

	async cartRemoveItem(params: { cartId: string; variantId: string }) {
		const cart = cartStore.get(params.cartId);
		if (!cart) return null;
		cart.lineItems = cart.lineItems.filter((i) => i.variantId !== params.variantId);
		return cartToCommerceShape(cart);
	},

	async cartDelete(params: { cartId: string }) {
		cartStore.delete(params.cartId);
		return { ok: true };
	},

	// Non-essential methods — return empty/null
	async legalPageBrowse() {
		return { data: [] };
	},
	async legalPageGet() {
		return null;
	},
	async productReviewsBrowse() {
		return { data: [], summary: null };
	},
	async orderGet() {
		return null;
	},
};

export const commerce = USE_MOCK ? (mockCommerce as unknown as typeof realCommerce) : realCommerce;

const DEFAULT_ME = {
	store: {
		name: "Your Next Store",
		subdomain: "",
		settings: {
			enabledTools: {
				blog: false,
				newsletter: false,
				loyalty: false,
				reviews: false,
				productSubscriptions: false,
				contactForm: false,
				wishlist: false,
				cookieConsent: false,
				auctions: false,
				surveys: false,
				bookings: false,
				productSets: false,
				restockNotifications: false,
				abandonedCarts: false,
				newsletterPopup: false,
				stripeTaxes: false,
				translations: false,
				cartRecommendations: false,
				withdrawalButton: false,
				events: false,
			},
			enabledLanguages: {
				"en-US": true,
				"pl-PL": true,
				"es-ES": true,
				"de-DE": true,
			},
			storeName: "Your Next Store",
			storeDescription: "Your next e-commerce store",
		},
	},
	publicUrl: "http://localhost:3000",
} as APIMeGetResult;

// Plain "use cache" (not "remote") so store settings can be part of the static
// shell — remote-cached entries defer to request time and block prerendering
// for everything that depends on them (metadata, <html lang>, nav links).
export const meGetCached = async (token?: string) => {
	"use cache";

	if (USE_MOCK) {
		return DEFAULT_ME;
	}

	const commerce = Commerce({ token, endpoint });
	return commerce.meGet();
};

export function getStoreFaviconUrl(
	settings: Awaited<ReturnType<typeof commerce.meGet>>["store"]["settings"],
) {
	const faviconUrl =
		settings?.favicon?.imageUrl ??
		(typeof settings?.logo === "string" ? settings.logo : settings?.logo?.imageUrl) ??
		null;

	return faviconUrl;
}

export function getCanonicalUrl(): string {
	if (process.env.NEXT_PUBLIC_URL) {
		return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

export const getSubdomainPublicUrl = async () => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (tenant) {
		const tenantUrl = new URL(tenant);
		const [subdomain, ...base] = tenantUrl.host.split(".");
		const apiHost = base.join(".");
		if (subdomain && apiHost) {
			return {
				subdomain,
				// Preserve the tenant's scheme/port so local http backends work (not just https).
				publicUrl: `${tenantUrl.protocol}//${apiHost}`,
			};
		}
	}

	// fallback to fetching from the API if env variable is not set or invalid
	const {
		store: { subdomain },
		publicUrl,
	} = await meGetCached(process.env.YNS_API_KEY);
	return { subdomain, publicUrl };
};
