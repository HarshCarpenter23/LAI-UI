import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { Progress } from "@/react-app/components/ui/progress";
import {
  SignalTowerIcon,
  CheckRingIcon,
  AlertIcon,
  DangerRingIcon,
  TrendUpIcon,
  FilterIcon,
  SearchIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  SandglassIcon,
} from "@/react-app/components/icons";

interface RiskArea {
  id: string;
  name: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  score: number;
  trend: "up" | "down" | "stable";
  description: string;
  flaggedItems: number;
  lastUpdated: string;
}

export default function DashboardRiskPage() {
  const [riskAreas] = useState<RiskArea[]>([
    {
      id: "1",
      name: "Environmental Compliance",
      category: "Legal",
      riskLevel: "low",
      score: 85,
      trend: "up",
      description: "All environmental regulations compliant",
      flaggedItems: 0,
      lastUpdated: "2024-02-18",
    },
    {
      id: "2",
      name: "Land Lease Agreements",
      category: "Contracts",
      riskLevel: "medium",
      score: 65,
      trend: "down",
      description: "Potential liability in clause 4.2 regarding termination",
      flaggedItems: 2,
      lastUpdated: "2024-02-16",
    },
    {
      id: "3",
      name: "Grid Connection Rights",
      category: "Technical",
      riskLevel: "high",
      score: 35,
      trend: "down",
      description: "Restricted grid access periods during maintenance windows",
      flaggedItems: 5,
      lastUpdated: "2024-02-15",
    },
    {
      id: "4",
      name: "Financing & Loans",
      category: "Financial",
      riskLevel: "low",
      score: 92,
      trend: "stable",
      description: "Favorable loan terms secured",
      flaggedItems: 0,
      lastUpdated: "2024-02-18",
    },
    {
      id: "5",
      name: "Permits & Licenses",
      category: "Regulatory",
      riskLevel: "medium",
      score: 72,
      trend: "up",
      description: "Operating permit expires in 18 months",
      flaggedItems: 1,
      lastUpdated: "2024-02-14",
    },
    {
      id: "6",
      name: "Insurance Coverage",
      category: "Insurance",
      riskLevel: "low",
      score: 88,
      trend: "up",
      description: "Comprehensive coverage in place",
      flaggedItems: 0,
      lastUpdated: "2024-02-17",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string | null>(null);

  const filteredRisks = riskAreas.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterRisk || r.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const riskStats = {
    low: riskAreas.filter((r) => r.riskLevel === "low").length,
    medium: riskAreas.filter((r) => r.riskLevel === "medium").length,
    high: riskAreas.filter((r) => r.riskLevel === "high").length,
  };
  const averageScore =
    Math.round(riskAreas.reduce((s, r) => s + r.score, 0) / riskAreas.length) ||
    0;

  const riskConfig = {
    low: {
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      Icon: CheckRingIcon,
      label: "Low Risk",
      bgIntense: "bg-green-500/20",
    },
    medium: {
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      Icon: AlertIcon,
      label: "Medium Risk",
      bgIntense: "bg-yellow-500/20",
    },
    high: {
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      Icon: DangerRingIcon,
      label: "High Risk",
      bgIntense: "bg-red-500/20",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Assessment</h1>
          <p className="text-muted-foreground">
            Traffic light visualization of project risks across all areas
          </p>
        </div>
        <Button variant="outline" size="sm">
          <TrendUpIcon className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold mt-2">{averageScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Health Rating
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <SignalTowerIcon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {(["low", "medium", "high"] as const).map((level) => {
          const cfg = riskConfig[level];
          return (
            <Card
              key={level}
              className={`bg-card/50 backdrop-blur border-border/50 border-l-4 border-l-${level === "low" ? "green" : level === "medium" ? "yellow" : "red"}-500`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{cfg.label}</p>
                    <p className={`text-2xl font-bold mt-2 ${cfg.color}`}>
                      {riskStats[level]}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
                    <cfg.Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Traffic Light Visualization */}
      <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["low", "medium", "high"] as const).map((level) => {
              const cfg = riskConfig[level];
              return (
                <div key={level} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`relative w-24 h-24 rounded-full ${cfg.bgIntense} border-4 border-${level === "low" ? "green" : level === "medium" ? "yellow" : "red"}-500 flex items-center justify-center animate-pulse`}
                    >
                      <cfg.Icon className={`w-12 h-12 ${cfg.color}`} />
                    </div>
                  </div>
                  <h3 className={`font-semibold mb-2 ${cfg.color}`}>
                    {cfg.label}
                  </h3>
                  <p className={`text-3xl font-bold mb-1 ${cfg.color}`}>
                    {riskStats[level]}
                  </p>
                  <p className="text-sm text-muted-foreground">Areas</p>
                  <p className={`text-xs mt-2 ${cfg.color}`}>
                    {Math.round((riskStats[level] / riskAreas.length) * 100)}%
                    of total
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search risk areas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FilterIcon className="w-4 h-4 mr-2" />
              Risk Level
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterRisk(null)}>
              All Levels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRisk("low")}>
              Low Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRisk("medium")}>
              Medium Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterRisk("high")}>
              High Risk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Risk List */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Risk Areas ({filteredRisks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRisks.length === 0 ? (
            <div className="text-center py-8">
              <SignalTowerIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No risk areas found</p>
            </div>
          ) : (
            filteredRisks.map((risk) => {
              const config = riskConfig[risk.riskLevel];
              return (
                <div
                  key={risk.id}
                  className={`p-4 rounded-xl border transition-colors ${config.border} ${config.bgIntense} hover:opacity-80`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2.5 rounded-lg flex-shrink-0 ${config.bg}`}
                      >
                        <config.Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{risk.name}</h4>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {risk.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {risk.category}
                          </span>
                          {risk.flaggedItems > 0 && (
                            <span className="flex items-center gap-1 text-red-500">
                              <AlertIcon className="w-3 h-3" />
                              {risk.flaggedItems} flagged item
                              {risk.flaggedItems !== 1 ? "s" : ""}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <SandglassIcon className="w-3 h-3" />
                            Updated {risk.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-2xl font-bold">{risk.score}%</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        {risk.trend === "up" ? (
                          <ArrowUpRightIcon className="w-4 h-4 text-green-500" />
                        ) : risk.trend === "down" ? (
                          <ArrowDownRightIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <div className="w-4 h-0.5 bg-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {risk.trend.charAt(0).toUpperCase() +
                            risk.trend.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Risk Score
                      </span>
                      <span className="text-xs font-medium">
                        {risk.score}% Safe
                      </span>
                    </div>
                    <Progress value={risk.score} className="h-2" />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
