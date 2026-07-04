"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
				<div className="rounded-xl border border-border bg-card p-6">
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
								<Label className="gap-0" htmlFor="email">Email<span className="text-red-500 ml-px">*</span></Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									value={email}
									onChange={(e) => { setEmail(e.target.value); setError(undefined); }}
									className={error ? "border-red-500" : ""}
								/>
								{error && <p className="text-sm text-red-500">{error}</p>}
							</div>

							<Button type="submit" className="w-full">Send reset link</Button>

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
