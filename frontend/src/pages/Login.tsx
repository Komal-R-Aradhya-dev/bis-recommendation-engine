import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const next: { email?: string; password?: string } = {};

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "A valid email is required";
    }

    if (!password) {
      next.password = "Password is required";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate("/");
    } catch {
      // Error is already handled by useAuth.
    }
  }

  return (
    <AuthLayout
      kicker="Secure entry"
      title="A quieter room for serious standards."
    >
      <p className="bis-kicker">Sign in</p>
      <h2 className="mt-2 font-serif text-3xl text-bis-ink">
        BIS Recommendation Engine
      </h2>
      <p className="mt-2 text-sm leading-6 text-bis-muted">
        Continue to Indian Standards intelligence.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-bis-ink"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className="bis-input"
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 text-sm text-bis-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-bis-ink"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            className="bis-input"
          />
          {fieldErrors.password && (
            <p id="password-error" className="mt-2 text-sm text-bis-danger">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-bis-danger/25 bg-bis-danger/10 px-4 py-3 text-sm text-bis-danger"
          >
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="bis-btn-primary">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-bis-muted">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-bis-accent hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
