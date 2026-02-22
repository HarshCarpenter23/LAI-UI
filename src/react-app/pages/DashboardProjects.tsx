import { useState } from "react";
import {
  Plus,
  Folder,
  FileText,
  MoreVertical,
  Trash2,
  X,
  FolderPlus,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  MessageSquare,
  Archive,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";

// Sub-components
import { ProjectDetailView } from "./components/projects/ProjectDetailView";

// Data & types
import { INITIAL_PROJECTS } from "./components/projects/data";
import {
  Project,
  ProjectConversation,
  ProjectFile,
} from "./components/projects/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "completed":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "archived":
      return "bg-gray-500/10 text-gray-600 border-gray-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  // ── Derived ──────────────────────────────────────────────────────────────
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) ?? null;

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      instructions: "",
      status: "active",
      owner: "You",
      createdDate: new Date().toISOString().split("T")[0],
      files: [],
      teamMembers: 1,
      conversations: [],
    };
    setProjects((prev) => [project, ...prev]);
    setNewProject({ name: "", description: "" });
    setShowCreateModal(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
  };

  const handleCompleteProject = (id: string) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "completed" } : p)),
    );

  const handleArchiveProject = (id: string) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "archived" } : p)),
    );

  const handleSaveInstructions = (projectId: string, text: string) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, instructions: text } : p)),
    );

  const handleAddFiles = (projectId: string, files: FileList) => {
    const newFiles: ProjectFile[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size / (1024 * 1024),
      uploadDate: new Date().toISOString().split("T")[0],
      type: (file.name.split(".").pop() ?? "file").toUpperCase(),
      lines: Math.floor(Math.random() * 400) + 20,
    }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, files: [...newFiles, ...p.files] } : p,
      ),
    );
  };

  const handleDeleteFile = (projectId: string, fileId: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, files: p.files.filter((f) => f.id !== fileId) }
          : p,
      ),
    );

  const handleAddConversation = (
    projectId: string,
    conv: ProjectConversation,
  ) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, conversations: [conv, ...p.conversations] }
          : p,
      ),
    );

  const handleAddMessage = (
    projectId: string,
    conversationId: string,
    userMsg: string,
    attachments: ProjectFile[] = [],
    aiResponse = "This is an automated response.",
  ) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = {
      id: Date.now().toString(),
      message: userMsg,
      sender: "user" as const,
      timestamp: timeStr,
      attachments,
    };
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      message: aiResponse,
      sender: "assistant" as const,
      timestamp: timeStr,
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              conversations: p.conversations.map((c) =>
                c.id === conversationId
                  ? {
                      ...c,
                      messages: [...c.messages, userMessage, assistantMessage],
                      lastMessage: userMsg,
                      timestamp: "Just now",
                    }
                  : c,
              ),
            }
          : p,
      ),
    );
  };

  // ── Detail view — use fixed positioning to escape main's overflow-auto + p-6 ──
  // The sidebar nav is ~64px wide (the icon sidebar visible in screenshots)
  if (selectedProjectId && selectedProject) {
    return (
      <div
        className="fixed inset-0 z-10"
        style={{ left: "var(--sidebar-width, 64px)" }}
      >
        <ProjectDetailView
          project={selectedProject}
          onBack={() => setSelectedProjectId(null)}
          onComplete={handleCompleteProject}
          onArchive={handleArchiveProject}
          onDelete={handleDeleteProject}
          onSaveInstructions={handleSaveInstructions}
          onAddFiles={handleAddFiles}
          onDeleteFile={handleDeleteFile}
          onAddConversation={handleAddConversation}
          onAddMessage={handleAddMessage}
        />
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your wind energy due diligence projects
          </p>
        </div>
        <Button className="glow-sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Projects",
            value: projects.length,
            icon: FolderPlus,
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
          },
          {
            label: "Active Projects",
            value: projects.filter((p) => p.status === "active").length,
            icon: AlertCircle,
            iconClass: "text-blue-500",
            bgClass: "bg-blue-500/10",
          },
          {
            label: "Completed",
            value: projects.filter((p) => p.status === "completed").length,
            icon: CheckCircle2,
            iconClass: "text-green-500",
            bgClass: "bg-green-500/10",
          },
        ].map(({ label, value, icon: Icon, iconClass, bgClass }) => (
          <Card
            key={label}
            className="bg-card/50 backdrop-blur border-border/50"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold mt-2">{value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${bgClass}`}>
                  <Icon className={`w-5 h-5 ${iconClass}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
              Archived
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedProjectId(project.id)}
            >
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-2 border ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {project.status === "active" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteProject(project.id);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveProject(project.id);
                      }}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.createdDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {project.teamMembers}
                  </div>
                </div>
                <div className="border-t border-border/50 pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{project.conversations.length} chats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{project.files.length} files</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Create New Project</CardTitle>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Windtech Farm Phase 1"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Project description..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateProject}
                  disabled={!newProject.name.trim()}
                >
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
