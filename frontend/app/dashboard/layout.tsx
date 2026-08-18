import AuthGuard from '@/components/common/AuthGuard';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import Sidebar from '@/components/common/Sidebar';

export default function DashboardRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <DashboardNavbar />
      <div className="flex gap-[10px] min-h-[calc(100vh-65px)] bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
