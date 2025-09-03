import React from "react";
import { Camera, Upload, Calendar, CheckCircle, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SessionsPage: React.FC = () => {
  const mySessions = [
    {
      id: "session_001",
      title: "Abstract Digital Painting",
      artworkType: "Digital Art",
      status: "completed",
      photos: 12,
      created: "2 days ago",
      certificateId: "cert_896",
      thumbnailUrl: "/placeholder-art-1.jpg",
    },
    {
      id: "session_002",
      title: "Modern Landscape Series",
      artworkType: "Photography",
      status: "active",
      photos: 8,
      created: "5 hours ago",
      certificateId: null,
      thumbnailUrl: "/placeholder-art-2.jpg",
    },
    {
      id: "session_003",
      title: "Sculpture Documentation",
      artworkType: "Sculpture",
      status: "pending",
      photos: 15,
      created: "1 week ago",
      certificateId: null,
      thumbnailUrl: "/placeholder-art-3.jpg",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-500 text-white">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
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
      case "pending":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      default:
        return <Camera className="text-muted-foreground h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">+2 from last month</p>
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Ready for upload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
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
            <div className="text-2xl font-bold">127</div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mySessions.map((session) => (
              <Card
                key={session.id}
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
                          {session.title}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          {session.artworkType}
                        </p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>{session.photos} photos</span>
                      <span>{session.created}</span>
                    </div>

                    {session.certificateId && (
                      <div className="rounded-md border border-green-200 bg-green-50 p-2">
                        <p className="text-xs font-medium text-green-700">
                          Certificate: {session.certificateId}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      {session.status === "active" && (
                        <Button size="sm" className="flex-1">
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
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mySessions
              .filter((session) => session.status === "active")
              .map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <div className="bg-muted/50 flex aspect-video items-center justify-center">
                    <Camera className="text-muted-foreground h-12 w-12" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-foreground font-semibold">
                      {session.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {session.photos} photos uploaded
                    </p>
                    <Button className="mt-3 w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Continue Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="py-8 text-center">
            <CheckCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Your completed sessions will be displayed here
            </p>
          </div>
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
