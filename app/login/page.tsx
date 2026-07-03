"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	function validate() {
		const next: { email?: string; password?: string } = {};

		if (!email) {
			next.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			next.email = "Email is invalid";
		}

		if (!password) {
			next.password = "Password is required";
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		validate();
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
					<div className="space-y-1.5">
						<h1 className="text-xl font-semibold tracking-tight">Sign In</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email below to login to your account
						</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">Email</label>
							<input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
								className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.email ? "border-red-500" : "border-input"}`}
							/>
							{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="text-sm font-medium">Password</label>
								<Link href="/forgot-password" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Forgot your password?</Link>
							</div>
							<input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
								className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.password ? "border-red-500" : "border-input"}`}
							/>
							{errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
						</div>

						<button type="submit" className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90">Login</button>
					</form>

					<div className="mt-4 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">Sign up</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
