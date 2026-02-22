import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  HardDrive,
  Eye,
} from "lucide-react";
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

interface Document {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  type: string;
  status: "analyzed" | "pending" | "archived";
  category: string;
}

export default function DashboardDocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "permit_application_2024.pdf",
      size: 2.4,
      uploadDate: "2024-02-18",
      type: "PDF",
      status: "analyzed",
      category: "Permits",
    },
    {
      id: "2",
      name: "land_lease_agreement.docx",
      size: 1.1,
      uploadDate: "2024-02-15",
      type: "Word",
      status: "analyzed",
      category: "Legal",
    },
    {
      id: "3",
      name: "environmental_impact_report.pdf",
      size: 5.8,
      uploadDate: "2024-02-14",
      type: "PDF",
      status: "analyzed",
      category: "Environmental",
    },
    {
      id: "4",
      name: "technical_specifications.xlsx",
      size: 0.8,
      uploadDate: "2024-02-10",
      type: "Excel",
      status: "pending",
      category: "Technical",
    },
    {
      id: "5",
      name: "grid_connection_procedure.pdf",
      size: 3.2,
      uploadDate: "2024-02-08",
      type: "PDF",
      status: "archived",
      category: "Grid",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const downloadDocument = (name: string) => {
    // Simulate download
    console.log(`Downloading ${name}`);
  };

  const archiveDocument = (id: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, status: "archived" } : doc,
      ),
    );
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset the input so the same file can be selected again
    e.currentTarget.value = "";
  };

  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size / (1024 * 1024),
        uploadDate: new Date().toISOString().split("T")[0],
        type: file.type.split("/")[1].toUpperCase() || "File",
        status: "pending",
        category: "Uncategorized",
      };
      setDocuments((prevDocs) => [newDoc, ...prevDocs]);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const statusColor = {
    analyzed: "text-green-500 bg-green-500/10",
    pending: "text-yellow-500 bg-yellow-500/10",
    archived: "text-gray-500 bg-gray-500/10",
  };

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize your project documents
          </p>
        </div>
        <Button className="glow-sm" onClick={triggerFileInput}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold mt-2">{documents.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold mt-2">
                  {totalSize.toFixed(1)} MB
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <HardDrive className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyzed</p>
                <p className="text-2xl font-bold mt-2">
                  {documents.filter((d) => d.status === "analyzed").length}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card
        className={`bg-card/50 backdrop-blur border-border/50 border-2 border-dashed transition-colors cursor-pointer ${
          dragActive ? "border-primary bg-primary/5" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Drag and drop files here</p>
              <p className="text-sm text-muted-foreground">
                or click to select documents (PDF, Word, Excel, CSV, TXT)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
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
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("analyzed")}>
              Analyzed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
              Archived
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Documents Table */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {filteredDocuments.length} Document
            {filteredDocuments.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No documents found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{doc.size.toFixed(1)} MB</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {doc.uploadDate}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusColor[doc.status as keyof typeof statusColor]
                      }`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => downloadDocument(doc.name)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => archiveDocument(doc.id)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
