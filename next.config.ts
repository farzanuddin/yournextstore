import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["*.vercel.run"],
	devIndicators: false,
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		typedEnv: true,
		serverComponentsHmrCache: false,
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-checkbox",
			"@radix-ui/react-dialog",
			"@radix-ui/react-label",
			"@radix-ui/react-popover",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-select",
			"@radix-ui/react-separator",
			"@radix-ui/react-slider",
			"@radix-ui/react-slot",
			"@radix-ui/react-tooltip",
			"class-variance-authority",
		],
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "**" }],
	},
	async headers() {
		if (isProd) return [];
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Cache-Control", value: "no-store, must-revalidate" },
					{ key: "Pragma", value: "no-cache" },
				],
			},
		];
	},
};

export default nextConfig;
