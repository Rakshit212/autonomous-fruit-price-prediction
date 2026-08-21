import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  farmName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("agro_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string) => {
    // Mock user data
    const mockUser = {
      id: "1",
      name: "Demo Farmer",
      email: email,
      farmName: "Green Acres Farm",
    };
    setUser(mockUser);
    localStorage.setItem("agro_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agro_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
