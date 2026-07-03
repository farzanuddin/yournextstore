import type { APIMeGetResult } from "commerce-kit";
import { Commerce } from "commerce-kit";

// Override the API host (defaults to yns.store / yns.cx by key prefix). Useful for
// pointing at a dev deployment, e.g. YNS_API_URL=https://dev.axelgrubba.com
const endpoint = process.env.YNS_API_URL || undefined;

export const commerce = Commerce({
	token: process.env.YNS_API_KEY,
	endpoint,
});

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

const USE_MOCK = !process.env.YNS_API_KEY || process.env.YNS_API_KEY === "dummy_key_for_dev";

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
