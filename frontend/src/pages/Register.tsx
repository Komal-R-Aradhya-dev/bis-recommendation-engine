import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const next: { name?: string; email?: string; password?: string } = {};

    if (!name.trim() || name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "A valid email is required";
    }

    if (!password || password.length < 6) {
      next.password = "Password must be at least 6 characters";
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
      await register({
        name: name.trim(),
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
      kicker="Create access"
      title="Enter the archive. Keep the work exact."
    >
      <p className="bis-kicker">Register</p>
      <h2 className="mt-2 font-serif text-3xl text-bis-ink">Create Account</h2>
      <p className="mt-2 text-sm leading-6 text-bis-muted">
        BIS Recommendation Engine — for procurement officials.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-bis-ink"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            required
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className="bis-input"
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-2 text-sm text-bis-danger">
              {fieldErrors.name}
            </p>
          )}
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            required
            minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-bis-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-bis-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
