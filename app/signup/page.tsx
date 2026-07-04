"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

	function validate() {
		const next: { name?: string; email?: string; password?: string } = {};

		if (!name.trim()) {
			next.name = "Name is required";
		}

		if (!email) {
			next.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			next.email = "Email is invalid";
		}

		if (!password) {
			next.password = "Password is required";
		} else if (password.length < 8) {
			next.password = "Password must be at least 8 characters";
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
				<div className="rounded-xl border border-border bg-card p-6">
					<div className="space-y-1.5">
						<h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
						<p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
						<div className="space-y-2">
							<Label className="gap-0" htmlFor="name">Name<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
						</div>

						<div className="space-y-2">
							<Label className="gap-0" htmlFor="email">Email<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
								className={errors.email ? "border-red-500" : ""}
							/>
							{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
						</div>

						<div className="space-y-2">
							<Label className="gap-0" htmlFor="password">Password<span className="text-red-500 ml-px">*</span></Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
								className={errors.password ? "border-red-500" : ""}
							/>
							{errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
						</div>

						<Button type="submit" className="w-full rounded-full">Sign Up</Button>
					</form>

					<div className="mt-4 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">Sign in</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
