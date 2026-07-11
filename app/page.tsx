"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function AgribridgeMark() {
  return <img className="brand-logo" src="/agri_logo.png" alt="" />;
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.3A10.7 10.7 0 0 1 12 4c5.5 0 9 5 9 5a16 16 0 0 1-2.1 2.5M6.2 6.2C4.2 7.5 3 9 3 9s3.5 5 9 5c1 0 2-.2 2.8-.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="login-shell">
      <section className="story-panel" aria-label="About AgriBridge">
        <div className="story-content">
          <div className="brand brand-light">
            <AgribridgeMark />
            <span>AgriBridge</span>
          </div>

          <div className="story-copy">
            <span className="eyebrow">Admin workspace</span>
            <h1>Growing better decisions, together.</h1>
            <p>
              Keep every part of your agricultural network connected,
              informed, and moving forward.
            </p>
          </div>

        </div>

        <div className="field-lines" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="form-panel">
        <div className="mobile-brand brand">
          <AgribridgeMark />
          <span>AgriBridge</span>
        </div>

        <div className="form-wrap">
          <div className="form-heading">
            <span className="eyebrow">Secure access</span>
            <h2>Welcome back</h2>
            <p>Sign in to manage the AgriBridge platform.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@agribridge.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  className="show-password"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </div>
            </div>

            <button className="submit-button" type="submit">
              Sign in
            </button>

          </form>
        </div>

        <footer>© 2026 AgriBridge. All rights reserved.</footer>
      </section>
    </main>
  );
}
