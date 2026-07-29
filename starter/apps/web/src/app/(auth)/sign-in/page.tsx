"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "../auth.module.scss";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (result.error) {
      setError(result.error.message ?? "Sign-in failed");
      setPending(false);
      return;
    }
    // The proxy gate appends ?next=<original path> when it redirects here. Same-origin
    // only - validated by PARSING, not prefix checks: the URL parser strips
    // tabs/newlines and treats "\" as "/", so strings like "/%09/evil.example"
    // defeat any startsWith filter (the classic open-redirect). Parse against our
    // origin; keep the path only when the origin survived.
    const nextParam = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    let nextPath = "/dashboard";
    try {
      const parsed = new URL(nextParam, window.location.origin);
      if (parsed.origin === window.location.origin) {
        // Collapse leading slashes/backslashes: a pathname like "//evil.example"
        // would be protocol-relative when router.push re-parses it - the origin
        // check must survive the round-trip, not just the parse.
        nextPath = `/${(parsed.pathname + parsed.search + parsed.hash).replace(/^[/\\]+/, "")}`;
      }
    } catch {
      // unparseable input keeps the default
    }
    router.push(nextPath);
    router.refresh();
  }

  return (
    <main className={styles.main}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        {error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending}>
          Sign in
        </button>
        <p>
          No account yet? <Link href="/sign-up">Create one</Link>
        </p>
      </form>
    </main>
  );
}
