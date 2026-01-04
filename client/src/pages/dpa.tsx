import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Shield, Server, Users, Clock, AlertTriangle, Globe, Gavel, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const subProcessors = [
  { name: "Supabase Inc.", purpose: "Database hosting", location: "US" },
  { name: "Vercel Inc.", purpose: "Application hosting", location: "US" },
  { name: "NVIDIA Corporation", purpose: "GPU compute", location: "US" },
];

const securityMeasures = [
  { category: "Encryption", detail: "AES-256 at rest, TLS 1.3 in transit" },
  { category: "Access Controls", detail: "Role-based, MFA required for admin access" },
  { category: "Audit Logging", detail: "7-year retention for compliance" },
  { category: "Incident Response", detail: "24-hour breach notification to Controller" },
  { category: "Certifications", detail: "SOC 2 Type II, ISO 27001 (in progress)" },
];

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    icon: FileText,
    items: [
      { term: "Controller", def: "Customer organization using Sovereign QI" },
      { term: "Processor", def: "Vector for Good PBC" },
      { term: "Sub-processors", def: "Supabase, Vercel, NVIDIA (listed in Annex A)" },
      { term: "Personal Data", def: "Any data identifying individuals in policy simulations" },
      { term: "Processing", def: "Any operation on Personal Data (collection, storage, analysis)" },
    ],
  },
  {
    id: "scope",
    title: "2. Scope and Duration",
    icon: Clock,
    items: [
      "Applies to all Personal Data processed via Sovereign QI",
      "Duration: Length of subscription + 30-day wind-down period",
      "Subject matter: AI governance simulation and 8-agent deliberation",
      "Nature of processing: Automated analysis, storage, and reporting",
    ],
  },
  {
    id: "obligations",
    title: "3. Processor Obligations",
    icon: Shield,
    items: [
      "Process data only on documented Controller instructions",
      "Ensure personnel are bound by confidentiality",
      "Implement appropriate technical and organizational measures (TOMs)",
      "Assist Controller with GDPR compliance (DPIA, data subject requests)",
      "Delete or return data upon termination (per Controller choice)",
    ],
  },
  {
    id: "subprocessing",
    title: "5. Sub-processing",
    icon: Server,
    items: [
      "List of approved sub-processors (Annex A below)",
      "30-day notice for new sub-processors",
      "Controller may object to new sub-processors",
      "All sub-processors bound by equivalent DPA terms",
    ],
  },
  {
    id: "rights",
    title: "6. Data Subject Rights",
    icon: Users,
    items: [
      "Access requests (data portability)",
      "Rectification requests",
      "Erasure requests (right to be forgotten)",
      "Objection/restriction requests",
      "Response time: 5 business days (EU), 10 days (US)",
      "Self-service portal for common requests",
    ],
  },
  {
    id: "transfers",
    title: "7. Data Transfers (International)",
    icon: Globe,
    items: [
      "Primary processing: US (Vercel, Supabase)",
      "EU data residency: Available via Estonian subsidiary (2026)",
      "Transfer mechanisms: Standard Contractual Clauses (SCCs)",
      "UK: International Data Transfer Agreement (IDTA)",
    ],
  },
  {
    id: "audits",
    title: "8. Audits and Compliance",
    icon: FileText,
    items: [
      "Controller may audit Processor annually (with 30-day notice)",
      "Processor provides SOC 2 reports upon request",
      "Third-party audits: Coordinated through security team",
      "Cost: Borne by Controller (unless breach found)",
    ],
  },
  {
    id: "breach",
    title: "9. Data Breach Notification",
    icon: AlertTriangle,
    items: [
      "Processor notifies Controller within 24 hours of breach discovery",
      "Notification includes: Nature of breach, affected data, mitigation steps",
      "Processor cooperates with Controller's regulatory reporting",
    ],
  },
  {
    id: "liability",
    title: "10. Liability and Indemnification",
    icon: Gavel,
    items: [
      "Processor liable for GDPR violations caused by Processor actions",
      "Indemnification cap: Subscription fees paid in past 12 months",
      "Controller retains ultimate liability to data subjects",
    ],
  },
  {
    id: "termination",
    title: "11. Termination and Data Return",
    icon: Clock,
    items: [
      "Upon termination: Controller chooses data deletion or export",
      "Export format: JSON, CSV, or native format",
      "Deletion: Secure deletion within 30 days (certified upon request)",
      "Backup retention: 90 days for disaster recovery only",
    ],
  },
];

