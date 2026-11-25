"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProviders, signIn } from "next-auth/react";
import { type FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [register, setRegister] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const title = register ? "Create account" : "Sign in";

  useEffect(() => {
    getProviders().then(providers => setHasGoogle(Boolean(providers?.google)));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    setError("");
    if (register && new TextEncoder().encode(password).length > 72) {
      setError("Choose a password of 72 bytes or fewer.");
      return;
    }
    setBusy(true);
    try {
      const result = await signIn("credentials", {
        email: data.get("email"), password, intent: register ? "register" : "login",
        redirect: false
      });
      if (result?.ok && !result.error) {
        window.location.assign("/home");
        return;
      }
      if (register && result?.error === "SignupUnavailable") {
        setError("Account creation is temporarily unavailable. Please try again later.");
      } else {
        setError(register ? "Couldn’t create this account. If you already have one, sign in instead." : "Couldn’t sign in. Check your email and password.");
      }
    } catch {
      setError("Can’t reach the sign-in service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function googleLogin() {
    signIn("google", { callbackUrl: "/home" })
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-5 p-6">
        <header>
          <p className="text-sm text-muted-foreground">Tech Blogs</p>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block space-y-1 text-sm font-medium">
            <span>Email</span>
            <Input name="email" type="email" autoComplete="username" maxLength={254} required />
          </label>
          <label className="block space-y-1 text-sm font-medium">
            <span>Password</span>
            <Input key={title} name="password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={register ? 12 : undefined} placeholder={register ? "At least 12 characters" : undefined} required />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button disabled={busy} className="w-full" type="submit">{busy ? "Please wait…" : title}</Button>
        </form>
        {hasGoogle && <Button variant="outline" disabled={busy} className="w-full" onClick={googleLogin}>Continue with Google</Button>}
        <p className="text-center text-sm text-muted-foreground">
          {register ? "Already have an account?" : "New to Tech Blogs?"}{" "}
          <button type="button" disabled={busy} className="font-medium text-foreground underline" onClick={() => { setError(""); setRegister(!register); }}>
            {register ? "Sign in" : "Create account"}
          </button>
        </p>
      </Card>
    </main>
  );
}
