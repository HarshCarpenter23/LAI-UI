import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Folder,
  Wind,
  PanelLeftClose,
  PanelLeft,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Logo } from "@/react-app/components/Logo";
import { useAuth } from "@/react-app/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/react-app/components/ui/avatar";

const navigation = [
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Projects", href: "/dashboard/projects", icon: Folder },
  { name: "Risk Assessment", href: "/dashboard/risk", icon: BarChart3 },
];

const secondaryNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

// Demo conversation data
const demoConversations: Conversation[] = [
  {
    id: "1",
    title: "Nordwind Park permit analysis",
    preview: "Reviewing BImSchG permits and environmental...",
    timestamp: new Date(),
  },
  {
    id: "2",
    title: "Land lease agreement review",
    preview: "Analyzing clause 4.2 regarding termination...",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    title: "Grid connection contracts",
    preview: "What are the key risks in the Einspeisezusage...",
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  // Show conversations only on chat page
  const isOnChatPage = location.pathname === "/dashboard/chat";

  // Generate user initials from email
  const userInitials =
    user?.email
      ?.split("@")[0]
      .split("")
      .slice(0, 2)
      .map((c) => c.toUpperCase())
      .join("") || "JD";

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo & Collapse */}
        <div className="flex flex-col border-b border-sidebar-border">
          {/* Logo */}
          <div
            className={`h-16 flex items-center px-4 ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
            ) : (
              <Logo size="sm" />
            )}
          </div>

          {/* Collapse Toggle */}
          <div className="px-3 py-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-colors"
            >
              {collapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div
            className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${collapsed ? "hidden" : "px-3"}`}
          >
            Main
          </div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? "" : "text-muted-foreground"}`}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}

          <div
            className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-3 ${collapsed ? "hidden" : "px-3"}`}
          >
            Support
          </div>
          {secondaryNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? "" : "text-muted-foreground"}`}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}

          {/* Conversations Section - Only show on chat page */}
          {isOnChatPage && !collapsed && (
            <>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-3 px-3">
                Conversations
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>

                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      activeConversationId === conv.id
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "hover:bg-sidebar-accent"
                    }`}
                    onClick={() => setActiveConversationId(conv.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sidebar-foreground truncate">{conv.title}</p>
                      <p className="text-muted-foreground truncate text-xs">{conv.preview}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                          <MoreVertical className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setConversations(conversations.filter((c) => c.id !== conv.id));
                            if (activeConversationId === conv.id) {
                              setActiveConversationId(null);
                            }
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* User Section */}
        <div
          className={`p-3 border-t border-sidebar-border ${collapsed ? "flex justify-center" : ""}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-sidebar-accent transition-colors ${collapsed ? "justify-center" : ""}`}
              >
                <Avatar className="w-9 h-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">
                      {user?.email || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Logged in
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 h-full flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Page Content */}
        <main className={`flex-1 h-full ${isOnChatPage ? "overflow-hidden p-0" : "overflow-auto p-6"}`}>
          <Outlet context={{ activeConversationId, setActiveConversationId, conversations, setConversations }} />
        </main>
      </div>
    </div>
  );
}
