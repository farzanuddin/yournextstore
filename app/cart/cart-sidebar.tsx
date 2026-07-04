"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { CURRENCY, FREE_SHIPPING_THRESHOLD, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

function FreeShippingIndicator({ subtotal }: { subtotal: bigint }) {
	const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
	const progress = subtotal > FREE_SHIPPING_THRESHOLD ? 100 : Number((subtotal * 100n) / FREE_SHIPPING_THRESHOLD);

	if (remaining <= 0n) {
		return (
			<div className="px-4 pb-2">
				<p className="text-xs font-medium">🎉 You qualify for free shipping!</p>
				<div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
					<div className="h-full rounded-full bg-foreground transition-all" style={{ width: "100%" }} />
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 pb-2">
			<p className="text-xs text-muted-foreground">
				Add {formatMoney({ amount: remaining, currency: CURRENCY, locale: LOCALE })} more for free shipping
			</p>
			<div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
				<div
					className="h-full rounded-full bg-foreground transition-all"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-2">
						Your Cart
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-medium">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button variant="outline" onClick={closeCart}>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 min-h-0 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="shrink-0">
							<FreeShippingIndicator subtotal={subtotal} />
						</div>

						<SheetFooter className="shrink-0 border-t border-border pt-4">
							<div className="w-full space-y-4">
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">Subtotal</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<Button asChild className="w-full h-12 text-base font-medium rounded-full" disabled={isMutating}>
									<Link href={checkoutUrl}>
										{isMutating ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Updating…
											</>
										) : (
											"Checkout"
										)}
									</Link>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
									style={{ cursor: "pointer" }}
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
