import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      handleLogin(token);
    }
  }, []);

  const handleLogin = (token) => {
    try {
      // 🔥 MODE DEMO
      if (token === "demo-token-123") {
        const fakeUser = {
          username: "demo",
          role: "user"
        };

        setUser(fakeUser);
        localStorage.setItem("token", token);
        return;
      }

      // 🔥 MODE NORMAL JWT
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUser(null);
        return;
      }

      setUser(decoded);
      localStorage.setItem("token", token);

    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const login = (token) => {
    handleLogin(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
