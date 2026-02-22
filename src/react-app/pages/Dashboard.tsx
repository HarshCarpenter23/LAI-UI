import {
  FileText,
  MessageSquare,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Zap,
  Wind,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";

const stats = [
  {
    title: "Documents Analyzed",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Active Projects",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Wind,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    title: "AI Conversations",
    value: "342",
    change: "+28%",
    trend: "up",
    icon: MessageSquare,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Risk Assessments",
    value: "56",
    change: "+5",
    trend: "up",
    icon: BarChart3,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const recentProjects = [
  {
    name: "Nordwind Park Due Diligence",
    status: "In Progress",
    progress: 65,
    documents: 124,
    risk: "medium",
  },
  {
    name: "Bavaria Solar-Wind Hybrid",
    status: "Review",
    progress: 90,
    documents: 89,
    risk: "low",
  },
  {
    name: "Baltic Offshore Expansion",
    status: "Started",
    progress: 25,
    documents: 45,
    risk: "high",
  },
];

const riskIndicator = {
  low: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: CheckCircle2,
    label: "Low Risk",
  },
  medium: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    icon: AlertTriangle,
    label: "Medium Risk",
  },
  high: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: XCircle,
    label: "High Risk",
  },
};

const recentActivity = [
  {
    action: "Document uploaded",
    item: "permit_application_2024.pdf",
    time: "5 min ago",
    icon: FileText,
  },
  {
    action: "AI analysis completed",
    item: "Environmental impact report",
    time: "23 min ago",
    icon: Zap,
  },
  {
    action: "Risk flagged",
    item: "Land lease agreement clause 4.2",
    time: "1 hour ago",
    icon: AlertTriangle,
  },
  {
    action: "Project created",
    item: "Baltic Offshore Expansion",
    time: "3 hours ago",
    icon: Wind,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, John. Here's your legal AI overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/chat">
            <Button className="glow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card/50 backdrop-blur border-border/50"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-500">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                Active Projects
              </CardTitle>
              <Link to="/dashboard/projects">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => {
                const risk =
                  riskIndicator[project.risk as keyof typeof riskIndicator];
                return (
                  <div
                    key={project.name}
                    className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.documents} documents
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}
                      >
                        <risk.icon className="w-3 h-3" />
                        {risk.label}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {project.status}
                        </span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted/50 flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.item}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/10 via-indigo-500/10 to-blue-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Due Diligence</h3>
                <p className="text-sm text-muted-foreground">
                  Upload documents and get AI analysis in minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard/documents">
                <Button variant="outline">Upload Documents</Button>
              </Link>
              <Link to="/dashboard/chat">
                <Button className="glow-sm">Start AI Chat</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
