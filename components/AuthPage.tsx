import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

interface AuthPageProps {
  onLogin: (email: string, password?: string) => Promise<boolean>;
  onSignup: (email: string, password?: string) => Promise<boolean>;
  onGoogleSignIn: (email: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onGoogleSignIn, loading, error, clearError }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSwitchView = (view: 'login' | 'signup') => {
    clearError();
    setIsLoginView(view === 'login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-900 p-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center items-center space-x-2 mb-8">
            <svg
            className="w-10 h-10 text-blue-600 dark:text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M9 12L11 14L15 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            TASKUP
            </h1>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-fade-in">
          {isLoginView ? (
            <LoginPage 
              onLogin={onLogin} 
              onSwitchToSignup={() => handleSwitchView('signup')} 
              loading={loading}
              error={error}
            />
          ) : (
            <SignupPage 
              onSignup={onSignup} 
              onGoogleSignIn={onGoogleSignIn} 
              onSwitchToLogin={() => handleSwitchView('login')} 
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};