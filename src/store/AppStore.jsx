import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { initialRuns, initialAnalyses, MARKETING_AGENTS_DEFINITION, WEBSITE_AGENTS_DEFINITION } from "../mock/initialData";
import { API_BASE_URL } from "../config";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [runs, setRuns] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [user, setUser] = useState({
    id: null,
    name: "Saurabh Dey",
    email: "saurabh@brandsutra.ai",
    role: "Head of Marketing Operations",
    title: "Head of Marketing Operations",
    company: "All Above Design Studio",
    plan: "Enterprise Suite",
    avatar: null
  });

  // Fetch current logged in user from backend DB
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser({
            id: data.data.id,
            name: data.data.name || "Saurabh Dey",
            email: data.data.email || "saurabh@brandsutra.ai",
            role: data.data.role || "Head of Marketing Operations",
            title: data.data.title || "Head of Marketing Operations",
            company: data.data.company || "All Above Design Studio",
            plan: data.data.plan || "Enterprise Suite",
            avatar: data.data.avatarUrl || null
          });
        }
      }
    } catch (e) {
      console.warn("User fetch warning:", e.message);
    }
  }, []);

  // Update user profile in backend DB
  const updateUserProfile = async (updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser((prev) => ({
            ...prev,
            name: data.data.name || prev.name,
            email: data.data.email || prev.email,
            company: data.data.company || prev.company,
            title: data.data.title || prev.title,
            role: data.data.title || prev.role,
            plan: data.data.plan || prev.plan,
            avatar: data.data.avatarUrl || prev.avatar
          }));
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to update user profile in DB:", e);
    }
    // Optimistic local update fallback
    setUser((prev) => ({ ...prev, ...updatedData }));
    return false;
  };

  // Fetch notifications from backend DB
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            read: n.read,
            type: n.type,
            link: n.link,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      }
    } catch (e) {
      console.warn("Notifications fetch warning:", e.message);
    }
  }, []);

  // Mark notification read/unread in DB
  const markNotificationRead = async (id, readState = true) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: readState } : n))
    );
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: readState })
      });
    } catch (e) {
      console.error("Failed to update notification status:", e);
    }
  };

  // Delete single notification from DB
  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  // Clear all notifications from DB
  const clearAllNotifications = async () => {
    setNotifications([]);
    try {
      await fetch(`${API_BASE_URL}/notifications/clear/all`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to clear notifications:", e);
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("brandsutra_token");
    setUser({
      id: null,
      name: "",
      email: "",
      role: "",
      title: "",
      company: "",
      plan: "",
      avatar: null
    });
    window.location.href = "/login";
  };

  // Map backend run to frontend structure
  const mapBackendRunToFrontend = useCallback((bRun) => {
    const agentExecutions = bRun.agentExecutions || [];
    const mappedAgents = MARKETING_AGENTS_DEFINITION.map((def, idx) => {
      const exec = agentExecutions.find((e) => e.agentId === def.id || e.stepNumber === idx + 1);
      let status = "queued";
      if (exec) {
        if (exec.status === "COMPLETED") status = "completed";
        else if (exec.status === "RUNNING") status = "running";
        else if (exec.status === "FAILED") status = "failed";
      }
      return {
        ...def,
        status,
        progress: status === "completed" ? 100 : status === "running" ? 50 : 0
      };
    });

    const logs = (bRun.logs || []).map(
      (l) => `${new Date(l.timestamp).toLocaleTimeString()} [${l.logLevel.toUpperCase()}] ${l.logMessage}`
    );

    const assets = bRun.assets || [];
    const blogAsset = assets.find((a) => a.assetType === "Blog Post");
    const linkedinAssets = assets.filter((a) => a.assetType === "LinkedIn Post");
    const emailAssets = assets.filter((a) => a.assetType === "Email Content");
    const adAssets = assets.filter((a) => a.assetType === "Ad Copy Variant");
    const imageAssets = assets.filter((a) => a.assetType === "Image Prompt");
    const videoAssets = assets.filter((a) => a.assetType === "Video Prompt");

    return {
      id: bRun.id,
      title: bRun.topic ? `${bRun.topic}` : "AI Marketing Run",
      topic: bRun.topic,
      source: bRun.triggerMode === "RSS_TRIGGERED" ? "Automated" : "Manual",
      industry: bRun.industry || "Enterprise SaaS",
      objective: "Generate Leads & Growth",
      targetAudience: bRun.targetAudience || "Decision Makers",
      status: bRun.status?.toLowerCase() || "running",
      overallProgress: bRun.overallProgress || 0,
      createdAt: bRun.createdAt,
      completedAt: bRun.completedAt,
      agents: mappedAgents,
      logs: logs.length > 0 ? logs : [`${new Date().toLocaleTimeString()} [Supervisor] Autonomous pipeline initialized.`],
      summary: bRun.summary,
      agentData: {
        trendIdentification: bRun.trendData || null,
        research: bRun.researchData || null,
        competitiveIntelligence: bRun.competitiveData || null,
        contextMerger: bRun.contextMergerData || null,
        contentStrategy: bRun.strategyData || null,
        contentPlanning: bRun.planningData || null,
        seo: bRun.seoData || null
      },
      outputs: {
        blogPost: blogAsset
          ? { id: blogAsset.id, title: blogAsset.title, readTime: "5 min read", status: blogAsset.status.toLowerCase(), content: blogAsset.content }
          : null,
        linkedinPosts: linkedinAssets.map((a) => ({ id: a.id, type: a.title, status: a.status.toLowerCase(), content: a.content })),
        emailSequence: emailAssets.map((a, idx) => ({ id: a.id, step: idx + 1, subject: a.title, preview: "Email draft...", status: a.status.toLowerCase(), body: a.content })),
        adVariants: adAssets.map((a) => ({ id: a.id, headline: a.title, body: a.content, status: a.status.toLowerCase() })),
        creativeAssets: [
          ...imageAssets.map((a) => ({ id: a.id, title: a.title, type: "Image Prompt", dimensions: a.dimensions || "16:9", content: a.content, status: a.status.toLowerCase() })),
          ...videoAssets.map((a) => ({ id: a.id, title: a.title, type: "Video Prompt", dimensions: a.dimensions || "9:16", content: a.content, status: a.status.toLowerCase() }))
        ]
      }
    };
  }, []);

  // Map backend analysis to frontend structure
  const mapBackendAnalysisToFrontend = useCallback((bAna) => {
    const gapItems = bAna.gapAnalysis || [];
    const scoreCategories = bAna.scoreCategories || [];
    const recs = bAna.recommendations || [];
    const roadmaps = bAna.roadmapItems || [];

    const isCompleted = bAna.status === "COMPLETED";

    const gapObj = {};
    gapItems.forEach((g) => {
      gapObj[g.category] = {
        finding: g.finding,
        severity: g.severity,
        whyItMatters: g.whyItMatters
      };
    });

    const categoriesList = scoreCategories.map((c) => ({ name: c.name, score: c.score }));

    return {
      id: bAna.id,
      url: bAna.url,
      domain: bAna.domain,
      companyName: bAna.companyName,
      industry: bAna.industry,
      status: bAna.status?.toLowerCase() || "analyzing",
      createdAt: bAna.createdAt,
      healthScore: bAna.healthScore,
      agents: WEBSITE_AGENTS_DEFINITION.map((a, idx) => ({
        ...a,
        status: isCompleted ? "completed" : idx === 0 ? "running" : "queued",
        progress: isCompleted ? 100 : idx === 0 ? 50 : 0
      })),
      technicalOverview: bAna.technicalOverview || {
        pagesDiscovered: 24,
        maxDepth: 3,
        sitemapFound: "Yes (sitemap.xml)",
        avgLoadTime: "1.18s"
      },
      pageInventory: (bAna.pageInventory || []).map((p) => ({
        path: p.path,
        pageType: p.pageType,
        title: p.title,
        wordCount: p.wordCount,
        internalLinks: p.internalLinks,
        status: p.status
      })),
      navigationHierarchy: (bAna.navigationHierarchy || []).map((n) => ({
        name: n.name,
        children: []
      })),
      gapAnalysis: Object.keys(gapObj).length > 0 ? gapObj : null,
      scoringBreakdown: categoriesList.length > 0 ? { overall: bAna.healthScore || 75, categories: categoriesList } : null,
      recommendations: recs.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        severity: r.severity,
        impact: r.impact,
        effort: r.effort,
        details: r.details
      })),
      roadmap: {
        now: roadmaps.filter((r) => r.phase === "now").map((r) => ({ title: r.title, category: r.category, effort: r.effort })),
        next: roadmaps.filter((r) => r.phase === "next").map((r) => ({ title: r.title, category: r.category, effort: r.effort })),
        later: roadmaps.filter((r) => r.phase === "later").map((r) => ({ title: r.title, category: r.category, effort: r.effort }))
      }
    };
  }, []);

  // Sync from backend
  const fetchBackendData = useCallback(async () => {
    try {
      const [runsRes, anaRes] = await Promise.all([
        fetch(`${API_BASE_URL}/marketing/runs`).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE_URL}/websites`).then((r) => r.ok ? r.json() : null)
      ]);

      if (runsRes && runsRes.success && Array.isArray(runsRes.data)) {
        const mappedRuns = runsRes.data.map(mapBackendRunToFrontend);
        setRuns(mappedRuns);
      }

      if (anaRes && anaRes.success && Array.isArray(anaRes.data)) {
        const mappedAnalyses = anaRes.data.map(mapBackendAnalysisToFrontend);
        setAnalyses(mappedAnalyses);
      }
    } catch (e) {
      console.warn("Backend poll warning:", e.message);
    }
  }, [mapBackendRunToFrontend, mapBackendAnalysisToFrontend]);

  useEffect(() => {
    fetchUser();
    fetchNotifications();
    fetchBackendData();
  }, [fetchUser, fetchNotifications, fetchBackendData]);

  // Periodic polling if there are running runs/analyses
  useEffect(() => {
    const hasRunning = runs.some((r) => r.status === "running" || r.status === "pending") ||
                       analyses.some((a) => a.status === "analyzing");

    if (hasRunning) {
      const interval = setInterval(() => {
        fetchBackendData();
        fetchNotifications();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [runs, analyses, fetchBackendData, fetchNotifications]);

  const updateAssetStatus = async (runId, assetId, status) => {
    try {
      await fetch(`${API_BASE_URL}/marketing/assets/${assetId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase() })
      });
      fetchBackendData();
    } catch (e) {
      console.error("Failed to update asset status:", e);
    }
  };

  const createRun = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formData.topic || "AI Marketing Strategy Campaign",
          industry: formData.industry || "Enterprise SaaS",
          targetAudience: formData.targetAudience || "Decision Makers",
          triggerMode: formData.source === "Automated" ? "RSS_TRIGGERED" : "MANUAL"
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        fetchBackendData();
        fetchNotifications();
        return data.data.id;
      }
    } catch (e) {
      console.error("Failed to create run via backend API:", e);
    }

    const runId = `RUN-${Math.floor(2500 + Math.random() * 5000)}`;
    return runId;
  };

  const createAnalysis = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/websites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formData.url,
          companyName: formData.companyName,
          industry: formData.industry,
          overview: formData.overview,
          targetAudience: formData.targetAudience,
          products: formData.products || [],
          services: formData.services || [],
          goals: formData.goals || []
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        fetchBackendData();
        fetchNotifications();
        return data.data.id;
      }
    } catch (e) {
      console.error("Failed to create website analysis via backend API:", e);
    }

    const analysisId = `ana-${Math.floor(4000 + Math.random() * 5000)}`;
    return analysisId;
  };

  const reRunAnalysis = async (analysisId) => {
    fetchBackendData();
  };

  return (
    <AppContext.Provider
      value={{
        runs,
        analyses,
        notifications,
        user,
        setUser,
        updateUserProfile,
        createRun,
        createAnalysis,
        reRunAnalysis,
        updateAssetStatus,
        markNotificationRead,
        deleteNotification,
        clearAllNotifications,
        logout,
        refetchUser: fetchUser,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppProvider");
  }
  return context;
}
