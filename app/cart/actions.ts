"use server";

import { revalidatePath } from "next/cache";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function addToCart(variantId: string, quantity = 1) {
	const cartCookie = await getCartCookieJson();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}
	revalidatePath("/", "layout");

	return { success: true, cart };
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		const cart = await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: Math.max(quantity, 0),
			mode: "set",
		});
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
