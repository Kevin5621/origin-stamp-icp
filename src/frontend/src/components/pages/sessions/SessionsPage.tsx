import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, Calendar, CheckCircle, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  PhysicalArtService,
  type PhysicalArtSession,
} from "@/services/physicalArtService";

export const SessionsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { error: showError } = useToastContext();

  const [sessions, setSessions] = useState<PhysicalArtSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const loadUserSessions = useCallback(async () => {
    if (!user?.username) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userSessions = await PhysicalArtService.getUserSessions(
        user.username,
      );
      setSessions(userSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      showError("Failed to load your art sessions");
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, showError]);

  useEffect(() => {
    loadUserSessions();
  }, [user?.username, loadUserSessions]);

  const handleCreateSession = async () => {
    if (!user?.username) {
      showError("Please log in to create a session");
      return;
    }

    setIsCreatingSession(true);
    try {
      router.push("/dashboard/sessions/create");
    } catch (error) {
      console.error("Failed to navigate to create session:", error);
      showError("Failed to navigate to create session");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-500 text-white">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "active":
        return <Upload className="h-4 w-4 text-blue-500" />;
      case "draft":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      default:
        return <Camera className="text-muted-foreground h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Spinner variant="infinite" size="lg" />
          <p className="text-muted-foreground mt-4">
            Loading your art sessions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            My Art Sessions
          </h2>
          <p className="text-muted-foreground">
            Document your artwork creation process and get certified
          </p>
        </div>
        <Button
          onClick={handleCreateSession}
          disabled={isCreatingSession}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isCreatingSession ? (
            <Spinner variant="infinite" size="sm" className="mr-2" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Start New Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Camera className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Upload className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                sessions.filter(
                  (s) => s.status === "active" || s.status === "draft",
                ).length
              }
            </div>
            <p className="text-muted-foreground text-xs">Ready for upload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.status === "completed").length}
            </div>
            <p className="text-muted-foreground text-xs">All verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Photos Uploaded
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce(
                (total, session) =>
                  total + (session.uploaded_photos?.length || 0),
                0,
              )}
            </div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {sessions.length === 0 ? (
            <div className="py-16 text-center">
              <Camera className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                No Art Sessions Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start documenting your artwork creation process to get certified
                NFTs
              </p>
              <Button
                onClick={handleCreateSession}
                disabled={isCreatingSession}
              >
                {isCreatingSession ? (
                  <Spinner variant="infinite" size="sm" className="mr-2" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Your First Session
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <Card
                  key={session.session_id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  {/* Artwork Thumbnail */}
                  <div className="bg-muted/50 relative flex aspect-video items-center justify-center">
                    <Camera className="text-muted-foreground h-12 w-12" />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(session.status)}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-foreground text-sm leading-tight font-semibold">
                            {session.art_title}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {session.description || "No description"}
                          </p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>

                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>
                          {session.uploaded_photos?.length || 0} photos
                        </span>
                        <span>
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {session.status === "completed" && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-2">
                          <p className="text-xs font-medium text-green-700">
                            Certificate Generated
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            router.push(
                              `/dashboard/sessions/${session.session_id}`,
                            )
                          }
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        {(session.status === "active" ||
                          session.status === "draft") && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              router.push(
                                `/dashboard/sessions/${session.session_id}`,
                              )
                            }
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {sessions.filter((s) => s.status === "active" || s.status === "draft")
            .length === 0 ? (
            <div className="py-8 text-center">
              <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                No active sessions. Create a new session to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions
                .filter(
                  (session) =>
                    session.status === "active" || session.status === "draft",
                )
                .map((session) => (
                  <Card key={session.session_id} className="overflow-hidden">
                    <div className="bg-muted/50 flex aspect-video items-center justify-center">
                      <Camera className="text-muted-foreground h-12 w-12" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-foreground font-semibold">
                        {session.art_title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {session.uploaded_photos?.length || 0} photos uploaded
                      </p>
                      <Button
                        className="mt-3 w-full"
                        onClick={() =>
                          router.push(
                            `/dashboard/sessions/${session.session_id}`,
                          )
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Continue Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {sessions.filter((s) => s.status === "completed").length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                Your completed sessions will be displayed here
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions
                .filter((session) => session.status === "completed")
                .map((session) => (
                  <Card key={session.session_id} className="overflow-hidden">
                    <div className="bg-muted/50 flex aspect-video items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-foreground font-semibold">
                        {session.art_title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Certificate generated
                      </p>
                      <Button variant="outline" className="mt-3 w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="py-8 text-center">
            <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Sessions awaiting review will be displayed here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
