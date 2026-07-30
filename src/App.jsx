import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./store/AppStore";
import { ToastProvider } from "./components/ui/Toast";

// Layouts
import { PublicLayout } from "./components/public/PublicLayout";
import { AppShell } from "./components/layout/AppShell";

// Auth Pages
import { LoginPage, SignupPage, ForgotPasswordPage } from "./pages/AuthPages";

// Public Marketing Pages
import { LandingPage } from "./pages/public/LandingPage";
import { PlatformOverviewPage } from "./pages/public/PlatformOverviewPage";
import { MarketingAgentPage } from "./pages/public/MarketingAgentPage";
import { WebsiteIntelligencePage } from "./pages/public/WebsiteIntelligencePage";
import { PricingPage } from "./pages/public/PricingPage";
import { CustomersPage } from "./pages/public/CustomersPage";
import { BlogPage } from "./pages/public/BlogPage";
import { AboutPage } from "./pages/public/AboutPage";
import { ContactPage } from "./pages/public/ContactPage";
import { DemoPage } from "./pages/public/DemoPage";
import { SecurityPage } from "./pages/public/SecurityPage";
import { IntegrationsPage } from "./pages/public/IntegrationsPage";
import { LegalPages } from "./pages/public/LegalPages";
import { CareersPage } from "./pages/public/CareersPage";
import { NotFoundPage } from "./pages/public/NotFoundPage";

// In-App Dashboard & Module Pages
import { Dashboard } from "./pages/Dashboard";
import { MarketingRunsList } from "./pages/MarketingRunsList";
import { NewMarketingRun } from "./pages/NewMarketingRun";
import { MarketingRunDetail } from "./pages/MarketingRunDetail";
import { ContentPlanningPage } from "./pages/ContentPlanningPage";
import { WebsiteAnalysesList } from "./pages/WebsiteAnalysesList";
import { NewWebsiteAnalysis } from "./pages/NewWebsiteAnalysis";
import { WebsiteAnalysisDetail } from "./pages/WebsiteAnalysisDetail";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Public Site Routes (Wrapped in PublicLayout) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/platform" element={<PlatformOverviewPage />} />
              <Route path="/platform/marketing-agent" element={<MarketingAgentPage />} />
              <Route path="/platform/website-intelligence" element={<WebsiteIntelligencePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:slug" element={<CustomersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/resources" element={<Navigate to="/blog" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/privacy" element={<LegalPages />} />
              <Route path="/terms" element={<LegalPages />} />
              <Route path="/careers" element={<CareersPage />} />
            </Route>

            {/* In-App Product Routes (Wrapped in AppShell under /app) */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="marketing" element={<MarketingRunsList />} />
              <Route path="marketing/automated" element={<NewMarketingRun />} />
              <Route path="marketing/manual" element={<NewMarketingRun />} />
              <Route path="marketing/content" element={<ContentPlanningPage />} />
              <Route path="marketing/new" element={<NewMarketingRun />} />
              <Route path="marketing/runs/:id" element={<MarketingRunDetail />} />
              <Route path="website" element={<WebsiteAnalysesList />} />
              <Route path="website/new" element={<NewWebsiteAnalysis />} />
              <Route path="website/analyses/:id" element={<WebsiteAnalysisDetail />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Routes */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
