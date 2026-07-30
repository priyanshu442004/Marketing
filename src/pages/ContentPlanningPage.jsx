import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const posts = [
  {
    title: "The Future of Autonomous Operations",
    platform: "LinkedIn",
    preview: "A practical guide to combining human oversight with agent-driven workflows for faster execution.",
    status: "Approved",
  },
  {
    title: "Weekly Product Brief: New AI Workflow",
    platform: "Blog",
    preview: "Highlights the latest strategy updates and the operational gains unlocked by the new workflow.",
    status: "Ready",
  },
  {
    title: "Customer Story: Scaling With Confidence",
    platform: "Newsletter",
    preview: "A short narrative overview of how teams use structured review cycles to ship faster.",
    status: "Approved",
  },
];

export function ContentPlanningPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left font-sans">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
          Module 1 — Content Planning
        </span>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Approved Post List
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Review approved content and choose to publish it now or schedule it for later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <Card key={index} className="space-y-4">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{post.title}</CardTitle>
                <Badge variant={post.status === "Approved" ? "accent" : "neutral"}>{post.status}</Badge>
              </div>
              <CardDescription>{post.platform}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-ink-muted leading-relaxed">{post.preview}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="primary">
                  Post Immediately
                </Button>
                <Button size="sm" variant="secondary">
                  Schedule Post
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
