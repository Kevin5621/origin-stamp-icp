import React from "react";
import { CreditCard, Crown, Star, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const SubscriptionPage: React.FC = () => {
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      users: 450,
      features: ["5 Sessions/month", "Basic Support", "Standard Quality"],
      color: "bg-gray-500",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19/month",
      users: 320,
      features: [
        "50 Sessions/month",
        "Priority Support",
        "HD Quality",
        "Analytics",
      ],
      color: "bg-blue-500",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49/month",
      users: 180,
      features: [
        "Unlimited Sessions",
        "24/7 Support",
        "4K Quality",
        "Advanced Analytics",
        "API Access",
      ],
      color: "bg-purple-500",
    },
  ];

  const recentSubscriptions = [
    {
      id: "sub_001",
      user: "artist_john",
      plan: "Pro",
      status: "active",
      renewDate: "2024-04-15",
      amount: "$19",
    },
    {
      id: "sub_002",
      user: "photographer_jane",
      plan: "Premium",
      status: "active",
      renewDate: "2024-04-20",
      amount: "$49",
    },
    {
      id: "sub_003",
      user: "collector_bob",
      plan: "Basic",
      status: "expired",
      renewDate: "2024-03-10",
      amount: "Free",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-2xl font-bold">
          Subscription Management
        </h2>
        <p className="text-muted-foreground">
          Manage subscription plans and billing
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-muted-foreground text-xs">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <Crown className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500</div>
            <p className="text-muted-foreground text-xs">+25 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
            <p className="text-muted-foreground text-xs">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-muted-foreground text-xs">
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Overview of available plans and their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden">
                <div className={`h-2 ${plan.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    <span className="text-2xl font-bold">{plan.price}</span>
                  </CardTitle>
                  <CardDescription>
                    {plan.users} active subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-muted-foreground text-sm">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4 w-full">
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>
            Latest subscription activities and renewals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="border-border flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <CreditCard className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">
                      {subscription.user}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {subscription.plan} Plan • {subscription.amount} • Renews{" "}
                      {subscription.renewDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(subscription.status)}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
