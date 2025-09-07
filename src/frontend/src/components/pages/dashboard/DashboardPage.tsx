import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import {
  DashboardMetrics,
  PortfolioChart,
  QuickActions,
  PerformanceStats,
} from "./components";

export const DashboardPage: React.FC = () => {
  const { metrics, chartData, performanceStats, loading, error, refreshData } =
    useUserDashboard();

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-600">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Welcome Message */}
      <div className="from-primary/10 to-secondary/10 rounded-lg bg-gradient-to-r p-6">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          Welcome back, Artist! 🎨
        </h2>
        <p className="text-muted-foreground">
          Ready to create and certify your next masterpiece? Start a new art
          session or explore the marketplace.
        </p>
      </div>

      {/* Metrics Cards */}
      {metrics && <DashboardMetrics metrics={metrics} loading={loading} />}

      {/* Performance Overview - Top Section */}
      {performanceStats && (
        <PerformanceStats
          performanceStats={performanceStats}
          loading={loading}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Portfolio Overview - Left Side (8 columns) */}
        <div className="lg:col-span-8">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">
              Portfolio Overview
            </h3>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="collection">Collection</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-card-foreground text-sm font-medium">
                      Total Art Value
                    </h4>
                    <p className="text-card-foreground text-2xl font-bold">
                      {metrics
                        ? `${metrics.portfolio_value_icp.toFixed(2)} ICP`
                        : "0.00 ICP"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {metrics
                        ? `+${metrics.portfolio_growth_percentage.toFixed(1)}% from last month`
                        : "No data available"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-card-foreground text-sm font-medium">
                      Active Sessions
                    </h4>
                    <p className="text-card-foreground text-2xl font-bold">
                      {metrics ? metrics.active_sessions : 0}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {metrics
                        ? `${metrics.certificates_created} certificates created`
                        : "No sessions yet"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="mt-6">
                <div className="py-8 text-center">
                  <div className="text-muted-foreground bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    🎨
                  </div>
                  <p className="text-muted-foreground">
                    Your art sessions activity will be displayed here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="collection" className="mt-6">
                <div className="py-8 text-center">
                  <div className="text-muted-foreground bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    📦
                  </div>
                  <p className="text-muted-foreground">
                    Your NFT collection overview will be displayed here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Actions - Right Side (4 columns) */}
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
      </div>

      {/* Portfolio Growth Chart - Full Width Bottom Section */}
      {chartData && <PortfolioChart chartData={chartData} loading={loading} />}
    </div>
  );
};
