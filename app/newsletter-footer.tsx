"use client";

import { Megaphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterFooter() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | undefined>();
	const [subscribed, setSubscribed] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!email.trim()) {
			setError("Email is required");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Enter a valid email");
			return;
		}

		setError(undefined);
		setSubscribed(true);
	}

	return (
		<div className="sm:max-w-xs">
			<h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5" />Stay in the loop</h3>
			<p className="mt-1 text-sm text-muted-foreground">Get the latest drops and exclusive offers.</p>
			<form onSubmit={handleSubmit} className="mt-3 flex gap-2" noValidate>
				<Input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => { setEmail(e.target.value); setError(undefined); }}
					className={error ? "border-red-500" : ""}
					disabled={subscribed}
				/>
				<Button type="submit" className="rounded-full shrink-0" disabled={subscribed}>
					{subscribed ? "Subscribed" : "Subscribe"}
				</Button>
			</form>
			{error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
			{subscribed && <p className="mt-2 text-xs text-green-600 dark:text-green-400">✓ You're subscribed to the newsletter.</p>}
		</div>
	);
}
