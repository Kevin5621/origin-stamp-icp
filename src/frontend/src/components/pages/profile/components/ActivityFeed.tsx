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
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="bg-primary/10 rounded-lg p-2">
                <Activity className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your latest art sessions and achievements
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted/20 flex items-start gap-3 rounded-lg border p-4 sm:gap-4 sm:p-5">
                <div className="bg-muted h-8 w-8 flex-shrink-0 rounded-full sm:h-10 sm:w-10"></div>
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-4 w-3/4 rounded"></div>
                    <div className="bg-muted h-5 w-16 rounded-full"></div>
                  </div>
                  <div className="bg-muted h-3 w-1/2 rounded"></div>
                </div>
                <div className="bg-muted h-6 w-16 flex-shrink-0 rounded"></div>
              </div>
              {i < 2 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="bg-primary/10 rounded-lg p-2">
              <Activity className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Your latest art sessions and achievements
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {activities.length === 0 ? (
          <div className="py-8 text-center sm:py-12">
            <div className="bg-muted/20 mx-auto mb-4 w-fit rounded-full p-4 sm:mb-6 sm:p-6">
              <Activity className="text-muted-foreground h-8 w-8 sm:h-12 sm:w-12" />
            </div>
            <h3 className="text-foreground mb-2 text-base font-semibold sm:text-lg">
              No recent activity
            </h3>
            <p className="text-muted-foreground text-sm">
              Start an art session to see your activity here
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="bg-muted/20 flex items-start gap-3 rounded-lg border p-4 sm:gap-4 sm:p-5">
                  <div className="bg-primary/10 flex-shrink-0 rounded-full p-2 sm:p-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-foreground text-sm font-semibold sm:text-base">
                        {activity.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground pr-4 text-xs leading-relaxed sm:text-sm">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground flex flex-shrink-0 items-center gap-1 self-start text-xs">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <Separator className="mt-4 sm:mt-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
