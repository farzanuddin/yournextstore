"use server";

import { revalidatePath } from "next/cache";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function addToCart(variantId: string, quantity = 1) {
	if (!variantId || typeof variantId !== "string" || variantId.length > 100) {
		return { success: false, cart: null, error: "Invalid variant" };
	}
	const safeQuantity = Math.max(1, Math.min(Math.floor(Number(quantity) || 1), 99));
	const cartCookie = await getCartCookieJson();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
		variantId,
		quantity: safeQuantity,
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
	if (!variantId || typeof variantId !== "string" || variantId.length > 100) {
		return { success: false, cart: null };
	}
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		const cart = await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: Math.max(0, Math.min(Math.floor(Number(quantity) || 0), 99)),
			mode: "set",
		});
		revalidatePath("/", "layout");
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
