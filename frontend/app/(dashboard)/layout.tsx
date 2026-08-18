import AuthGuard from '@/components/common/AuthGuard';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import Sidebar from '@/components/common/Sidebar';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <DashboardNavbar />
      <div className="flex gap-[clamp(16px,2.55vw,50px)] min-h-[calc(100vh-65px)] bg-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
