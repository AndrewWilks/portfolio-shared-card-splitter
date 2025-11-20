import { Sparkles, CreditCard, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils.ts";

/**
 * Welcome step - informational content with app overview
 * Demonstrates non-form content support in multi-step wizard
 */
export function WelcomeStep() {
  const features = [
    {
      icon: CreditCard,
      title: "Shared Card Management",
      description: "Track and split shared credit card expenses with ease",
    },
    {
      icon: Users,
      title: "Fair Allocation",
      description: "Assign each charge to the right person automatically",
    },
    {
      icon: Shield,
      title: "Zero Guesswork",
      description: "Park money safely while the card is interest-free",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-4">
          <Sparkles className="size-10" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Manage Shared Cards Like a Pro
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Fair Share helps you and your partners share a credit card
          cleanly, track expenses, and settle up with complete transparency.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={cn(
                "p-6 rounded-xl border-2 bg-card text-card-foreground",
                "hover:shadow-lg hover:border-primary/20 transition-all duration-200",
                "transform hover:-translate-y-1"
              )}
            >
              <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Icon className="size-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-10 p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 text-center border">
        <p className="text-sm md:text-base text-muted-foreground font-medium">
          ✨ Ready to get started? Let's set up your account in the next steps.
        </p>
      </div>
    </div>
  );
}
