import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I upload order data?",
    answer: "Go to the 'Data Upload' tab, drag & drop your CSV file or click to select. The system will validate column names and data types. Required columns: order_id, customer_name, customer_location, product_type, material_grade, quantity_tonnes, destination, priority, due_date, preferred_mode, distance_km, penalty_rate_per_day.",
  },
  {
    question: "What format should my CSV file be in?",
    answer: "Standard CSV format with headers in the first row. Use comma separators, and quote strings that contain commas. Example: 'ORD-001,ABC Corp,Delhi,Hot Rolled Coils,High Grade,45,Bokaro,1,2025-12-25,Rail,1200,500'",
  },
  {
    question: "How does the AI optimizer work?",
    answer: "The optimizer uses a multi-step algorithm: (1) Parse and validate order data, (2) Group orders by destination & priority, (3) Assign to available rakes respecting platform capacity, (4) Optimize wagon utilization within constraints, (5) Fall back to road transport if rail unavailable. It balances cost minimization and SLA compliance based on your parameters.",
  },
  {
    question: "What does 'utilization %' mean?",
    answer: "Wagon utilization is the percentage of a wagon's maximum weight capacity that's filled. A rake with 94% average utilization means wagons are nearly full, reducing empty space and transport cost per tonne.",
  },
  {
    question: "Can I use both rail and road transport?",
    answer: "Yes! The optimizer automatically splits orders between rail (cheaper, bulk) and road (flexible, urgent) based on platform availability, deadlines, and cost. View the 'Rail vs Road Split' tab to see the allocation and rationale.",
  },
  {
    question: "What if the optimization fails?",
    answer: "If optimization fails, check: (1) Are all required columns present? (2) Are numeric fields (quantity, distance) actual numbers, not text? (3) Do orders have valid destinations? The error message will guide you. You can also load our sample SAIL dataset to test.",
  },
  {
    question: "How are explanations generated?",
    answer: "For each order, the system generates a plain-English explanation: which rake it's assigned to, why (consolidation, priority, capacity), and the business benefit (cost savings, SLA protection). Find these in the 'Rake Plan & Dispatch' tab.",
  },
  {
    question: "Can I download the results?",
    answer: "Yes! Use the 'Export CSV' button on the Rake Plan page to download all allocations. Export options are also available on Reports page for performance analytics.",
  },
  {
    question: "What does 'SLA Compliance' mean?",
    answer: "Service Level Agreement compliance = percentage of orders delivered by their promised due date. The optimizer prioritizes high-penalty orders to avoid demurrage charges and maintain customer satisfaction.",
  },
  {
    question: "How do I contact support?",
    answer: "Use the AI Assistant (right sidebar) for quick answers, or email support@optirake.com for technical issues. The Assistant can explain any allocation decision or rake formation rationale.",
  },
];

export default function Help() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Help & Support</h1>
            <p className="text-lg text-muted-foreground">Get answers to common questions and learn how to use OptiRake DSS</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-glow p-6 space-y-3 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <p className="font-semibold text-foreground">Getting Started</p>
              <p className="text-xs text-muted-foreground">Learn the basics in 5 minutes</p>
            </div>

            <div className="card-glow p-6 space-y-3 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <p className="font-semibold text-foreground">Data Upload</p>
              <p className="text-xs text-muted-foreground">Format requirements & examples</p>
            </div>

            <div className="card-glow p-6 space-y-3 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <p className="font-semibold text-foreground">Optimization</p>
              <p className="text-xs text-muted-foreground">How the algorithm works</p>
            </div>

            <div className="card-glow p-6 space-y-3 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <p className="font-semibold text-foreground">Results</p>
              <p className="text-xs text-muted-foreground">Understanding your results</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>

            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="card-glow border border-border/50 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                  >
                    <span className="font-semibold text-foreground">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedIndex === idx && (
                    <div className="px-6 pb-4 pt-0 border-t border-border/50 bg-muted/10">
                      <p className="text-sm text-foreground/90 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="card-glow p-8 space-y-6 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground">Video Tutorials</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "5-Min Quick Start", duration: "5:12" },
                { title: "Uploading Your First Dataset", duration: "8:34" },
                { title: "Understanding Rake Formations", duration: "6:45" },
                { title: "Interpreting AI Explanations", duration: "4:20" },
              ].map((video, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-12 rounded bg-gradient-to-br from-primary/50 to-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">▶</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div className="card-glow p-8 space-y-6 border-secondary/20 bg-secondary/5">
            <h2 className="text-2xl font-bold text-foreground">Documentation & Resources</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">API Documentation</p>
                  <p className="text-xs text-muted-foreground">Integrate OptiRake with your systems</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Sample Datasets</p>
                  <p className="text-xs text-muted-foreground">Download templates and example data</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Glossary</p>
                  <p className="text-xs text-muted-foreground">Key terms and definitions</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Best Practices</p>
                  <p className="text-xs text-muted-foreground">Optimize your usage of OptiRake</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="card-glow p-8 space-y-6 border-accent/20 bg-accent/5">
            <h2 className="text-2xl font-bold text-foreground">Still Need Help?</h2>

            <p className="text-foreground/90">
              Can't find what you're looking for? Our support team is here to help. Use the AI Assistant on the right sidebar for quick answers, or reach out directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-gradient h-11 px-6">
                Contact Support
              </Button>
              <Button variant="outline" className="h-11 px-6 border-primary/30">
                Schedule a Demo
              </Button>
            </div>

            <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
              <p>📧 Email: support@optirake.com</p>
              <p>💬 Chat: Available Mon-Fri, 9 AM - 6 PM IST</p>
              <p>🎓 Training: Custom sessions available on request</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
