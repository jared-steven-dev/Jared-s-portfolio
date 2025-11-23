import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.NodeNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

