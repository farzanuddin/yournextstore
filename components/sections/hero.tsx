import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="py-4 sm:py-6 lg:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Desktop: banner with text overlay */}
				<div className="hidden md:block relative w-full mx-auto aspect-3/1 rounded-3xl overflow-hidden">
					<Image
						src="/hero-desktop.avif"
						alt="Curated lifestyle products collection"
						fill
						className="object-cover"
						priority
						sizes="(max-width: 1024px) 100vw, 90vw"
					/>
					<div className="absolute inset-0 flex items-center p-8 sm:p-12 lg:p-16">
						<div className="max-w-xl">
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-black leading-tight">
								Curated essentials for modern living.
							</h1>
							<p className="mt-3 text-sm sm:text-base text-black/70 leading-relaxed">
								Discover our thoughtfully designed collection of premium products, crafted with care and built to last.
							</p>
							<div className="mt-6">
								<YnsLink
									href="/products"
									className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
								>
									Shop Collection
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile/Tablet: text above, image below */}
				<div className="md:hidden space-y-6">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
							Curated essentials for modern living.
						</h1>
						<p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
							Discover our thoughtfully designed collection of premium products, crafted with care and built to last.
						</p>
						<div className="mt-5">
							<YnsLink
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
							>
								Shop Collection
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>
					</div>
					<div className="relative w-full rounded-2xl overflow-hidden aspect-16/9 sm:aspect-2/1">
						<Image src="/hero-mobile.avif" alt="Curated lifestyle products collection" fill className="object-cover" priority sizes="100vw" />
					</div>
				</div>
			</div>
		</section>
	);
}
