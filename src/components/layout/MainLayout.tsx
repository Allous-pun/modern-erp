import React from 'react';
import { Outlet } from 'react-router-dom';
import { ERPSidebar } from './ERPSidebar';
import { TopNavbar } from './TopNavbar';
import { SidebarProvider, useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

function MainLayoutContent() {
  const { isCollapsed } = useSidebarContext();
  
  return (
    <div className="min-h-screen w-full bg-background">
      <ERPSidebar />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        // Add left margin on desktop to account for fixed sidebar
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <TopNavbar />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function MainLayout() {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
}
