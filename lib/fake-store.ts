const FAKE_STORE_BASE = "https://api.escuelajs.co/api/v1";

// ─── Fake Store API types ───────────────────────────────────────────────

type FakeProduct = {
	id: number;
	title: string;
	slug: string;
	price: number;
	description: string;
	category: FakeCategory;
	images: string[];
};

type FakeCategory = {
	id: number;
	name: string;
	slug: string;
	image: string;
};

// ─── Commerce-kit compatible types (subset we need) ─────────────────────

type CommerceProduct = {
	id: string;
	name: string;
	slug: string;
	description: string;
	summary: string | null;
	images: string[];
	variants: Array<{
		id: string;
		price: string;
		originalPrice: string;
		sku: string | null;
		stock: number | null;
		omnibusPrice: string | null;
		images: string[];
		combinations: never[];
	}>;
	category: {
		id: string;
		name: string;
		slug: string;
	} | null;
	seo: {
		title: string;
		description: string;
	} | null;
	type: "product";
	status: "published";
	content: null;
	badge: null;
};

type CommerceCategory = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	active: boolean;
	parent: null;
};

type CommerceCollection = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	description: null;
};

// ─── Adapter functions ──────────────────────────────────────────────────

function mapProduct(fp: FakeProduct): CommerceProduct {
	return {
		id: String(fp.id),
		name: fp.title,
		slug: fp.slug,
		description: fp.description,
		summary: fp.description.slice(0, 200),
		images: fp.images,
		variants: [
			{
				id: `v-${fp.id}`,
				// Fake Store prices are in whole dollars; commerce-kit expects minor units (cents)
				price: String(fp.price * 100),
				originalPrice: String(fp.price * 100),
				sku: null,
				stock: 100,
				omnibusPrice: null,
				images: fp.images,
				combinations: [],
			},
		],
		category: fp.category
			? {
					id: String(fp.category.id),
					name: fp.category.name,
					slug: fp.category.slug,
				}
			: null,
		seo: {
			title: fp.title,
			description: fp.description.slice(0, 160),
		},
		type: "product" as const,
		status: "published" as const,
		content: null,
		badge: null,
	};
}

function mapCategory(fc: FakeCategory): CommerceCategory {
	return {
		id: String(fc.id),
		name: fc.name,
		slug: fc.slug,
		image: fc.image,
		active: true,
		parent: null,
	};
}

// ─── Fake Store API client ──────────────────────────────────────────────

async function fetchJSON<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Fake Store API error: ${res.status} ${res.statusText}`);
	}
	return res.json();
}

export async function fetchProducts(params?: {
	offset?: number;
	limit?: number;
	search?: string;
	categoryId?: string;
}): Promise<{ data: CommerceProduct[]; meta: { total: number; limit: number; offset: number } }> {
	const { offset = 0, limit = 12, search, categoryId } = params ?? {};

	let url = `${FAKE_STORE_BASE}/products?offset=${offset}&limit=${limit}`;

	if (search) {
		url += `&title=${encodeURIComponent(search)}`;
	}
	if (categoryId) {
		url += `&categoryId=${categoryId}`;
	}

	try {
		const products = await fetchJSON<FakeProduct[]>(url);
		return {
			data: products.map(mapProduct),
			meta: { total: 200, limit, offset },
		};
	} catch {
		console.error("Failed to fetch products from Fake Store API");
		return { data: [], meta: { total: 0, limit, offset } };
	}
}

export async function fetchProduct(idOrSlug: string): Promise<CommerceProduct | null> {
	try {
		// Try by ID first
		const id = Number(idOrSlug);
		if (!Number.isNaN(id)) {
			const product = await fetchJSON<FakeProduct>(`${FAKE_STORE_BASE}/products/${id}`);
			return mapProduct(product);
		}
		// Search by slug — fetch all and find match
		const products = await fetchJSON<FakeProduct[]>(`${FAKE_STORE_BASE}/products`);
		const match = products.find((p) => p.slug === idOrSlug);
		return match ? mapProduct(match) : null;
	} catch {
		return null;
	}
}

export async function fetchCategories(): Promise<{ data: CommerceCategory[] }> {
	try {
		const categories = await fetchJSON<FakeCategory[]>(`${FAKE_STORE_BASE}/categories`);
		return { data: categories.map(mapCategory) };
	} catch {
		console.error("Failed to fetch categories from Fake Store API");
		return { data: [] };
	}
}

export async function fetchCollections(): Promise<{ data: CommerceCollection[] }> {
	try {
		const categories = await fetchJSON<FakeCategory[]>(`${FAKE_STORE_BASE}/categories`);
		return {
			data: categories.map((fc) => ({
				id: String(fc.id),
				name: fc.name,
				slug: fc.slug,
				image: fc.image,
				description: null,
			})),
		};
	} catch {
		console.error("Failed to fetch collections from Fake Store API");
		return { data: [] };
	}
}

export async function fetchCategory(idOrSlug: string): Promise<CommerceCategory | null> {
	try {
		const id = Number(idOrSlug);
		if (!Number.isNaN(id)) {
			const category = await fetchJSON<FakeCategory>(`${FAKE_STORE_BASE}/categories/${id}`);
			return mapCategory(category);
		}
		const categories = await fetchJSON<FakeCategory[]>(`${FAKE_STORE_BASE}/categories`);
		const match = categories.find((c) => c.slug === idOrSlug);
		return match ? mapCategory(match) : null;
	} catch {
		return null;
	}
}
