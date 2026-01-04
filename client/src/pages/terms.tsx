import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Shield, Scale, CreditCard, Clock, AlertTriangle, Globe, Gavel, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    items: [
      "By using Sovereign QI, you agree to these terms",
      "Definitions: 'Service' = Sovereign QI platform, 'Council' = 8-agent AI system",
      "Users must be 18+ and authorized to represent their organization",
    ],
  },
  {
    id: "service",
    title: "Service Description",
    icon: Shield,
    items: [
      "Sovereign QI provides AI governance simulation via 8-agent Liberation Pioneer Council",
      "Outputs are advisory, not legal advice",
      "Users retain responsibility for final governance decisions",
    ],
  },
  {
    id: "accounts",
    title: "User Accounts & Access",
    icon: Shield,
    items: [
      "Enterprise licenses (custom pricing)",
      "Academic/Nonprofit discounts available",
      "Account security: Users responsible for credential protection",
      "Prohibition: Sharing accounts, reverse engineering, unauthorized access",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    icon: AlertTriangle,
    permitted: [
      "Policy testing and governance simulation",
      "DEI compliance analysis",
      "Risk assessment and scenario planning",
    ],
    prohibited: [
      "Surveillance applications",
      "Discriminatory applications",
      "Harm to vulnerable groups",
    ],
    note: "VETO power: Alan agent may refuse simulations that risk marginalized communities. Violation consequences: Warning → Suspension → Termination",
  },
  {
    id: "ip",
    title: "Intellectual Property",
    icon: FileText,
    items: [
      "Vector for Good PBC owns Sovereign QI platform, code, AI models",
      "Users retain ownership of their input data (policies, scenarios)",
      "Council outputs: Joint ownership (Vector + User) for derivative works",
      "Attribution required if publishing case studies using Sovereign QI",
    ],
  },
  {
    id: "data-rights",
    title: "Data Rights & Simulation Outputs",
    icon: Shield,
    items: [
      "Users own their policy documents and simulation inputs",
      "Sovereign QI retains anonymized aggregate data for AI training",
      "Opt-out available for training data inclusion",
      "Audit logs: 7-year retention for compliance",
    ],
  },
  {
    id: "payment",
    title: "Payment Terms (Enterprise)",
    icon: CreditCard,
    items: [
      "Annual subscription model",
      "Custom pilot pricing",
      "30-day payment terms (Net 30)",
      "Refunds: Pro-rated for service outages exceeding SLA",
    ],
  },
  {
    id: "sla",
    title: "Service Level Agreement (SLA)",
    icon: Clock,
    items: [
      "99.5% uptime guarantee (excluding scheduled maintenance)",
      "Support response times: Critical (1 hour), High (4 hours), Normal (24 hours)",
      "Downtime credits: 5% per hour of outage",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: Scale,
    items: [
      "Sovereign QI provides simulations, not legal advice",
      "Users bear ultimate responsibility for policy decisions",
      "No liability for third-party reliance on Council recommendations",
      "Indemnification: Users indemnify Vector for misuse",
    ],
  },
  {
    id: "warranty",
    title: "Warranty Disclaimer",
    icon: AlertTriangle,
    items: [
      "Service provided 'AS IS'",
      "No guarantee of specific outcomes (but we stand by our methodology)",
      "AI models continuously improve based on real-world feedback",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    icon: FileText,
    items: [
      "Either party may terminate with 30-day notice",
      "Immediate termination for: Payment default, TOS violation, illegal use",
      "Post-termination: 30-day data export window",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Dispute Resolution",
    icon: Gavel,
    items: [
      "Delaware law (Vector for Good PBC incorporated in DE)",
      "Arbitration required (JAMS rules)",
      "Class action waiver",
      "EU users: Estonian law applies after 2026 subsidiary launch",
    ],
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act Compliance",
    icon: Globe,
    items: [
      "Sovereign QI classified as 'High-Risk AI System' (governance applications)",
      "Mandatory human oversight (users retain final decision authority)",
      "Audit trail documentation (7 years)",
      "Transparency: Model cards available upon request",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-slate-900/50 text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-display font-bold text-white tracking-tighter"
            data-testid="link-home"
          >
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            data-testid="link-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-400 mb-6">Last Updated: January 3, 2026</p>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              These Terms of Service govern your use of the Sovereign QI platform operated by 
              Vector for Good PBC, a Delaware Public Benefit Corporation.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass-panel rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                      <Icon className="w-5 h-5 text-violet-300" />
                    </div>
                    <h2 className="text-2xl font-semibold text-violet-300">{section.title}</h2>
                  </div>
                  
                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.permitted && (
                    <div className="mb-4">
                      <h3 className="text-sm font-mono text-green-400 mb-2">PERMITTED:</h3>
                      <ul className="space-y-1">
                        {section.permitted.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.prohibited && (
                    <div className="mb-4">
                      <h3 className="text-sm font-mono text-red-400 mb-2">PROHIBITED:</h3>
                      <ul className="space-y-1">
                        {section.prohibited.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {section.note && (
                    <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-red-200 text-sm">{section.note}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-panel rounded-xl p-6 border border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Heart className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-secondary">
                  Public Benefit Corporation Mission
                </h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Vector for Good PBC prioritizes social good over maximum profit
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Liberation-Grade AI commitment: Centering marginalized voices
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Annual benefit reports published
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-violet-300 mb-4">Changes to Terms</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  30-day notice for material changes
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Continued use = acceptance
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Enterprise customers: Renegotiation option for substantial changes
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass-panel rounded-xl p-6 border border-white/10 text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="space-y-2 text-gray-300 mb-6">
                <p>
                  <span className="text-gray-500">Legal inquiries:</span>{" "}
                  <a href="mailto:legal@vectorforgood.com" className="text-violet-300 hover:underline">
                    legal@vectorforgood.com
                  </a>
                </p>
                <p>
                  <span className="text-gray-500">General support:</span>{" "}
                  <a href="mailto:hello@vectorforgood.com" className="text-violet-300 hover:underline">
                    hello@vectorforgood.com
                  </a>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="gap-2" data-testid="button-download-terms">
                  <Download className="w-4 h-4" /> Download Terms of Service (PDF)
                </Button>
                <Link href="/privacy">
                  <Button variant="ghost" className="text-gray-400 hover:text-white" data-testid="link-privacy">
                    View Privacy Policy
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black text-center">
        <p className="text-violet-300 font-medium mb-2">Simulation Before Legislation™</p>
        <p className="text-gray-500 text-sm">© 2026 Vector for Good PBC</p>
      </footer>
    </div>
  );
}
