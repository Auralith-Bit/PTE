import AuthGuard from '@/components/common/AuthGuard';

export default function DashboardRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthGuard>{children}</AuthGuard>;
}
