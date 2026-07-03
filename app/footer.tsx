import { YnsLink } from "@/components/yns-link";

export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<YnsLink  href="/" className="text-xl font-bold text-foreground">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
