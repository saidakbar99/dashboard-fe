import { useState } from 'react';
import AppSidebar from "./AppSidebar";

export const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {!isSidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 bg-blue-900 text-white p-2 rounded-md shadow-lg sm:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <i className="pi pi-bars text-xl"></i>
        </button>
      )}

      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
  </div>
  )
}
