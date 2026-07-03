"use client";

import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/login", "/signup", "/forgot-password"];

/** Hides children on auth-related pages (login, signup, forgot-password). */
export function HideOnAuthPages({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	if (HIDDEN_PATHS.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
}
