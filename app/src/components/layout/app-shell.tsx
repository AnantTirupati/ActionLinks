import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  showSearch?: boolean;
  showNavLinks?: boolean;
  activeNavLink?: string;
}

export function AppShell({
  children,
  breadcrumbs,
  showSearch = true,
  showNavLinks = false,
  activeNavLink,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNavbar
          breadcrumbs={breadcrumbs}
          showSearch={showSearch}
          showNavLinks={showNavLinks}
          activeNavLink={activeNavLink}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-[1280px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
