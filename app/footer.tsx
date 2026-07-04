import { Lock } from "lucide-react";
import Image from "next/image";
import { NewsletterFooter } from "@/app/newsletter-footer";
import { YnsLink } from "@/components/yns-link";

export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16 justify-between">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<YnsLink  href="/" className="text-xl font-bold text-foreground">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Newsletter */}
					<NewsletterFooter />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Image src="/visa.svg" alt="Visa" width={22} height={16} className="h-4 w-auto opacity-60" />
							<Image src="/mc.svg" alt="Mastercard" width={22} height={16} className="h-4 w-auto opacity-60" />
							<Image src="/gpay.svg" alt="Google Pay" width={22} height={16} className="h-4 w-auto opacity-60" />
						</div>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<Lock className="h-3 w-3" />
							<span>Secured by SSL encryption</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
