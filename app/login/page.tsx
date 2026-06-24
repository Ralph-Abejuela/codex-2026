"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	const router = useRouter();
	const [mode, setMode] = useState<"signin" | "signup">("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const { data: session, isPending: sessionPending } = authClient.useSession();

	if (sessionPending) return null;
	if (session) {
		router.push("/");
		return null;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setPending(true);

		try {
			if (mode === "signin") {
				const { error: signInError } = await authClient.signIn.email({
					email,
					password,
				});
				if (signInError) {
					setError(
						signInError.message ?? signInError.statusText ?? "Sign in failed",
					);
					return;
				}
				router.push("/");
			} else {
				const { error: signUpError } = await authClient.signUp.email({
					email,
					password,
					name,
				});
				if (signUpError) {
					setError(
						signUpError.message ?? signUpError.statusText ?? "Sign up failed",
					);
					return;
				}
				router.push("/");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setPending(false);
		}
	}

	function toggleMode() {
		setMode(mode === "signin" ? "signup" : "signin");
		setError(null);
	}

	return (
		<div className="flex min-h-full flex-1 items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>
						{mode === "signin" ? "Sign in" : "Create account"}
					</CardTitle>
					<CardDescription>
						{mode === "signin"
							? "Enter your email below to sign in"
							: "Enter your details to create an account"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						{mode === "signup" && (
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									type="text"
									placeholder="Your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</Field>
						)}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder={
									mode === "signup"
										? "Create a password"
										: "Enter your password"
								}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</Field>
						{error && (
							<p className="text-xs/relaxed text-destructive">{error}</p>
						)}
						<Button type="submit" disabled={pending} className="w-full">
							{pending
								? mode === "signin"
									? "Signing in…"
									: "Creating account…"
								: mode === "signin"
									? "Sign in"
									: "Create account"}
						</Button>
					</form>
					<p className="mt-4 text-center text-xs/relaxed text-muted-foreground">
						{mode === "signin" ? (
							<>
								Don&apos;t have an account?{" "}
								<button
									type="button"
									onClick={toggleMode}
									className="underline underline-offset-4 hover:text-foreground"
								>
									Sign up
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									type="button"
									onClick={toggleMode}
									className="underline underline-offset-4 hover:text-foreground"
								>
									Sign in
								</button>
							</>
						)}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
