import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, Search, Bell, Sun, Moon, Monitor, ChevronDown, LogOut,
  User, Settings, HelpCircle, Keyboard, Globe, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types/erp';

// Mock notifications
const mockNotifications = [
  { id: '1', title: 'New Leave Request', message: 'John Doe requested 3 days leave', time: '5m ago', unread: true },
  { id: '2', title: 'Invoice Approved', message: 'Invoice #INV-2024-001 approved', time: '15m ago', unread: true },
  { id: '3', title: 'Task Completed', message: 'Project milestone reached', time: '1h ago', unread: false },
  { id: '4', title: 'Low Stock Alert', message: 'Product SKU-001 below threshold', time: '2h ago', unread: false },
];

export function TopNavbar() {
  const { user, logout, switchRole, availableRoles } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toggleMobile, toggleCollapsed, isCollapsed } = useSidebarContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const ThemeIcon = themeIcons[theme];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobile}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {/* Desktop collapse button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex"
        onClick={toggleCollapsed}
      >
        {isCollapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Breadcrumb - simple for now */}
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
      </div>

      {/* Search */}
      <div className={cn(
        "flex-1 flex justify-center",
        isSearchOpen ? "absolute inset-x-4 top-3 z-50 md:relative md:inset-auto" : ""
      )}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records, users, docs..."
            className={cn(
              "w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1",
              !isSearchOpen && "hidden md:block"
            )}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
          />
        </div>
      </div>
      
      {/* Mobile search button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
            <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
            <DropdownMenuItem>🇩🇪 Deutsch</DropdownMenuItem>
            <DropdownMenuItem>🇸🇦 العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ThemeIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as any)}>
              <DropdownMenuRadioItem value="light">
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="mr-2 h-4 w-4" /> Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="mr-2 h-4 w-4" /> System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex-col items-start gap-1 p-3">
                <div className="flex w-full items-start gap-2">
                  {notification.unread && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                  <div className={cn("flex-1", !notification.unread && "ml-4")}>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{notification.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-1">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" /> Keyboard shortcuts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Role switcher for demo */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" /> Switch Role (Demo)
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {availableRoles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => switchRole(role)}
                      className={cn(user.role === role && "bg-accent")}
                    >
                      <span className="capitalize">{role}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
