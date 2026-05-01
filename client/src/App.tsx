import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/PublicLayout";
import { AdminLayout } from "./components/AdminLayout";
import { AdminAccessRoute } from "./components/AdminAccessRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { AboutPage } from "./pages/AboutPage";
import { LocationPage } from "./pages/LocationPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminAccessPage } from "./pages/AdminAccessPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminContentPage } from "./pages/AdminContentPage";
import { AdminPricingPage } from "./pages/AdminPricingPage";
import { AdminBrandingPage } from "./pages/AdminBrandingPage";
import { ADMIN_ROUTE_PATH } from "./lib/admin";
import { LanguageProvider } from "./lib/i18n";

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path={ADMIN_ROUTE_PATH}>
          <Route path="access" element={<AdminAccessPage />} />
          <Route
            path="login"
            element={
              <AdminAccessRoute>
                <AdminLoginPage />
              </AdminAccessRoute>
            }
          />
          <Route
            element={
              <AdminAccessRoute>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </AdminAccessRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="branding" element={<AdminBrandingPage />} />
            <Route path="content" element={<AdminContentPage />} />
          </Route>
        </Route>

        <Route path="admin/*" element={<Navigate to="/" replace />} />
        <Route path="cars" element={<Navigate to="/services" replace />} />
        <Route path="cars/*" element={<Navigate to="/services" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}
