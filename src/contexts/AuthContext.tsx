import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types/erp';

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Alex Admin',
    email: 'admin@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    department: 'IT',
    title: 'System Administrator',
    isActive: true,
  },
  executive: {
    id: '2',
    name: 'Emma Executive',
    email: 'exec@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=executive',
    role: 'executive',
    department: 'Executive',
    title: 'Chief Executive Officer',
    isActive: true,
  },
  finance: {
    id: '3',
    name: 'Frank Finance',
    email: 'finance@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=finance',
    role: 'finance',
    department: 'Finance',
    title: 'Finance Manager',
    isActive: true,
  },
  hr: {
    id: '4',
    name: 'Hannah HR',
    email: 'hr@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hr',
    role: 'hr',
    department: 'Human Resources',
    title: 'HR Director',
    isActive: true,
  },
  sales: {
    id: '5',
    name: 'Sam Sales',
    email: 'sales@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sales',
    role: 'sales',
    department: 'Sales',
    title: 'Sales Manager',
    isActive: true,
  },
  procurement: {
    id: '6',
    name: 'Paula Procurement',
    email: 'procurement@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=procurement',
    role: 'procurement',
    department: 'Procurement',
    title: 'Procurement Lead',
    isActive: true,
  },
  inventory: {
    id: '7',
    name: 'Ivan Inventory',
    email: 'inventory@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=inventory',
    role: 'inventory',
    department: 'Warehouse',
    title: 'Inventory Manager',
    isActive: true,
  },
  manufacturing: {
    id: '8',
    name: 'Mike Manufacturing',
    email: 'manufacturing@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manufacturing',
    role: 'manufacturing',
    department: 'Production',
    title: 'Production Manager',
    isActive: true,
  },
  project: {
    id: '9',
    name: 'Peter Project',
    email: 'project@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=project',
    role: 'project',
    department: 'Projects',
    title: 'Project Manager',
    isActive: true,
  },
  employee: {
    id: '10',
    name: 'Emily Employee',
    email: 'employee@erp.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=employee',
    role: 'employee',
    department: 'Engineering',
    title: 'Software Developer',
    isActive: true,
  },
  customer: {
    id: '11',
    name: 'Charlie Customer',
    email: 'customer@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
    role: 'customer',
    title: 'Customer',
    isActive: true,
  },
  vendor: {
    id: '12',
    name: 'Victor Vendor',
    email: 'vendor@supplier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vendor',
    role: 'vendor',
    title: 'Vendor',
    isActive: true,
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.admin);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const availableRoles: UserRole[] = [
    'admin',
    'executive',
    'finance',
    'hr',
    'sales',
    'procurement',
    'inventory',
    'manufacturing',
    'project',
    'employee',
    'customer',
    'vendor',
  ];

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // For demo, any email/password works
    const role = email.split('@')[0] as UserRole;
    const matchedUser = mockUsers[role] || mockUsers.admin;
    
    setUser(matchedUser);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        switchRole,
        availableRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
