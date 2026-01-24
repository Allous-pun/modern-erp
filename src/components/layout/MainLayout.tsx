import React from 'react';
import { Outlet } from 'react-router-dom';
import { ERPSidebar } from './ERPSidebar';
import { TopNavbar } from './TopNavbar';
import { SidebarProvider, useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

function MainLayoutContent() {
  const { isCollapsed } = useSidebarContext();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <ERPSidebar />
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        // On mobile, the sidebar is absolutely positioned, so we don't need margin
        // On desktop, we account for the sidebar width
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
