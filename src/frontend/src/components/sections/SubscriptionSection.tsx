"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import {
  subscriptionService,
  type SubscriptionPlan,
} from "@/services/subscriptionService";

export function SubscriptionSection() {
  const [isLoading, setIsLoading] = useState(false);
  const plans = subscriptionService.getSubscriptionPlans();

  const handleGetStarted = (plan: SubscriptionPlan) => {
    setIsLoading(true);
    // Navigate to dashboard subscription page with selected plan
    window.location.href = `/dashboard/subscription?plan=${plan.tier}`;
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setIsLoading(true);
    // Navigate to dashboard subscription page with selected plan
    window.location.href = `/dashboard/subscription?plan=${plan.tier}`;
  };

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 mb-4"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Pricing Plans
          </Badge>
          <h2 className="text-foreground mb-6 text-3xl font-light md:text-4xl lg:text-5xl">
            Choose Your{" "}
            <span className="text-primary font-medium">Perfect Plan</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Start with our free tier and upgrade as your art authentication
            needs grow. All plans include blockchain verification and secure
            storage.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-primary scale-105 shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Crown className="mr-1 h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-foreground text-2xl font-medium">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-foreground text-3xl font-light">
                    {plan.price}
                  </span>
                  {plan.tier !== "Free" && (
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-primary/10 rounded-full p-1">
                        <Check className="text-primary h-3 w-3" />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Photos per session:
                    </span>
                    <span className="text-foreground font-medium">
                      {plan.limits.max_photos}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      File size limit:
                    </span>
                    <span className="text-foreground font-medium">
                      {plan.limits.max_file_size_mb}MB
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      NFT generation:
                    </span>
                    <span className="text-foreground font-medium">
                      {plan.limits.can_generate_nft ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() =>
                    plan.tier === "Free"
                      ? handleGetStarted(plan)
                      : handleUpgrade(plan)
                  }
                  disabled={isLoading}
                >
                  {plan.tier === "Free" ? "Get Started" : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card mx-auto max-w-2xl rounded-2xl border p-8">
            <h3 className="text-foreground mb-4 text-xl font-medium">
              Need a custom plan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact us for custom pricing and features tailored to your
              specific needs.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="outline" className="px-8">
                Contact Sales
              </Button>
              <Button className="px-8">
                <Zap className="mr-2 h-4 w-4" />
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
