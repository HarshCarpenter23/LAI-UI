import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Lock,
  Key,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit2,
  Check,
  X,
  Shield,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/react-app/components/ui/tabs";
import { Switch } from "@/react-app/components/ui/switch";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";

export default function DashboardSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@windlegal.de",
    phone: "+49 30 123456",
    company: "Nordwind Legal Consultants",
    jobTitle: "Senior Legal Analyst",
    bio: "Specialized in wind energy legal due diligence and regulatory compliance.",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    riskAlerts: true,
    documentUpdates: true,
    weeklyReport: true,
    projectUpdates: false,
    teamInvites: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark" as "dark" | "light" | "auto",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timezone: "Europe/Berlin",
  });

  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Production API Key",
      created: "2024-01-15",
      lastUsed: "2024-02-18",
      active: true,
    },
    {
      id: "2",
      name: "Development API Key",
      created: "2024-02-01",
      lastUsed: "2024-02-17",
      active: true,
    },
  ]);

  const handleProfileSave = () => {
    setSaveSuccess(true);
    setEditingProfile(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and security
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {saveSuccess && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-700">
                Profile updated successfully!
              </span>
            </div>
          )}

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Profile Information</CardTitle>
              <Button
                variant={editingProfile ? "outline" : "default"}
                size="sm"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-indigo-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                {editingProfile && (
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    First Name
                  </Label>
                  <Input
                    value={profile.firstName}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    value={profile.lastName}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company
                  </Label>
                  <Input
                    value={profile.company}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    Job Title
                  </Label>
                  <Input
                    value={profile.jobTitle}
                    disabled={!editingProfile}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        jobTitle: e.target.value,
                      }))
                    }
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block">Bio</Label>
                <Textarea
                  value={profile.bio}
                  disabled={!editingProfile}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  className="bg-muted/50"
                  rows={4}
                />
              </div>

              {editingProfile && (
                <Button onClick={handleProfileSave} className="glow-sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "emailNotifications" as const,
                  label: "Email Notifications",
                  description: "Receive notifications via email",
                },
                {
                  key: "riskAlerts" as const,
                  label: "Risk Alerts",
                  description: "Get notified about new risk assessments",
                },
                {
                  key: "documentUpdates" as const,
                  label: "Document Updates",
                  description: "Notifications when documents are processed",
                },
                {
                  key: "weeklyReport" as const,
                  label: "Weekly Report",
                  description: "Receive weekly summary reports",
                },
                {
                  key: "projectUpdates" as const,
                  label: "Project Updates",
                  description: "Updates on project progress and status",
                },
                {
                  key: "teamInvites" as const,
                  label: "Team Invites",
                  description: "Notifications about team collaboration invites",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={() => handleNotificationChange(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>Display & Localization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Theme
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light" as const, label: "Light", icon: Sun },
                    { value: "dark" as const, label: "Dark", icon: Moon },
                    { value: "auto" as const, label: "Auto", icon: Settings },
                  ].map((theme) => {
                    const IconComp = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            theme: theme.value,
                          }))
                        }
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                          preferences.theme === theme.value
                            ? "border-primary bg-primary/10"
                            : "border-border/50 hover:border-primary/50"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-sm">{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Language
                </Label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Date Format
                </Label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      dateFormat: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Timezone
                </Label>
                <select
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-foreground"
                >
                  <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <Button className="glow-sm">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>Password & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="bg-muted/50 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-muted/50"
                />
              </div>

              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-muted/50"
                />
              </div>

              <Button className="glow-sm">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>API Keys & Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your API keys for third-party integrations
              </p>

              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        {key.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {key.created} • Last used {key.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          key.active
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {key.active ? "Active" : "Inactive"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteApiKey(key.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Irreversible actions. Please proceed with caution.
              </p>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 border-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout from All Devices
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
