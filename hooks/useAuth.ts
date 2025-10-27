import { useState, useEffect } from 'react';

type User = {
  email: string;
  profilePicture: string;
};

// NOTE: In a real application, passwords would be hashed. Storing plain text is for demonstration purposes only.
type StoredUser = User & { password?: string };

const SIMULATED_DELAY = 1000;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check session
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for an existing session on initial load
    try {
      const loggedInUser = localStorage.getItem('TASKUP_loggedInUser');
      if (loggedInUser) {
        const parsedUser: User = JSON.parse(loggedInUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  }

  const login = async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));

    try {
      const storedUsers = localStorage.getItem('TASKUP_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
      const existingUser = users.find(u => u.email === email);

      if (!existingUser || existingUser.password !== password) {
        throw new Error('Invalid email or password.');
      }
      
      const userData: User = { 
        email: existingUser.email,
        profilePicture: existingUser.profilePicture || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(existingUser.email)}`
      };
      localStorage.setItem('TASKUP_loggedInUser', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));

    try {
        if (!password) {
            throw new Error('Password is required for signup.');
        }

        const storedUsers = localStorage.getItem('TASKUP_users');
        const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
        
        if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }

        const newUser: StoredUser = { 
          email, 
          password, 
          profilePicture: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(email)}` 
        };
        users.push(newUser);
        localStorage.setItem('TASKUP_users', JSON.stringify(users));

        // Automatically log in the user after signup
        await login(email, password);
        return true;

    } catch (err: any) {
        setError(err.message);
        return false;
    } finally {
        setLoading(false);
    }
  };
  
  const signInWithGoogle = async (email: string) => {
    setLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, SIMULATED_DELAY));

    try {
        const profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(email)}`;
        const userData: User = { email, profilePicture };
        
        const storedUsers = localStorage.getItem('TASKUP_users');
        const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
        if (!users.some(u => u.email === email)) {
            users.push({ email, profilePicture }); // No password for Google sign-in
            localStorage.setItem('TASKUP_users', JSON.stringify(users));
        }

        localStorage.setItem('TASKUP_loggedInUser', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
    } catch (err: any) {
        setError('Failed to sign in with Google.');
        return false;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('TASKUP_loggedInUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<Pick<User, 'profilePicture'>>) => {
    if (!user) return;

    const storedUsersJSON = localStorage.getItem('TASKUP_users');
    let users: StoredUser[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
    
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('TASKUP_users', JSON.stringify(users));
    }

    const updatedUser: User = { ...user, ...updates };
    localStorage.setItem('TASKUP_loggedInUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
};

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    signup,
    signInWithGoogle,
    logout,
    clearError,
    updateProfile,
  };
};