"use client";

import { CreditCard, Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCY, FREE_SHIPPING_THRESHOLD, LOCALE, SHIPPING_COST } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

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
	const { items, itemCount, subtotal, closeCart } = useCart();
	const [isPlacing, setIsPlacing] = useState(false);

	useEffect(() => {
		closeCart();
	}, [closeCart]);
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
	const [paymentMethod, setPaymentMethod] = useState<"card" | "google-pay" | null>(null);
	const [cardNumber, setCardNumber] = useState("");
	const [cardExpiry, setCardExpiry] = useState("");
	const [cardCvc, setCardCvc] = useState("");
	const [cardError, setCardError] = useState("");

	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
		const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
		setCardNumber(formatted);
		setCardError("");

		// Validate Visa (starts with 4) or Mastercard (starts with 51-55 or 2221-2720)
		if (raw.length >= 2) {
			const isVisa = raw.startsWith("4");
			const isMastercard = /^5[1-5]/.test(raw) || (/^2[2-7]/.test(raw) && raw.length >= 4 && Number(raw.slice(0, 4)) >= 2221 && Number(raw.slice(0, 4)) <= 2720);
			if (!isVisa && !isMastercard) {
				setCardError("Only Visa and Mastercard are accepted");
			}
		}
	};

	const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
		if (raw.length >= 2) {
			setCardExpiry(raw.slice(0, 2) + " / " + raw.slice(2));
		} else {
			setCardExpiry(raw);
		}
	};

	const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4));
	};

	function validatePayment(): boolean {
		if (!paymentMethod) { setCardError("Please select a payment method"); return false; }
		if (paymentMethod === "google-pay") return true;
		const raw = cardNumber.replace(/\s/g, "");
		if (raw.length < 13) { setCardError("Card number is required"); return false; }
		if (cardExpiry.length < 7) { setCardError("Expiry date is required"); return false; }
		if (cardCvc.length < 3) { setCardError("Security code is required"); return false; }
		return true;
	}

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow digits, spaces, dashes, parentheses, and leading +
		const filtered = e.target.value.replace(/[^\d\s\-()+]/g, "");
		setForm((prev) => ({ ...prev, phone: filtered }));
		setErrors((prev) => ({ ...prev, phone: undefined }));
	};

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
		if (!form.phone.trim()) {
			next.phone = "Phone number is required";
		} else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) {
			next.phone = "Enter a valid phone number";
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;
		if (!validatePayment()) return;

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

			<div className="lg:grid lg:grid-cols-2 lg:gap-12">
				{/* Shipping Form */}
				<form onSubmit={handleSubmit} className="space-y-6" noValidate>
					<div className="space-y-6">
						<div>
							<div className="flex items-center justify-between">
								<Label className="gap-0" htmlFor="email">Email<span className="text-red-500 ml-px">*</span></Label>
								<Link href="/login" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Sign in</Link>
							</div>
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
								<Label className="gap-0" htmlFor="firstName">First Name<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="firstName"
									value={form.firstName}
									onChange={handleChange("firstName")}
									className={`mt-1.5 ${errors.firstName ? "border-red-500" : ""}`}
								/>
								{errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
							</div>
							<div>
								<Label className="gap-0" htmlFor="lastName">Last Name<span className="text-red-500 ml-px">*</span></Label>
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
							<Label className="gap-0" htmlFor="address">Address<span className="text-red-500 ml-px">*</span></Label>
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
								<Label className="gap-0" htmlFor="postalCode">Postal Code<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="postalCode"
									value={form.postalCode}
									onChange={handleChange("postalCode")}
									className={`mt-1.5 ${errors.postalCode ? "border-red-500" : ""}`}
								/>
								{errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
							</div>
							<div>
								<Label className="gap-0" htmlFor="city">City<span className="text-red-500 ml-px">*</span></Label>
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
								<Label className="gap-0" htmlFor="state">State / Region</Label>
								<Input
									id="state"
									value={form.state}
									onChange={handleChange("state")}
									className="mt-1.5"
								/>
							</div>
							<div>
								<Label className="gap-0" htmlFor="country">Country<span className="text-red-500 ml-px">*</span></Label>
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
							<Label className="gap-0" htmlFor="phone">Phone Number<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="phone"
								type="tel"
								placeholder="+1 (555) 000-0000"
								value={form.phone}
								onChange={handlePhoneChange}
								className={`mt-1.5 ${errors.phone ? "border-red-500" : ""}`}
							/>
							{errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
						</div>
					</div>

					{/* Payment Section */}
					<div className="space-y-6">
						<h2 className="text-lg font-medium">Payment</h2>
						{cardError && !cardNumber && !cardExpiry && !cardCvc && <p className="text-sm text-red-500">{cardError}</p>}

						<fieldset className="border-0 p-0 m-0 space-y-3">
							<legend className="sr-only">Select payment method</legend>
							{/* Card Option */}
							<label
								className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-foreground bg-secondary/30" : "border-border hover:border-muted-foreground/30"}`}
							>
								<input
									type="radio"
									name="payment"
									checked={paymentMethod === "card"}
									onChange={() => { setPaymentMethod("card"); setCardError(""); }}
									className="h-4 w-4 accent-foreground"
								/>
								<span className="text-sm font-medium">Card</span>
								<span className="ml-auto flex gap-1.5 items-center">
								<Image src="/visa.svg" alt="Visa" width={20} height={14} className="h-5 w-auto" />
								<Image src="/mc.svg" alt="Mastercard" width={20} height={14} className="h-5 w-auto" />
								</span>
							</label>

							{paymentMethod === "card" && (
								<div className="space-y-4 pl-10">
									<div>
										<Label className="gap-0">Card Number</Label>
										<div className="relative mt-1.5">
											<Input
												placeholder="1234 1234 1234 1234"
												value={cardNumber}
												onChange={handleCardNumberChange}
												className={`font-mono ${cardError ? "border-red-500" : ""}`}
												maxLength={19}
											/>
											<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center">
									<Image src="/visa.svg" alt="Visa" width={16} height={11} className={`h-4 w-auto ${cardNumber.replace(/\s/g, "").startsWith("4") ? "opacity-100" : "opacity-30"}`} />
									<Image src="/mc.svg" alt="Mastercard" width={16} height={11} className={`h-4 w-auto ${/^5[1-5]/.test(cardNumber.replace(/\s/g, "")) ? "opacity-100" : "opacity-30"}`} />
											</div>
										</div>
										{cardError && <p className="text-sm text-red-500 mt-1">{cardError}</p>}
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label className="gap-0">Expiration Date</Label>
											<Input
												placeholder="MM / YY"
												value={cardExpiry}
												onChange={handleExpiryChange}
												className="mt-1.5"
												maxLength={7}
											/>
										</div>
										<div>
											<Label className="gap-0">Security Code</Label>
											<Input
												placeholder="CVC"
												value={cardCvc}
												onChange={handleCvcChange}
												className="mt-1.5"
												maxLength={4}
											/>
										</div>
									</div>
								</div>
							)}

							{/* Google Pay Option */}
							<label
								className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === "google-pay" ? "border-foreground bg-secondary/30" : "border-border hover:border-muted-foreground/30"}`}
							>
								<input
									type="radio"
									name="payment"
									checked={paymentMethod === "google-pay"}
									onChange={() => { setPaymentMethod("google-pay"); setCardError(""); }}
									className="h-4 w-4 accent-foreground"
								/>
								<span className="text-sm font-medium">Google Pay</span>
								<Image src="/gpay.svg" alt="Google Pay" width={20} height={14} className="ml-auto h-5 w-auto" />
							</label>

							{paymentMethod === "google-pay" && (
								<div className="pl-10">
									<div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
										<Lock className="h-4 w-4 mt-0.5 shrink-0" />
										<span>Another step will appear to securely submit your payment information.</span>
									</div>
								</div>
							)}
						</fieldset>
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

					<div className="flex items-center justify-center gap-6 text-xs text-muted-foreground mt-0.5">
						<span className="flex items-center gap-1.5">
							<Lock className="h-3 w-3" /> SSL Encrypted
						</span>
						<span className="flex items-center gap-1.5">
							<ShieldCheck className="h-3 w-3" /> Secure Payment
						</span>
						<span className="flex items-center gap-1.5">
							<CreditCard className="h-3 w-3" /> Powered by Stripe
						</span>
					</div>
				</form>

				{/* Order Summary */}
				<div className="mt-10 lg:mt-0">
					<div className="sticky top-24 rounded-xl border border-border bg-card p-6">
						<h2 className="text-lg font-medium mb-6">Order Summary</h2>

						<div className="divide-y divide-border">
							{items.map((item) => (
								<div key={item.productVariant.id} className="flex gap-4 py-4 first:pt-0">
									<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary relative">
										{item.productVariant.images[0] && (
											<Image
												src={item.productVariant.images[0]}
												alt={item.productVariant.product.name}
												fill
												sizes="64px"
												className="object-cover"
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
