import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Rail DSS</span>
          </div>
          <Link
            to="/rake-dashboard"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI-Powered Rail
              <span className="block text-primary">Optimization</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Automate rake formation decisions, optimize wagon allocation, and
              reduce freight costs. A Decision Support System designed for modern
              logistics operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/rake-dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/import"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground rounded-lg hover:bg-muted/50 font-semibold transition-colors"
              >
                Import Data <Upload className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 border border-border h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-24 h-24 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Rail Formation Optimization Dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Key Capabilities
            </h2>
            <p className="text-lg text-muted-foreground">
              Intelligent optimization across your entire logistics network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Automated Decisions"
              description="AI-powered rake formation recommendations based on orders, stock, and wagon availability"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Demand Forecasting"
              description="ML models predict customer demand and potential loading delays across routes"
            />
            <FeatureCard
              icon={DollarSign}
              title="Cost Optimization"
              description="Minimize freight costs, demurrage charges, and partial load inefficiencies"
            />
            <FeatureCard
              icon={Clock}
              title="SLA Improvement"
              description="Improve customer delivery timelines with intelligent route planning"
            />
            <FeatureCard
              icon={Users}
              title="Admin Control"
              description="Manual override capabilities for SAIL administrators with full audit trails"
            />
            <FeatureCard
              icon={BarChart3}
              title="Historical Analytics"
              description="Track performance metrics and learn from past rake formations"
            />
          </div>
        </div>
      </section>

      {/* Data Import Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 border border-border h-80 flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Data Import Interface</p>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Bring Your Own Data
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Import plant stock, pending orders, wagon availability, and
                historical rake movement logs. Run optimization end-to-end with
                your real data.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "CSV/Excel upload support",
                  "Automatic data validation",
                  "Schema mapping interface",
                  "Preview optimization results",
                  "Export rake plans",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/import"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-semibold transition-colors"
              >
                Start Importing <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="border-t border-border bg-card/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <WorkflowStep
              number={1}
              title="Import Data"
              description="Upload your plant stock, orders, and wagon logs via CSV/Excel"
            />
            <WorkflowStep
              number={2}
              title="Validate"
              description="System validates data integrity and identifies any issues"
            />
            <WorkflowStep
              number={3}
              title="Optimize"
              description="AI/ML engine generates optimal rake formation plans"
            />
            <WorkflowStep
              number={4}
              title="Deploy"
              description="Review, override if needed, and execute the rake plan"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to optimize your rail operations?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Start with your data and see immediate insights into your logistics
            efficiency.
          </p>
          <Link
            to="/rake-dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-50 font-semibold transition-colors"
          >
            Launch Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Rail DSS</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered decision support for rail logistics optimization
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/rake-dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/import" className="hover:text-foreground">
                    Data Import
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SAIL Rail DSS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface WorkflowStepProps {
  number: number;
  title: string;
  description: string;
}

function WorkflowStep({ number, title, description }: WorkflowStepProps) {
  return (
    <div className="relative">
      {/* Connection line */}
      {number < 4 && (
        <div className="absolute top-16 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-1 bg-gradient-to-r from-primary/50 to-transparent hidden md:block" />
      )}

      <div className="bg-card border border-border rounded-lg p-8 text-center relative">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
          {number}
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}
