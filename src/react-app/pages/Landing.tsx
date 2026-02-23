import { Link } from "react-router";
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  BarChart3,
  FileSearch,
  Wind,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Logo } from "@/react-app/components/Logo";
import { ThemeToggle } from "@/react-app/components/ThemeToggle";

const stats = [
  { value: "5", unit: "days", label: "vs 8-12 weeks traditional" },
  { value: "50%", unit: "", label: "cost reduction" },
  { value: "99.5%", unit: "", label: "accuracy rate" },
];

const features = [
  {
    icon: FileSearch,
    title: "Automated Document Analysis",
    description:
      "Process hundreds of legal documents in minutes with intelligent extraction",
  },
  {
    icon: BarChart3,
    title: "Traffic Light Assessment",
    description:
      "Visual risk categorization with red, yellow, green indicators for quick decisions",
  },
  {
    icon: Shield,
    title: "Regulatory Monitoring",
    description:
      "Real-time tracking of German wind energy law changes and compliance updates",
  },
  {
    icon: Clock,
    title: "5-Day Workflow",
    description:
      "Transform months of manual review into an automated 5-day process",
  },
  {
    icon: Zap,
    title: "Enterprise Ready",
    description:
      "Bank-grade security with SOC 2 compliance and German data residency",
  },
];

const workflow = [
  {
    step: 1,
    title: "Upload Documents",
    description: "Drag and drop your due diligence documents",
  },
  {
    step: 2,
    title: "AI Analysis",
    description: "LAI processes and extracts key legal information",
  },
  {
    step: 3,
    title: "Risk Assessment",
    description: "Get visual traffic light risk indicators",
  },
  {
    step: 4,
    title: "Generate Report",
    description: "Export comprehensive due diligence reports",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#workflow"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </a>
              
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="glow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Wind className="w-4 h-4" />
              Revolutionizing Wind Energy Due Diligence in Germany
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Legal AI That Transforms
              <span className="block text-gradient mt-2">
                Due Diligence Forever
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform your wind energy due diligence from a manual 8-12 week
              process into an automated 5-day workflow. Reduce costs by 50%
              while achieving 99.5% accuracy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/signup">
                <Button size="lg" className="glow text-lg px-8 h-14">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 h-14">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gradient">
                    {stat.value}
                    <span className="text-primary">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enterprise-Grade Legal AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for German wind energy regulations with
              cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section
        id="workflow"
        className="py-20 border-t border-border/50 bg-card/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How LAI Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to revolutionize your due diligence process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-2xl font-bold text-white mb-4 glow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {index < workflow.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-primary/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card/80 backdrop-blur border border-border/50 rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Due Diligence?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join leading wind energy companies already using LAI to
                accelerate their legal workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