export default function DPA() {
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
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30 mb-4 font-mono text-sm">
              GDPR ARTICLE 28 COMPLIANT
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Data Processing Agreement (DPA)
            </h1>
            <p className="text-sm text-gray-400 mb-6">For Enterprise Customers</p>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-sm">
              This DPA is automatically incorporated into all Enterprise Subscription Agreements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-xl p-6 border border-white/10 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Preamble</h2>
            <p className="text-gray-300 leading-relaxed">
              This Data Processing Agreement ("DPA") is entered into between Vector for Good PBC 
              ("Processor") and Customer ("Controller") pursuant to Article 28 of the EU General 
              Data Protection Regulation (GDPR).
            </p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  className="glass-panel rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                      <Icon className="w-5 h-5 text-violet-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-violet-300">{section.title}</h2>
                  </div>

                  {section.items && Array.isArray(section.items) && typeof section.items[0] === "string" ? (
                    <ul className="space-y-2">
                      {(section.items as string[]).map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                          <div className="w-2 h-2 bg-violet-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : section.items ? (
                    <div className="space-y-2">
                      {(section.items as { term: string; def: string }[]).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-white font-medium min-w-[120px]">{item.term}:</span>
                          <span className="text-gray-400">{item.def}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-panel rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Shield className="w-5 h-5 text-green-300" />
                </div>
                <h2 className="text-xl font-semibold text-green-300">4. Security Measures (TOMs)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {securityMeasures.map((measure, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white font-medium text-sm">{measure.category}</p>
                    <p className="text-gray-400 text-xs mt-1">{measure.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-panel rounded-xl p-6 border border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5"
            >
              <h2 className="text-xl font-semibold text-secondary mb-4">Annex A: Sub-processors</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-gray-400 font-medium">Provider</th>
                      <th className="text-left py-2 text-gray-400 font-medium">Purpose</th>
                      <th className="text-left py-2 text-gray-400 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subProcessors.map((sp, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 text-white">{sp.name}</td>
                        <td className="py-2 text-gray-300">{sp.purpose}</td>
                        <td className="py-2 text-gray-400">{sp.location}</td>
                      </tr>
                    ))}
                    <tr className="text-gray-500 italic">
                      <td className="py-2" colSpan={3}>
                        [Future: Estonian hosting provider for EU data residency]
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-violet-300 mb-4">Annex B: Standard Contractual Clauses</h2>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-1.5 flex-shrink-0" />
                  EU Commission-approved SCCs (2021 version)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-1.5 flex-shrink-0" />
                  Module 2: Controller-to-Processor transfers
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass-panel rounded-xl p-8 border border-white/20 bg-white/5"
            >
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Signature Block</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm font-medium">PROCESSOR</p>
                  <p className="text-white font-semibold">Vector for Good PBC</p>
                  <div className="border-b border-dashed border-gray-600 h-8" />
                  <p className="text-gray-500 text-xs">Authorized Signature</p>
                  <div className="border-b border-dashed border-gray-600 h-8" />
                  <p className="text-gray-500 text-xs">Date</p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm font-medium">CONTROLLER</p>
                  <p className="text-white font-semibold">[Customer Name]</p>
                  <div className="border-b border-dashed border-gray-600 h-8" />
                  <p className="text-gray-500 text-xs">Authorized Signature</p>
                  <div className="border-b border-dashed border-gray-600 h-8" />
                  <p className="text-gray-500 text-xs">Date</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="glass-panel rounded-xl p-6 border border-white/10 text-center"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Download & Contact</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button className="bg-violet-600 hover:bg-violet-700 gap-2" data-testid="button-download-dpa">
                  <Download className="w-4 h-4" /> Download DPA (PDF)
                </Button>
                <Button variant="outline" className="gap-2" data-testid="button-request-signed">
                  <ExternalLink className="w-4 h-4" /> Request Signed Copy
                </Button>
                <Button variant="ghost" className="text-gray-400" data-testid="button-view-soc2">
                  View SOC 2 Report (NDA Required)
                </Button>
              </div>
              <div className="space-y-1 text-gray-400 text-sm">
                <p>
                  <a href="mailto:legal@vectorforgood.com" className="text-violet-300 hover:underline">
                    legal@vectorforgood.com
                  </a>
                  {" | "}
                  <a href="mailto:dpa@vectorforgood.com" className="text-violet-300 hover:underline">
                    dpa@vectorforgood.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-gray-500 text-xs mt-8"
          >
            This DPA is a living document. Material changes require mutual written consent. 
            Minor updates (e.g., sub-processor additions) communicated via 30-day notice.
          </motion.p>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-4 mb-4">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
        <p>© 2026 Vector for Good PBC</p>
      </footer>
    </div>
  );
}
