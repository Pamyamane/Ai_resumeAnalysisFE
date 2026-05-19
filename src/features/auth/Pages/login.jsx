import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handlelogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await handlelogin({ email, password });
      setDone(true);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      setError(err.message || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

const googleLogin = () => {

   const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const redirectUri =
    "https://ai-resume-analysis-be.vercel.app/auth/google/callback";

  const scope = "profile email";

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}`;

  window.location.href = authUrl;
};
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleLogin}>

        {/* Header */}
        <div className="login-card__header">
          <div className="login-card__logo">
            <Sparkles size={20} />
          </div>
          <h1 className="login-card__title">Welcome back</h1>
          <p className="login-card__subtitle">Sign in to continue to your account</p>
        </div>

        {/* Fields */}
        <div className="login-card__body">

          {/* Email */}
          <div className="field">
            <label className="field__label">Email</label>
            <div className="field__input-wrap">
              <Mail size={15} className="field__icon" />
              <input
                className="field__input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <div className="field__label-row">
              <label className="field__label">Password</label>
              <a href="#" className="field__forgot">Forgot password?</a>
            </div>
            <div className="field__input-wrap">
              <Lock size={15} className="field__icon" />
              <input
                className="field__input field__input--padded-right"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="field__eye"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="remember" onClick={() => setRemember(r => !r)}>
            <div className={`remember__box${remember ? " remember__box--checked" : ""}`}>
              {remember && <Check size={10} strokeWidth={3} />}
            </div>
            <span className="remember__label">Remember me for 30 days</span>
          </div>

          {error && <p className="field__error">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className={`btn-signin${done ? " btn-signin--done" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Signing in…</>
            ) : done ? (
              <><Check size={15} /> Signed in</>
            ) : (
              <>Sign in <ArrowRight size={15} /></>
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider__line" />
            <span className="divider__text">or</span>
            <span className="divider__line" />
          </div>

          {/* Social */}
          <div className="social">
            <button onClick={googleLogin} type="button" className="social__btn">
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
        <p className="login-card__footer">
          Don't have an account?{" "}
          <a href="/register" className="login-card__signup">Sign up</a>
        </p>

      </form>
    </main>
  );
}
