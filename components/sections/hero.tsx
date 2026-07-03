import { ArrowRightIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="py-4 sm:py-6 lg:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Mobile: banner with text overlay */}
				<div className="lg:hidden relative w-full rounded-2xl overflow-hidden aspect-[4/3]">
					<img src="/hero.avif" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
					<div className="absolute inset-0 flex items-center p-6">
						<div>
							<h1 className="text-xl font-semibold tracking-tight text-black leading-tight">
								Curated essentials for modern living.
							</h1>
							<p className="mt-2 text-sm text-black/70 leading-relaxed max-w-xs">
								Discover our thoughtfully designed collection of premium products.
							</p>
							<div className="mt-4">
								<YnsLink
									prefetch="eager"
									href="/products"
									className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
								>
									Shop Collection
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
							</div>
						</div>
					</div>
				</div>

				{/* Desktop: banner with text overlay */}
				<div className="hidden lg:block relative w-full mx-auto aspect-[2.5/1] lg:aspect-[2/1] rounded-3xl overflow-hidden">
					<img
						src="/hero.avif"
						alt="Hero"
						className="absolute inset-0 w-full h-full object-cover"
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
									prefetch="eager"
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
			</div>
		</section>
	);
}
