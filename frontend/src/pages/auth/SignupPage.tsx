import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { KoboyoSparkle, KoboyoEditorialPerson } from '@/components/icons/Koboyo';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPasswordLongEnough = password.length >= 8;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      let msg = 'Registration failed. Please verify your details.';
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) {
          msg = `${firstKey}: ${data[firstKey][0]}`;
        } else if (typeof data[firstKey] === 'string') {
          msg = data[firstKey];
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FBFBFA] dark:bg-[#080D0A] text-[#111111] dark:text-[#EDF2EE] font-sans selection:bg-[rgba(76,214,129,0.25)]">
      {/* =========================================================================
          LEFT 55% PANEL: Editorial Minimalist Brand & Person Line Art
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0A100C] text-white p-12 xl:p-16 flex-col justify-between border-r border-neutral-800/80 select-none">
        {/* Subtle, restrained ambient light spot */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(76, 214, 129, 0.6) 0%, rgba(0, 162, 100, 0.2) 60%, transparent 80%)',
          }}
        />

        {/* Top Header / Minimalist Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[rgba(76,214,129,1)] flex items-center justify-center text-[#004D2F] font-semibold">
              <KoboyoSparkle size={16} strokeWidth={2} />
            </div>
            <span className="font-semibold tracking-tight text-base text-white">
              SkillBridge <span className="font-mono text-xs text-[rgba(76,214,129,1)]">AI</span>
            </span>
          </Link>

          <span className="text-[11px] font-mono text-neutral-400">
            Student Edition
          </span>
        </div>

        {/* Center: Handcrafted Koboyo Person Line Art + Editorial Typography */}
        <div className="relative z-10 my-auto py-12 max-w-md space-y-8">
          {/* Koboyo Minimalist Person SVG Icon */}
          <div className="relative w-fit">
            <div className="h-24 w-24 rounded-xl border border-neutral-800 bg-[#0E1712] flex items-center justify-center text-[rgba(76,214,129,0.9)]">
              <KoboyoEditorialPerson size={64} strokeWidth={1.5} />
            </div>
          </div>

          {/* Editorial Headline & Concise Reassurance */}
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-semibold tracking-[-0.03em] text-white leading-[1.18]">
              Start your career, <br />
              backed by live data.
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Connect your academic profile to real-world hiring graphs. Identify skill gaps and prepare role-calibrated resumes.
            </p>
          </div>

          {/* Minimalist Bento Status Card */}
          <div className="p-4 rounded-lg border border-neutral-800/80 bg-[#0E1712]/60 flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(76,214,129,1)]" />
              Free Student Access
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[rgba(0,77,47,0.4)] text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]">
              Batch 2026
            </span>
          </div>
        </div>

        {/* Bottom Minimalist Footer */}
        <div className="relative z-10 pt-6 border-t border-neutral-900 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>SkillBridge AI © 2026</span>
          <span className="text-neutral-400">Registration</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT 45% PANEL: Precision, High-Density Utilitarian Form
          ========================================================================= */}
      <div className="flex-1 lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 md:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header (Visible below 1024px) */}
        <div className="lg:hidden flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/" className="flex items-center gap-2 font-semibold text-base">
            <div className="h-7 w-7 rounded-lg bg-[rgba(76,214,129,1)] flex items-center justify-center text-[#004D2F]">
              <KoboyoSparkle size={14} />
            </div>
            <span>SkillBridge AI</span>
          </Link>
          <Link
            to="/login"
            className="text-xs font-mono px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
          >
            Sign in
          </Link>
        </div>

        <div className="my-auto max-w-sm w-full mx-auto space-y-6 pt-4 sm:pt-0">
          {/* Form Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#111111] dark:text-white">
              Create an account
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#008855] dark:text-[rgba(76,214,129,1)] font-medium hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstName"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block"
                >
                  First name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Zaid"
                  required
                  autoFocus
                  className="w-full h-10 px-3 rounded-lg text-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0D1410] text-[#111111] dark:text-[#EDF2EE] placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lastName"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Alam"
                  className="w-full h-10 px-3 rounded-lg text-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0D1410] text-[#111111] dark:text-[#EDF2EE] placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full h-10 px-3 rounded-lg text-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0D1410] text-[#111111] dark:text-[#EDF2EE] placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  className="w-full h-10 px-3 pr-9 rounded-lg text-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0D1410] text-[#111111] dark:text-[#EDF2EE] placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                  <span className={isPasswordLongEnough ? 'text-[#008855] dark:text-[rgba(76,214,129,1)]' : 'text-neutral-500'}>
                    {isPasswordLongEnough ? '✓ 8+ characters' : '• Must be at least 8 characters'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block"
              >
                Confirm password *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
                className="w-full h-10 px-3 rounded-lg text-sm border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0D1410] text-[#111111] dark:text-[#EDF2EE] placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-colors"
              />
              {confirmPassword && (
                <div className="text-[11px] font-mono pt-0.5">
                  <span className={doPasswordsMatch ? 'text-[#008855] dark:text-[rgba(76,214,129,1)]' : 'text-red-500'}>
                    {doPasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-3 bg-[#004D2F] dark:bg-[rgba(76,214,129,1)] text-white dark:text-[#003822] hover:bg-[#003822] dark:hover:brightness-105"
            >
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-neutral-400 dark:text-neutral-500 leading-relaxed font-mono">
            By registering, you agree to our Terms of Service and data policy.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500 font-mono flex items-center justify-between">
          <span>SkillBridge AI</span>
          <div className="flex items-center gap-3">
            <Link to="/design" className="hover:text-foreground">Preview</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-foreground">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
