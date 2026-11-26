import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-x-clip">
      {children}
    </div>
  );
}
