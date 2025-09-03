import React from "react";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: "report_001",
      name: "Monthly User Activity Report",
      type: "User Analytics",
      period: "March 2024",
      status: "ready",
      size: "2.4 MB",
      generated: "2024-04-01",
    },
    {
      id: "report_002",
      name: "NFT Sales Performance",
      type: "Sales Report",
      period: "Q1 2024",
      status: "generating",
      size: "1.8 MB",
      generated: "2024-04-02",
    },
    {
      id: "report_003",
      name: "Platform Security Audit",
      type: "Security Report",
      period: "March 2024",
      status: "ready",
      size: "5.2 MB",
      generated: "2024-03-28",
    },
  ];

  const reportTemplates = [
    {
      id: "template_001",
      name: "User Activity Report",
      description: "Comprehensive user engagement and activity metrics",
      icon: BarChart3,
    },
    {
      id: "template_002",
      name: "Financial Report",
      description: "Revenue, transactions, and financial performance",
      icon: FileText,
    },
    {
      id: "template_003",
      name: "Security Audit",
      description: "Platform security status and vulnerability assessment",
      icon: FileText,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500 text-white">Ready</Badge>;
      case "generating":
        return <Badge className="bg-blue-500 text-white">Generating</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">
            Generate and view platform reports
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-muted-foreground text-xs">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">Automated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-muted-foreground text-xs">of 10 GB limit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Latest generated reports and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border-border flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">
                        {report.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {report.type} • {report.period} • {report.size} •{" "}
                        {report.generated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {report.status === "ready" && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>
              Quick access to common report types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="border-border flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-secondary/10 rounded-lg p-2">
                        <Icon className="text-secondary-foreground h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-medium">
                          {template.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
