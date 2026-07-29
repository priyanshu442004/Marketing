import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppStore";
import { ToastProvider } from "./components/ui/Toast";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { Dashboard } from "./pages/Dashboard";
import { MarketingRunsList } from "./pages/MarketingRunsList";
import { NewMarketingRun } from "./pages/NewMarketingRun";
import { MarketingRunDetail } from "./pages/MarketingRunDetail";
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/marketing" element={<MarketingRunsList />} />
              <Route path="/marketing/new" element={<NewMarketingRun />} />
              <Route path="/marketing/runs/:id" element={<MarketingRunDetail />} />
              <Route path="/website" element={<WebsiteAnalysesList />} />
              <Route path="/website/new" element={<NewWebsiteAnalysis />} />
              <Route path="/website/analyses/:id" element={<WebsiteAnalysisDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
