// System notifications & activity feed stream
export const initialNotifications = [
  {
    id: "notif-1",
    title: "Run RUN-2481 Step 7 Completed",
    message: "Content Planning agent generated 30-day editorial schedule.",
    time: "10 min ago",
    read: false,
    link: "/marketing/runs/RUN-2481"
  },
  {
    id: "notif-2",
    title: "New Website Analysis Completed",
    message: "Audit for acmecloud.io completed with Health Score 68/100.",
    time: "1 hour ago",
    read: false,
    link: "/website/analyses/ana-4081"
  },
  {
    id: "notif-3",
    title: "Asset Approval Pending",
    message: "LinkedIn Executive Post for RUN-2480 requires human review.",
    time: "3 hours ago",
    read: true,
    link: "/marketing/runs/RUN-2480"
  }
];

export const systemActivityFeed = [
  { time: "10:45 AM", text: "RUN-2481 Manufacturing pipeline reached Step 7 (Content Planning)." },
  { time: "09:30 AM", text: "Website audit completed for acmecloud.io with Health Score 68." },
  { time: "Yesterday", text: "LinkedIn asset-902 approved for RUN-2480 Multi-Cloud marketing run." },
  { time: "2 days ago", text: "New website audit initiated for finverse-pay.com." }
];
