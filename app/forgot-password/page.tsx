"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | undefined>();
	const [sent, setSent] = useState(false);

	function validate() {
		if (!email) {
			setError("Email is required");
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Email is invalid");
			return false;
		}
		setError(undefined);
		return true;
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (validate()) {
			setSent(true);
		}
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
					<div className="space-y-1.5">
						<h1 className="text-xl font-semibold tracking-tight">Forgot Password</h1>
						<p className="text-sm text-muted-foreground">Enter your email to reset your password</p>
					</div>

					{sent ? (
						<div className="mt-6 space-y-4">
							<div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
								If an account exists for {email}, you will receive a password reset link shortly.
							</div>
							<div className="text-center">
								<Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
									<ArrowLeft className="h-4 w-4" />Go back
								</Link>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-medium">Email</label>
								<input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(undefined); }} className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${error ? "border-red-500" : "border-input"}`} />
								{error && <p className="text-sm text-red-500">{error}</p>}
							</div>

							<button type="submit" className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90">Send reset link</button>

							<div className="text-center">
								<Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
									<ArrowLeft className="h-4 w-4" />Go back
								</Link>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
