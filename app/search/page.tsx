import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { SearchPageInput } from "@/app/search-input";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";


export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q}` : "Search",
		description: q ? `Search results for "${q}"` : "Search our store",
		alternates: { canonical: "/search" },
		robots: { index: false, follow: true },
	};
}

function SearchResultsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<div key={i} className="flex flex-col gap-3">
					<div className="aspect-square w-full animate-pulse bg-secondary motion-reduce:animate-none" />
					<div className="h-3 w-2/3 animate-pulse bg-secondary motion-reduce:animate-none" />
					<div className="h-3 w-1/3 animate-pulse bg-secondary/60 motion-reduce:animate-none" />
				</div>
			))}
		</div>
	);
}

async function SearchResults({ q }: { q: string }) {
	"use cache";
	cacheLife("minutes");

	const result = await commerce.productBrowse({
		query: q.trim(),
		active: true,
		limit: 100,
	});

	if (result.data.length === 0) {
		return (
			<div>
				<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">No results</p>
				<h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
					Nothing matched &ldquo;{q}&rdquo;
				</h2>
				<p className="mt-6 max-w-md text-sm text-muted-foreground">
					Try a shorter spelling, a broader term, or remove a filter.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
			{result.data.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index === 0} />
			))}
		</div>
	);
}

function EmptyQuery({ categories }: { categories: { id: string; slug: string; name: string }[] }) {
	return (
		<div className="border-t border-border pt-12 sm:pt-20">
			<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search</p>
			<h2 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl">
				What are you looking for?
			</h2>
			{categories.length ? (
				<div className="mt-12">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Or browse</p>
					<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-lg">
						{categories.slice(0, 8).map((c) => (
							<li key={c.id}>
								<a
									href={`/search?category=${encodeURIComponent(c.slug)}`}
									className="border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-foreground"
								>
									{c.name}
								</a>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;
	const query = q?.trim() ?? "";

	return (
		<section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div className="pt-8 pb-4 sm:pt-12 sm:pb-6">
				<div className="mx-auto max-w-3xl">
					<SearchPageInput initialQuery={query} />
				</div>
			</div>

			{query ? (
				<>
					<header className="pt-10 pb-8 sm:pt-14 sm:pb-12">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Results for</p>
						<h1 className="mt-3 max-w-[14ch] text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							{query}
						</h1>
					</header>

					<Suspense fallback={<SearchResultsSkeleton />}>
						<SearchResults q={query} />
					</Suspense>
				</>
			) : (
				<EmptyQuery categories={[]} />
			)}
		</section>
	);
}
