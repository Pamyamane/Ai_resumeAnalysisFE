import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, User, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const { handleregister } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms before creating an account.");
      return;
    }

    setLoading(true);
    try {
      await handleregister({
        username: form.name,
        email: form.email,
        password: form.password,
      });
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthClass = ["", "weak", "fair", "good", "strong"][strength];

  return (
    <main className="register-page">
      <form className="register-card" onSubmit={handleRegister}>

        {/* Header */}
        <div className="register-card__header">
          <div className="register-card__logo">
            <Sparkles size={20} />
          </div>
          <h1 className="register-card__title">Create an account</h1>
          <p className="register-card__subtitle">Sign up to get started today</p>
        </div>

        {/* Body */}
        <div className="register-card__body">

          {/* Full name */}
          <div className="field">
            <label className="field__label">Full name</label>
            <div className="field__input-wrap">
              <User size={15} className="field__icon" />
              <input
                className="field__input"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
              />
            </div>
          </div>

          {/* Email */}
          <div className="field">
            <label className="field__label">Email</label>
            <div className="field__input-wrap">
              <Mail size={15} className="field__icon" />
              <input
                className="field__input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label className="field__label">Password</label>
            <div className="field__input-wrap">
              <Lock size={15} className="field__icon" />
              <input
                className="field__input field__input--padded-right"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
              />
              <button
                type="button"
                className="field__eye"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="strength">
                <div className="strength__bars">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`strength__bar ${i <= strength ? `strength__bar--${strengthClass}` : ""}`}
                    />
                  ))}
                </div>
                <span className={`strength__label strength__label--${strengthClass}`}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="field">
            <label className="field__label">Confirm password</label>
            <div className="field__input-wrap">
              <Lock size={15} className="field__icon" />
              <input
                className={`field__input field__input--padded-right${
                  form.confirm && form.confirm !== form.password ? " field__input--error" : ""
                }`}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={set("confirm")}
              />
              <button
                type="button"
                className="field__eye"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p className="field__error">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <div className="remember" onClick={() => setAgreed((a) => !a)}>
            <div className={`remember__box${agreed ? " remember__box--checked" : ""}`}>
              {agreed && <Check size={10} strokeWidth={3} />}
            </div>
            <span className="remember__label">
              I agree to the{" "}
              <a href="#" className="remember__link" onClick={(e) => e.stopPropagation()}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="remember__link" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </a>
            </span>
          </div>

          {error && <p className="field__error">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className={`btn-submit${done ? " btn-submit--done" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Creating account…</>
            ) : done ? (
              <><Check size={15} /> Account created</>
            ) : (
              <>Create account <ArrowRight size={15} /></>
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider__line" />
            <span className="divider__text">or sign up with</span>
            <span className="divider__line" />
          </div>

          {/* Social */}
          <div className="social">
            <button type="button" className="social__btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="social__btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="register-card__footer">
          Already have an account?{" "}
          <a href="/" className="register-card__login">Sign in</a>
        </p>

      </form>
    </main>
  );
}
