"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

const FREE_SHIPPING_THRESHOLD = 10000n; // $100.00 in minor units
const SHIPPING_COST = 1500n; // $15.00 in minor units

type FormData = {
	email: string;
	firstName: string;
	lastName: string;
	address: string;
	postalCode: string;
	city: string;
	state: string;
	country: string;
	phone: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CheckoutPage() {
	const { items, itemCount, subtotal } = useCart();
	const [isPlacing, setIsPlacing] = useState(false);
	const [form, setForm] = useState<FormData>({
		email: "",
		firstName: "",
		lastName: "",
		address: "",
		postalCode: "",
		city: "",
		state: "",
		country: "",
		phone: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	function validate(): boolean {
		const next: FormErrors = {};

		if (!form.email) {
			next.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			next.email = "Email is invalid";
		}

		if (!form.firstName.trim()) next.firstName = "First name is required";
		if (!form.lastName.trim()) next.lastName = "Last name is required";
		if (!form.address.trim()) next.address = "Address is required";
		if (!form.postalCode.trim()) next.postalCode = "Postal code is required";
		if (!form.city.trim()) next.city = "City is required";
		if (!form.country.trim()) next.country = "Country is required";

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		if (items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		setIsPlacing(true);

		// Simulate order processing
		await new Promise((resolve) => setTimeout(resolve, 2000));

		toast.success("Order placed successfully! 🎉");
		setIsPlacing(false);
	};

	const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0n : SHIPPING_COST;
	const vat = (subtotal * 20n) / 100n; // Mock 20% VAT
	const total = subtotal + shipping + vat;

	if (items.length === 0) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div className="flex flex-col items-center justify-center gap-6">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
						<ShoppingBag className="h-10 w-10 text-muted-foreground" />
					</div>
					<div className="text-center">
						<h1 className="text-2xl font-medium tracking-tight">Your cart is empty</h1>
						<p className="text-muted-foreground mt-2">Add some products before checking out</p>
					</div>
					<Button asChild>
						<Link href="/products">Browse Products</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

			<div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12">
				{/* Shipping Form */}
				<form onSubmit={handleSubmit} className="space-y-8" noValidate>
					<div className="space-y-6">
						<h2 className="text-lg font-medium">Contact Information</h2>
						<div>
							<Label htmlFor="email">Email<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={form.email}
								onChange={handleChange("email")}
								className={`mt-1.5 ${errors.email ? "border-red-500" : ""}`}
							/>
							{errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
						</div>
					</div>

					<div className="space-y-6">
						<h2 className="text-lg font-medium">Shipping Address</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName">First Name<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="firstName"
									value={form.firstName}
									onChange={handleChange("firstName")}
									className={`mt-1.5 ${errors.firstName ? "border-red-500" : ""}`}
								/>
								{errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
							</div>
							<div>
								<Label htmlFor="lastName">Last Name<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="lastName"
									value={form.lastName}
									onChange={handleChange("lastName")}
									className={`mt-1.5 ${errors.lastName ? "border-red-500" : ""}`}
								/>
								{errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
							</div>
						</div>
						<div>
							<Label htmlFor="address">Address<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="address"
								placeholder="123 Main St"
								value={form.address}
								onChange={handleChange("address")}
								className={`mt-1.5 ${errors.address ? "border-red-500" : ""}`}
							/>
							{errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="postalCode">Postal Code<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="postalCode"
									value={form.postalCode}
									onChange={handleChange("postalCode")}
									className={`mt-1.5 ${errors.postalCode ? "border-red-500" : ""}`}
								/>
								{errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
							</div>
							<div>
								<Label htmlFor="city">City<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="city"
									value={form.city}
									onChange={handleChange("city")}
									className={`mt-1.5 ${errors.city ? "border-red-500" : ""}`}
								/>
								{errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="state">State / Region</Label>
								<Input
									id="state"
									value={form.state}
									onChange={handleChange("state")}
									className="mt-1.5"
								/>
							</div>
							<div>
								<Label htmlFor="country">Country<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="country"
									placeholder="United States"
									value={form.country}
									onChange={handleChange("country")}
									className={`mt-1.5 ${errors.country ? "border-red-500" : ""}`}
								/>
								{errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
							</div>
						</div>
						<div>
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="+1 (555) 000-0000"
								value={form.phone}
								onChange={handleChange("phone")}
								className="mt-1.5"
							/>
						</div>
					</div>

					<Button type="submit" className="w-full h-14 text-base font-medium rounded-full" disabled={isPlacing}>
						{isPlacing ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Placing Order…
							</>
						) : (
							"Place Order"
						)}
					</Button>
				</form>

				{/* Order Summary */}
				<div className="mt-10 lg:mt-0">
					<div className="sticky top-24 rounded-xl border border-border bg-card p-6">
						<h2 className="text-lg font-medium mb-6">Order Summary</h2>

						<div className="divide-y divide-border">
							{items.map((item) => (
								<div key={item.productVariant.id} className="flex gap-4 py-4 first:pt-0">
									<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
										{item.productVariant.images[0] && (
											<img
												src={item.productVariant.images[0]}
												alt={item.productVariant.product.name}
												className="h-full w-full object-cover"
											/>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{item.productVariant.product.name}</p>
										<p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
									</div>
									<div className="text-sm font-medium shrink-0">
										{formatMoney({
											amount: BigInt(item.productVariant.price) * BigInt(item.quantity),
											currency: CURRENCY,
											locale: LOCALE,
										})}
									</div>
								</div>
							))}
						</div>

						<div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
								<span>{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Shipping</span>
								<span>{shipping === 0n ? "Free" : formatMoney({ amount: shipping, currency: CURRENCY, locale: LOCALE })}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">VAT (20%)</span>
								<span>{formatMoney({ amount: vat, currency: CURRENCY, locale: LOCALE })}</span>
							</div>
						</div>

						<div className="border-t border-border mt-4 pt-4 flex justify-between text-base font-semibold">
							<span>Total</span>
							<span>{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
