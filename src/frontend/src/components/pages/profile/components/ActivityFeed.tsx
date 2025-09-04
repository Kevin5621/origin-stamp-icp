import React from "react";
import { Activity, Clock, ImageIcon, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ActivityItem {
  id: string;
  type: "session" | "nft" | "achievement" | "collection";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    session_id?: string;
    nft_id?: string;
    achievement_type?: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export const ActivityFeedCard: React.FC<ActivityFeedProps> = ({
  activities,
  isLoading = false,
}) => {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "session":
        return <ImageIcon className="h-4 w-4" />;
      case "nft":
        return <Trophy className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "collection":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityBadgeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "session":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "nft":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "achievement":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "collection":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        return "Just now";
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch {
      return "Unknown time";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest art sessions and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="bg-muted h-8 w-8 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 w-3/4 rounded"></div>
                    <div className="bg-muted h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="bg-muted h-6 w-16 rounded"></div>
                </div>
                {i < 2 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest art sessions and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-muted-foreground text-sm">
              Start an art session to see your activity here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex-shrink-0 rounded-full p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-foreground truncate text-sm font-medium">
                        {activity.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground flex flex-shrink-0 items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
