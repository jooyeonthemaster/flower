'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';
import Header from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* pt-24: Header 높이(80px) + 여유 공간 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-28">
                <MyPageSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
