import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load public pages
const Home = lazy(() => import('../pages/Home'));
const Works = lazy(() => import('../pages/Works'));
const Contact = lazy(() => import('../pages/Contact'));
const DynamicCategoryPage = lazy(() => import('../pages/DynamicCategoryPage'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('../admin/AdminLogin'));
const Dashboard = lazy(() => import('../admin/Dashboard'));
const WorksManager = lazy(() => import('../admin/WorksManager'));
const WorkForm = lazy(() => import('../admin/WorkForm'));
const HomepageManager = lazy(() => import('../admin/HomepageManager'));
const CategoriesManager = lazy(() => import('../admin/CategoriesManager'));
const ContactInquiries = lazy(() => import('../admin/ContactInquiries'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-t border-[#c41e3a] rounded-full animate-spin" />
      <span className="font-ui text-[10px] tracking-[0.4em] text-[#e3bebd]/40">LOADING</span>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="works" element={<Works />} />
          <Route path="contact" element={<Contact />} />
          {/* Dynamic Catch-All for category slugs (like /fashion, /events, or newly added ones) */}
          <Route path=":slug" element={<DynamicCategoryPage />} />
        </Route>

        {/* Admin login (standalone) */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin protected routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="works" element={<WorksManager />} />
          <Route path="works/new" element={<WorkForm />} />
          <Route path="works/edit/:id" element={<WorkForm />} />
          <Route path="homepage" element={<HomepageManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="inquiries" element={<ContactInquiries />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-6">
              <span className="font-serif text-9xl italic text-[#c41e3a]/20">404</span>
              <h1 className="font-serif italic text-3xl text-[#e5e2e1]">Frame Not Found</h1>
              <a href="/" className="font-ui text-[11px] tracking-[0.3em] text-[#c41e3a] border-b border-[#c41e3a]/50 pb-1">
                RETURN HOME
              </a>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
