"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function AgribridgeMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-10 w-10"
      viewBox="0 0 48 48"
      fill="none"
    >
      <rect width="48" height="48" rx="13" fill="#183F31" />
      <path
        d="M14 31.5C16.5 23.2 22.3 17.9 34.5 14c-1 9.7-6.6 16.6-16.6 18.2"
        stroke="#EAF3E7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 35c2.7-6.1 7.3-10.4 14.8-14.2"
        stroke="#A5CC6B"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
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
      <section className="story-panel" aria-label="About Agribridge">
        <div className="story-content">
          <div className="brand brand-light">
            <AgribridgeMark />
            <span>Agribridge</span>
          </div>

          <div className="story-copy">
            <span className="eyebrow">Admin workspace</span>
            <h1>Growing better decisions, together.</h1>
            <p>
              Keep every part of your agricultural network connected,
              informed, and moving forward.
            </p>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 19V9m7 10V5m7 14v-7" />
              </svg>
            </div>
            <div>
              <strong>One clear view</strong>
              <span>Monitor operations across your whole ecosystem.</span>
            </div>
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
          <span>Agribridge</span>
        </div>

        <div className="form-wrap">
          <div className="form-heading">
            <span className="eyebrow">Secure access</span>
            <h2>Welcome back</h2>
            <p>Sign in to manage the Agribridge platform.</p>
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
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="mailto:support@agribridge.com?subject=Admin password reset">
                  Forgot password?
                </a>
              </div>
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

            <label className="remember">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in on this device</span>
            </label>

            <button className="submit-button" type="submit">
              Sign in to dashboard
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </button>

          </form>

          <div className="support-note">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.7 9a2.5 2.5 0 1 1 3.2 2.4c-.7.3-.9.8-.9 1.6M12 17h.01" />
            </svg>
            <span>
              Having trouble?{" "}
              <a href="mailto:support@agribridge.com">Contact support</a>
            </span>
          </div>
        </div>

        <footer>© 2026 Agribridge. All rights reserved.</footer>
      </section>
    </main>
  );
}
