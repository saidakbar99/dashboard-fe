import AppSidebar from "./AppSidebar";

const Layout = ({ children }) => (
  <div className="flex h-[100vh]">
    <AppSidebar />
    <main className="flex-1 p-4">
        {children}
    </main>
  </div>
);

export default Layout;