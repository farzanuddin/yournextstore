import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

type ProductFilterParams = {
	category?: string;
};

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "All Products",
		description: "Browse our complete product collection.",
		alternates: { canonical: "/products" },
		openGraph: {
			type: "website",
			title: "All Products",
			description: "Browse our complete product collection.",
			url: "/products",
		},
	};
}

async function ProductList({ filters }: { filters: ProductFilterParams }) {
	"use cache";
	cacheLife("minutes");

	const result = await commerce.productBrowse({
		active: true,
		limit: 100,
		category: filters.category,
	});

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
			{result.data.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index === 0} />
			))}
		</div>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={`skeleton-${i}`}>
					<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
					<div className="space-y-2">
						<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
						<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
					</div>
				</div>
			))}
		</div>
	);
}

async function ProductSection({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	const filters = await searchParams;
	return <ProductList filters={filters} />;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilterParams> }) {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">All Products</h1>
				<p className="mt-2 text-muted-foreground">Browse our complete collection</p>
			</div>

			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductSection searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
