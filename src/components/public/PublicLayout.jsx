import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col font-sans antialiased">
      <PublicNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
