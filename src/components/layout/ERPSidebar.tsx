import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, DollarSign, Users, Target, ShoppingBag, Package, 
  FolderKanban, BarChart3, Settings, ChevronDown, ChevronRight,
  FileSpreadsheet, BookOpen, FileText, CreditCard, Receipt, PiggyBank,
  FileBarChart, UserCircle, UserPlus, Clock, CalendarOff, Wallet,
  TrendingUp, GraduationCap, Magnet, Briefcase, Building2, FileEdit,
  ShoppingCart, Megaphone, MessageSquare, Truck, FileQuestion, ClipboardList,
  PackageCheck, CheckSquare, Box, Layers, Warehouse, ArrowLeftRight,
  RefreshCcw, List, Timer, Flag, UserCog, Shield, Building, Puzzle,
  GitBranch, FileSearch, Cog, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/erp';
import { getNavigationForRole } from '@/config/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarContext } from '@/contexts/SidebarContext';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, DollarSign, Users, Target, ShoppingBag, Package,
  FolderKanban, BarChart3, Settings, FileSpreadsheet, BookOpen, FileText,
  CreditCard, Receipt, PiggyBank, FileBarChart, UserCircle, UserPlus,
  Clock, CalendarOff, Wallet, TrendingUp, GraduationCap, Magnet, Briefcase,
  Building2, FileEdit, ShoppingCart, Megaphone, MessageSquare, Truck,
  FileQuestion, ClipboardList, PackageCheck, CheckSquare, Box, Layers,
  Warehouse, ArrowLeftRight, RefreshCcw, List, Timer, Flag, UserCog, Shield,
  Building, Puzzle, GitBranch, FileSearch, Cog
};

const moduleColors: Record<string, string> = {
  finance: 'bg-module-finance/10 text-module-finance border-module-finance/20',
  hr: 'bg-module-hr/10 text-module-hr border-module-hr/20',
  sales: 'bg-module-sales/10 text-module-sales border-module-sales/20',
  procurement: 'bg-module-procurement/10 text-module-procurement border-module-procurement/20',
  inventory: 'bg-module-inventory/10 text-module-inventory border-module-inventory/20',
  projects: 'bg-module-projects/10 text-module-projects border-module-projects/20',
  admin: 'bg-primary/10 text-primary border-primary/20',
};

interface NavItemProps {
  item: NavItem;
  level?: number;
}

function NavItemComponent({ item, level = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isCollapsed, closeMobile } = useSidebarContext();
  
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const isChildActive = item.children?.some(child => child.path === location.pathname);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      closeMobile();
    }
  };

  const content = (
    <>
      <Icon className={cn(
        "h-5 w-5 shrink-0",
        isCollapsed && level === 0 ? "mx-auto" : ""
      )} />
      {(!isCollapsed || level > 0) && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <span className="ml-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </>
      )}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    level > 0 && "ml-4 pl-6 text-xs",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
    isChildActive && !isActive && "text-sidebar-primary",
    isCollapsed && level === 0 && "justify-center px-2"
  );

  return (
    <div>
      {item.path ? (
        <Link
          to={item.path}
          className={baseClasses}
          onClick={handleClick}
        >
          {content}
        </Link>
      ) : (
        <button
          className={cn(baseClasses, "w-full")}
          onClick={handleClick}
        >
          {content}
        </button>
      )}
      
      {hasChildren && isOpen && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarModuleGroupProps {
  item: NavItem;
}

function SidebarModuleGroup({ item }: SidebarModuleGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isCollapsed } = useSidebarContext();
  
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const isChildActive = item.children?.some(child => child.path === location.pathname);
  const moduleColor = item.module ? moduleColors[item.module] : '';

  if (isCollapsed) {
    return (
      <div className="relative group">
        <button
          className={cn(
            "flex items-center justify-center w-full rounded-lg p-2.5 transition-all duration-200",
            "hover:bg-sidebar-accent",
            isChildActive && "bg-sidebar-accent"
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
        {/* Tooltip for collapsed state */}
        <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block">
          <div className="rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg border">
            {item.label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isChildActive && "text-sidebar-primary"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border",
          moduleColor
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="flex-1 text-left">{item.label}</span>
        {item.children && item.children.some(c => c.badge) && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
            {item.children.reduce((acc, c) => acc + (c.badge || 0), 0)}
          </span>
        )}
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-4">
          {item.children?.map((child) => (
            <NavItemComponent key={child.id} item={child} level={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ERPSidebar() {
  const { user } = useAuth();
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarContext();
  
  const navigation = user ? getNavigationForRole(user.role) : [];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isCollapsed && "justify-center px-2"
        )}>
          {isCollapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">E</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-accent-foreground">EnterprisePro</h1>
                <p className="text-xs text-sidebar-foreground/60">ERP System</p>
              </div>
            </div>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className="ml-auto lg:hidden p-2 hover:bg-sidebar-accent rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          <div className="space-y-2">
            {navigation.map((item) => (
              item.children && item.children.length > 0 ? (
                <SidebarModuleGroup key={item.id} item={item} />
              ) : (
                <NavItemComponent key={item.id} item={item} />
              )
            ))}
          </div>
        </nav>
        
        {/* User info at bottom (collapsed shows only avatar) */}
        {user && (
          <div className={cn(
            "border-t border-sidebar-border p-3",
            isCollapsed && "flex justify-center"
          )}>
            {isCollapsed ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full ring-2 ring-sidebar-border"
              />
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-sidebar-muted px-3 py-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full ring-2 ring-sidebar-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize truncate">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
