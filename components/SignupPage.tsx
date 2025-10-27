import React, { useState } from 'react';
import { GoogleIcon, EyeIcon, EyeOffIcon } from './icons';

interface SignupPageProps {
  onSignup: (email: string, password?: string) => Promise<boolean>;
  onGoogleSignIn: (email: string) => Promise<boolean>;
  onSwitchToLogin: () => void;
  loading: boolean;
  error: string | null;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onGoogleSignIn, onSwitchToLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignup(email, password);
    }
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleEmail) {
        onGoogleSignIn(googleEmail);
    }
  }

  if (showGooglePrompt) {
    return (
        <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Sign up with Google</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Please enter your email to continue.</p>
            
            {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium p-3 rounded-lg text-center mb-4">{error}</p>}

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="google-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                    </label>
                    <div className="mt-1">
                    <input
                        id="google-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 outline-none transition disabled:opacity-50"
                        placeholder="you@example.com"
                        disabled={loading}
                        autoFocus
                    />
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <button type="button" onClick={() => setShowGooglePrompt(false)} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !googleEmail}
                        className="flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {loading ? 'Signing in...' : 'Continue'}
                    </button>
                </div>
            </form>
        </div>
    )
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Create an Account</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Get started with TASKUP today.</p>

      {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium p-3 rounded-lg text-center mb-4">{error}</p>}
      
      <div>
          <button
            onClick={() => setShowGooglePrompt(true)}
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
      </div>

      <div className="mt-6 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="mt-1">
            <input
              id="email-signup"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 outline-none transition disabled:opacity-50"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password-signup"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 outline-none transition disabled:opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50" disabled={loading}>
          Sign in
        </button>
      </p>
    </div>
  );
};