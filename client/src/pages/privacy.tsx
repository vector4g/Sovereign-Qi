import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Globe, Users, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    id: "collect",
    title: "Information We Collect",
    icon: Eye,
    content: [
      { label: "Account Information", desc: "Name, email, company, and role" },
      { label: "Usage Data", desc: "Simulation runs, policy tests, council deliberations" },
      { label: "Technical Data", desc: "Browser type, IP address, device info" },
    ],
    note: "We never sell your data. Period.",
  },
  {
    id: "use",
    title: "How We Use Your Information",
    icon: FileText,
    items: [
      "Provide Sovereign QI simulation and 8-agent deliberation",
      "Improve AI governance accuracy",
      "Send product updates and security notifications",
      "Comply with legal obligations (EU AI Act, GDPR)",
    ],
  },
  {
    id: "sharing",
    title: "Data Sharing & Third Parties",
    icon: Users,
    items: [
      "We do NOT sell or rent your data",
      "Third-party services: Supabase (database), Vercel (hosting), NVIDIA (compute)",
      "All vendors signed DPAs (Data Processing Agreements)",
      "Government requests: Transparent and minimal (see warrant canary)",
    ],
  },
  {
    id: "rights",
    title: "Your Rights (GDPR & CCPA Compliant)",
    icon: Shield,
    items: [
      "Right to access your data",
      "Right to deletion (erasure)",
      "Right to portability (download your data)",
      "Right to opt-out of marketing",
    ],
    note: "Contact: privacy@vectorforgood.com",
  },
  {
    id: "security",
    title: "Security Measures",
    icon: Lock,
    items: [
      "End-to-end encryption for policy simulations",
      "SOC 2 Type II certified infrastructure",
      "Regular security audits",
      "Incident response plan (24-hour notification)",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: FileText,
    items: [
      "Active accounts: Data retained while account is active",
      "Deleted accounts: 30-day grace period, then permanent deletion",
      "Legal holds: Retained only as required by law",
    ],
  },
  {
    id: "international",
    title: "International Data Transfers",
    icon: Globe,
    items: [
      "Primary servers: US (Vercel/Supabase)",
      "EU expansion: Estonian subsidiary (2026) with local data residency",
      "Standard Contractual Clauses (SCCs) for EU transfers",
    ],
  },
];

export default function Privacy() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-400 mb-6">Last Updated: January 3, 2026</p>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              At Vector for Good PBC, protecting your privacy isn't just policy—it's our mission. 
              As a Public Benefit Corporation building Liberation-Grade AI, we hold ourselves to 
              the highest standards of data protection and transparency.
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-panel rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                      <Icon className="w-5 h-5 text-violet-300" />
                    </div>
                    <h2 className="text-2xl font-semibold text-violet-300">{section.title}</h2>
                  </div>
                  
                  {section.content && (
                    <div className="space-y-3 mb-4">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <span className="text-white font-medium">{item.label}:</span>{" "}
                            <span className="text-gray-400">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
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
                  
                  {section.note && (
                    <div className="mt-4 p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                      <p className="text-violet-200 text-sm font-medium">{section.note}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-violet-300 mb-4">Children's Privacy</h2>
              <p className="text-gray-300">
                Sovereign QI is not intended for users under 16. We do not knowingly collect 
                data from children.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-violet-300 mb-4">Changes to This Policy</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  30-day advance notice for material changes
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Email notifications to all users
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Continued use constitutes acceptance
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="glass-panel rounded-xl p-6 border border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5"
            >
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Public Benefit Corporation Commitment
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  As a PBC, we balance profit with purpose
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  We prioritize user privacy over monetization
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Annual transparency reports published at vectorforgood.com/transparency
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="glass-panel rounded-xl p-6 border border-white/10 text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="space-y-2 text-gray-300 mb-6">
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  <a href="mailto:privacy@vectorforgood.com" className="text-violet-300 hover:underline">
                    privacy@vectorforgood.com
                  </a>
                </p>
                <p>
                  <span className="text-gray-500">Mail:</span> Vector for Good PBC, Salem, NH
                </p>
                <p className="text-sm text-gray-500">
                  EU Representative: To be appointed when Estonian subsidiary launches
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="gap-2" data-testid="button-download-privacy">
                  <Download className="w-4 h-4" /> Download Privacy Policy (PDF)
                </Button>
                <Link href="/terms">
                  <Button variant="ghost" className="text-gray-400 hover:text-white" data-testid="link-terms">
                    View Terms of Service
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 Vector for Good PBC. Simulation Before Legislation.</p>
      </footer>
    </div>
  );
}
