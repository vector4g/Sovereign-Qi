import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, Phone, Shield, Eye, Users, Scale, Cpu, Mic, Search, Lightbulb,
  CheckCircle, FileText, AlertTriangle, Lock, Clock, Building, Briefcase, TrendingUp,
  FileCheck, BookOpen, Database, Award, ExternalLink, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import alanTuringImg from "@assets/alan_turing.jpg";
import lynnConwayImg from "@assets/lynn_conway_wiki.jpg";
import bayardRustinImg from "@assets/bayard_rustin.jpg";
import sylviaRiveraImg from "@assets/sylvia_rivera_wiki.jpg";
import elizebethFriedmanImg from "@assets/elizebeth_friedman_wiki.jpg";
import claudetteColvinImg from "@assets/claudette_colvin_wiki.jpg";
import audreLordeImg from "@assets/audre_lorde_large.jpg";
import templeGrandinImg from "@assets/temple_grandin.jpg";
import esgEcosystemDiagram from "@assets/Gemini_Generated_Image_s188eos188eos188_1767531304724.png";

const councilAgents = [
  {
    id: "alan",
    name: "ALAN",
    namesake: "Turing",
    role: "Compliance Officer",
    badge: "VETO Power - Ultimate Compliance Check",
    color: "border-purple-500",
    ringColor: "ring-purple-500",
    image: alanTuringImg,
    contributions: [
      "Flags policies that fail vulnerable community protection test",
      "Documents why majority logic isn't enough for duty of care",
      "Creates legal defensibility: 'We tested this on our strictest reviewer'",
    ],
    outputs: [
      "VETO documentation (timestamped, signed, audit-ready)",
      "Risk assessment memos (legal language for GCs)",
      "Board presentation slides (Alan's objections = proof of diligence)",
    ],
  },
  {
    id: "elizebeth",
    name: "ELIZEBETH",
    namesake: "Friedman",
    role: "Pattern Recognition & Documentation",
    badge: "Signal Intelligence - Compliance Patterns",
    color: "border-green-500",
    ringColor: "ring-green-500",
    image: elizebethFriedmanImg,
    contributions: [
      "Detects compliance gaps by analyzing policy language patterns",
      "Cross-references policies against EU AI Act requirements",
      "Generates data-driven compliance scorecards",
    ],
    outputs: [
      "Pattern analysis reports (shows recurring blind spots)",
      "EU AI Act mapping (which articles your policy addresses)",
      "Compliance trend tracking (improving/declining scores)",
    ],
  },
  {
    id: "claudette",
    name: "CLAUDETTE",
    namesake: "Colvin",
    role: "Erasure Detection & Documentation",
    badge: "Visibility Verification",
    color: "border-yellow-500",
    ringColor: "ring-yellow-500",
    image: claudetteColvinImg,
    contributions: [
      "Documents which voices were considered in decision-making",
      "Proves stakeholder consultation (EU AI Act Article 9 requirement)",
      "Creates evidence trail of inclusive governance",
    ],
    outputs: [
      "Stakeholder consultation logs (who was included, when, what)",
      "Marginalized voice impact assessments",
      "Before/after policy comparisons (iteration based on feedback)",
    ],
  },
  {
    id: "audre",
    name: "AUDRE",
    namesake: "Lorde",
    role: "Intersectional Analysis Documentation",
    badge: "Compound Harm Detection",
    color: "border-pink-500",
    ringColor: "ring-pink-500",
    image: audreLordeImg,
    contributions: [
      "Documents intersectional impact assessments",
      "Proves compliance with GDPR Article 22 (automated decision protections)",
      "Creates legally defensible evidence of non-discrimination testing",
    ],
    outputs: [
      "Intersectionality matrices (compounding harms analysis)",
      "DPIA documentation (Data Protection Impact Assessments)",
      "Anti-discrimination test results",
    ],
  },
  {
    id: "lynn",
    name: "LYNN",
    namesake: "Conway",
    role: "Technical Architecture Documentation",
    badge: "System Design Verification",
    color: "border-blue-500",
    ringColor: "ring-blue-500",
    image: lynnConwayImg,
    contributions: [
      "Documents technical governance architecture",
      "Proves transparency (EU AI Act Article 13)",
      "Creates technical specifications for auditors",
    ],
    outputs: [
      "System architecture diagrams (how decisions are made)",
      "Algorithm transparency reports",
      "Technical debt documentation (known limitations disclosed)",
    ],
  },
  {
    id: "bayard",
    name: "BAYARD",
    namesake: "Rustin",
    role: "Strategic Coordination Evidence",
    badge: "Coalition Building Records",
    color: "border-orange-500",
    ringColor: "ring-orange-500",
    image: bayardRustinImg,
    contributions: [
      "Documents cross-functional stakeholder engagement",
      "Proves multi-department consultation (legal + HR + ops)",
      "Creates evidence of strategic governance planning",
    ],
    outputs: [
      "Multi-stakeholder meeting minutes (who participated)",
      "Coalition-building documentation (HR, Legal, DEI alignment)",
      "Strategic roadmap with compliance milestones",
    ],
  },
  {
    id: "sylvia",
    name: "SYLVIA",
    namesake: "Rivera",
    role: "Street-Level Impact Documentation",
    badge: "Ground Truth Verification",
    color: "border-red-500",
    ringColor: "ring-red-500",
    image: sylviaRiveraImg,
    contributions: [
      "Documents real-world harm assessments",
      "Proves duty of care testing (legal requirement)",
      "Creates evidence that policies were stress-tested on vulnerable populations",
    ],
    outputs: [
      "Ground-level impact scenarios (what happens to most vulnerable?)",
      "Duty of care test results (did policy protect employees?)",
      "Crisis response documentation",
    ],
  },
  {
    id: "temple",
    name: "TEMPLE",
    namesake: "Grandin",
    role: "Edge Case Documentation",
    badge: "What-If Analysis Records",
    color: "border-cyan-500",
    ringColor: "ring-cyan-500",
    image: templeGrandinImg,
    contributions: [
      "Documents edge case testing (EU AI Act requires risk assessment)",
      "Proves scenario planning beyond typical cases",
      "Creates evidence of comprehensive safety testing",
    ],
    outputs: [
      "Edge case scenario library (documented what-ifs)",
      "Safety testing matrices (extensive scenario coverage)",
      "Risk mitigation documentation",
    ],
  },
];

const complianceOutputs = [
  {
    title: "Data Protection Impact Assessments (DPIAs)",
    icon: FileCheck,
    color: "green",
    items: [
      "Auto-generated from Sovereign QI simulations",
      "GDPR Article 35 compliant",
      "Includes: Risk assessment, mitigation measures, stakeholder consultation",
      "Council agent contributions visible in DPIA sections",
      "Exportable as PDF with digital signatures",
    ],
  },
  {
    title: "EU AI Act Documentation Package",
    icon: BookOpen,
    color: "blue",
    items: [
      "Article-by-article compliance mapping",
      "High-risk AI system classification documentation",
      "Human oversight protocols (users retain final decision)",
      "Transparency requirements (model cards, explanations)",
      "7-year audit trail retention",
    ],
  },
  {
    title: "Governance Decision Audit Logs",
    icon: Database,
    color: "purple",
    items: [
      "Every simulation timestamped and signed",
      "Complete transcript of 8-agent deliberation",
      "Version control (shows policy iterations)",
      "Exportable for legal discovery or regulatory audits",
      "Tamper-proof blockchain anchoring (optional)",
    ],
  },
  {
    title: "Exportable Compliance Reports",
    icon: FileText,
    color: "cyan",
    items: [
      "Executive summary (1-page for board)",
      "Technical appendix (for auditors)",
      "Legal memo format (for General Counsel)",
      "Investor-ready ESG metrics (for fundraising/reporting)",
      "Custom templates per jurisdiction (EU, UK, US, CA)",
    ],
  },
  {
    title: "Investor-Ready ESG Metrics",
    icon: TrendingUp,
    color: "amber",
    items: [
      "S (Social): DEI policy effectiveness, stakeholder engagement",
      "G (Governance): AI ethics, transparency, accountability",
      "Benchmarking against industry standards",
      "Quarterly trend reports",
      "Integration with ESG platforms (Bloomberg, S&P)",
    ],
  },
];

const regulatoryTabs = [
  {
    id: "eu-ai-act",
    title: "EU AI Act",
    requirements: [
      "High-risk AI classification",
      "Human oversight mechanisms",
      "Transparency requirements",
      "7-year audit trail retention",
    ],
    howCouncilHelps: [
      "Alan's VETO = documented human override mechanism",
      "8 perspectives = proof of comprehensive risk assessment",
      "Complete audit logs = 7-year retention requirement met",
    ],
    deliverables: ["EU AI Act compliance certificate", "Article 13 transparency report"],
  },
  {
    id: "gdpr",
    title: "GDPR",
    requirements: [
      "DPIAs for automated decisions",
      "Data subject rights documentation",
      "Lawful basis for processing",
    ],
    howCouncilHelps: [
      "Audre's intersectional analysis = GDPR Article 22 protection",
      "Elizebeth's pattern detection = data minimization verification",
      "Claudette's stakeholder logs = consultation evidence",
    ],
    deliverables: ["GDPR-compliant DPIA", "Data subject impact assessment"],
  },
  {
    id: "duty-of-care",
    title: "Duty of Care",
    requirements: [
      "Employer must take reasonable steps",
      "Document protection measures",
      "Evidence of risk assessment",
    ],
    howCouncilHelps: [
      "Sylvia's ground-level analysis = proves testing on vulnerable employees",
      "Temple's edge cases = shows comprehensive scenario planning",
      "Alan's VETO = demonstrates commitment to protection over efficiency",
    ],
    deliverables: ["Duty of care compliance memo", "Risk mitigation documentation"],
  },
  {
    id: "soc2-iso",
    title: "SOC 2 / ISO 27001",
    requirements: [
      "Information security controls",
      "Access control documentation",
      "Audit trail requirements",
    ],
    howCouncilHelps: [
      "Lynn's technical architecture = system documentation",
      "Bayard's strategic coordination = control environment evidence",
      "Complete audit logs = security monitoring proof",
    ],
    deliverables: ["SOC 2-ready control documentation", "ISO 27001 evidence package"],
  },
];

const useCases = [
  {
    id: "litigation",
    title: "Pre-Litigation Defense",
    client: "Fortune 500 Financial Services",
    scenario: "Employee sues for discrimination after AI hiring tool rejection",
    traditional: "Scramble to find documentation, lose lawsuit",
    withEsg: [
      "Pull complete audit log of policy testing (including Alan's VETO analysis)",
      "Show 8-agent deliberation transcript proving policy was tested on edge cases",
      "Demonstrate duty of care: Company ran 50+ scenarios before deploying",
    ],
    outcome: "Case dismissed in summary judgment - 'Plaintiff cannot show lack of diligence'",
    icon: Scale,
    color: "red",
  },
  {
    id: "audit",
    title: "EU AI Act Audit",
    client: "Tech Unicorn Expanding to Europe",
    scenario: "EU regulator demands AI Act compliance documentation",
    traditional: "Hire consultants, spend 6 months retroactively creating docs",
    withEsg: [
      "Export pre-built EU AI Act compliance package",
      "Provide 2 years of historical simulation audit logs",
      "Demonstrate continuous governance improvement (quarterly Council reviews)",
    ],
    outcome: "Pass audit in 30 days, granted EU market access",
    icon: FileCheck,
    color: "blue",
  },
  {
    id: "investor",
    title: "Investor Due Diligence",
    client: "Series B SaaS Startup",
    scenario: "VC demands ESG documentation before investment",
    traditional: "'We care about diversity' slide deck with no data",
    withEsg: [
      "Share investor-ready ESG metrics dashboard",
      "Provide evidence of AI governance (Council deliberation transcripts)",
      "Demonstrate social impact commitment (Alan's VETO protecting vulnerable users)",
    ],
    outcome: "$50M Series B at higher valuation due to governance credibility",
    icon: TrendingUp,
    color: "green",
  },
];

const pricingTiers = [
  {
    name: "Enterprise Compliance Suite",
    price: "$75K",
    period: "/year",
    description: "Full compliance automation for large organizations",
    features: [
      "Unlimited Sovereign QI simulations",
      "Automatic compliance report generation",
      "Dedicated compliance advisor",
      "Custom jurisdiction templates",
      "Priority legal support",
    ],
    includes: "DPIAs, EU AI Act docs, audit logs, ESG metrics",
    cta: "Contact Sales",
    highlighted: true,
  },
  {
    name: "Mid-Market Package",
    price: "$25K",
    period: "/year",
    description: "Essential compliance for growing companies",
    features: [
      "50 simulations/year",
      "Standard compliance templates",
      "Self-service report generation",
      "Email support",
    ],
    includes: "Core compliance documentation",
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Audit Response Package",
    price: "$15K",
    period: "one-time",
    description: "Emergency compliance documentation",
    features: [
      "72-hour turnaround",
      "Historical simulation mining",
      "Expert witness support (if needed)",
      "Complete documentation package",
    ],
    includes: "Rapid audit preparation",
    cta: "Request Now",
    highlighted: false,
  },
];

export default function ESGCompliancePage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", role: "" });

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tighter" data-testid="link-home">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-teal-950/30 to-background" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <p className="text-sm uppercase tracking-wider text-green-400 font-mono mb-4">COMPLIANCE & GOVERNANCE</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              ESG Compliance
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Prove you did diligence. Documentation, audit trails, and compliance reporting for EU AI Act, GDPR, and duty of care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg" data-testid="button-download-report">
                <Download className="w-5 h-5 mr-2" /> Download Sample Report
              </Button>
              <Button variant="outline" className="border-green-500/50 text-green-300 hover:bg-green-500/10 px-8 py-3 text-lg" data-testid="button-talk-compliance">
                <Phone className="w-5 h-5 mr-2" /> Talk to Compliance Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-12"
          >
            Your Board Is Asking: "Can You Prove We Did Our Homework?"
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: "€35M or 7%", desc: "Maximum EU AI Act fine", sub: "for non-compliance", color: "red" },
              { stat: "$2.4M avg", desc: "Duty of care settlement", sub: "could have prevented with simulation", color: "orange" },
              { stat: "7 years", desc: "Required audit trail", sub: "retention for EU AI Act", color: "yellow" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border border-${item.color}-500/30 text-center`}
              >
                <p className={`text-3xl font-bold text-${item.color}-400 mb-2`}>{item.stat}</p>
                <p className="text-white font-medium">{item.desc}</p>
                <p className="text-gray-500 text-sm">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-6 md:p-8 border border-red-500/20 text-center"
          >
            <p className="text-lg md:text-xl text-gray-200 italic mb-3">
              "After the lawsuit, the court asked for our governance documentation. We had meeting notes. They had simulation audit logs. We lost."
            </p>
            <cite className="text-red-400 text-sm font-medium">— Fortune 500 General Counsel, 2025</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Liberation Pioneer Council as Compliance Engine */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Meet Your AI-Powered Compliance Documentation Team
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Every Sovereign QI simulation creates audit-ready evidence that your policies were tested from 8 perspectives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {councilAgents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass-panel rounded-xl p-5 border ${agent.color} hover:bg-white/5 transition-all`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={agent.image} 
                    alt={`${agent.name} (${agent.namesake})`}
                    className={`w-14 h-14 rounded-full object-cover ring-2 ${agent.ringColor}`}
                  />
                  <div>
                    <h3 className="text-white font-bold">{agent.name}</h3>
                    <p className="text-gray-400 text-xs">({agent.namesake})</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-300 mb-2">{agent.role}</p>
                <div className="inline-block px-2 py-1 bg-white/5 rounded text-xs text-green-400 mb-3">
                  {agent.badge}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Compliance Contribution</p>
                    <ul className="space-y-1">
                      {agent.contributions.map((c, j) => (
                        <li key={j} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Output Examples</p>
                    <ul className="space-y-1">
                      {agent.outputs.map((o, j) => (
                        <li key={j} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <FileText className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Output Types */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Compliance Documentation Types
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceOutputs.map((output, i) => {
              const Icon = output.icon;
              const colorMap: Record<string, string> = {
                green: "bg-green-500/20 text-green-300 border-green-500/30",
                blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-panel rounded-xl p-6 border ${colorMap[output.color]}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${colorMap[output.color]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{output.title}</h3>
                  <ul className="space-y-2">
                    {output.items.map((item, j) => (
                      <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regulatory Compliance Tabs */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Regulatory Compliance Coverage
          </motion.h2>

          <Tabs defaultValue="eu-ai-act" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto mb-8">
              {regulatoryTabs.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-3 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 rounded-lg border border-white/10 data-[state=active]:border-green-500/30 text-sm"
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {regulatoryTabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-xl p-6 border border-green-500/20"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm uppercase text-gray-500 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {tab.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase text-gray-500 mb-3">How Council Helps</h4>
                      <ul className="space-y-2">
                        {tab.howCouncilHelps.map((help, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {help}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase text-gray-500 mb-3">Deliverables</h4>
                      <ul className="space-y-2">
                        {tab.deliverables.map((del, i) => (
                          <li key={i} className="text-sm text-green-300 flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {del}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* The Complete ESG Ecosystem */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              The Complete ESG Ecosystem
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three integrated products working together for complete governance intelligence
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <img 
              src={esgEcosystemDiagram} 
              alt="ESG Compliance Ecosystem - Brain (Governance Simulation), Voice (Employee Reporting), Eyes (Executive Dashboard)" 
              className="w-full max-w-4xl mx-auto rounded-xl shadow-2xl shadow-green-500/10"
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Sovereign QI - The Brain */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass-panel rounded-xl p-6 border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-transparent"
            >
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Cpu className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-xs font-mono text-purple-400 mb-2">THE BRAIN</div>
              <h3 className="text-xl font-bold text-white mb-3">Sovereign QI</h3>
              <ul className="space-y-2 mb-4">
                {[
                  "Test policies before deployment",
                  "8-agent Liberation Pioneer Council",
                  "Generates audit-ready compliance docs",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20 mb-4">
                <p className="text-xs text-gray-500 mb-1">Use Case</p>
                <p className="text-purple-300 text-sm">Pre-litigation defense</p>
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-purple-400">Integration:</span> Feeds insights to Mirror
              </div>
            </motion.div>

            {/* Vector Shield - The Voice */}
            <Link href="/products/esg-compliance/vector-shield">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-xs font-mono text-amber-400 mb-2">THE VOICE</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">Vector Shield</h3>
                <ul className="space-y-2 mb-4">
                  {[
                    "Anonymous employee/vendor reporting",
                    "End-to-end encrypted submissions",
                    "Pattern detection across departments",
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-amber-500/10 rounded border border-amber-500/20 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Use Case</p>
                  <p className="text-amber-300 text-sm">Whistleblower protection + ground truth</p>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-amber-400">Integration:</span> Reality-checks QI simulations
                </div>
                <div className="mt-3 text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            </Link>

            {/* Vector Mirror - The Eyes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-xl p-6 border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent"
            >
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-xs font-mono text-cyan-400 mb-2">THE EYES</div>
              <h3 className="text-xl font-bold text-white mb-3">Vector Mirror</h3>
              <ul className="space-y-2 mb-4">
                {[
                  "Executive ESG performance dashboard",
                  "Real-time metrics from QI + Shield",
                  "Board-ready reporting",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/20 mb-4">
                <p className="text-xs text-gray-500 mb-1">Use Case</p>
                <p className="text-cyan-300 text-sm">Investor due diligence</p>
              </div>
              <div className="text-xs text-gray-500">
                <span className="text-cyan-400">Integration:</span> Shows policy-vs-reality gaps
              </div>
            </motion.div>
          </div>

          {/* Ecosystem Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-8 border border-green-500/30 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Suite Bundle</h3>
              <p className="text-gray-400">All three products, fully integrated</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-2 mb-4">
                  <span className="text-5xl font-bold text-green-400">$150K</span>
                  <span className="text-gray-500">/year</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="line-through text-gray-600">À la carte: $165K</span>
                    <span className="text-green-400 font-medium">(Save $15K)</span>
                  </p>
                  <p className="text-xs">QI ($75K) + Shield ($50K) + Mirror ($40K)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300">Sovereign QI</span>
                  <span className="text-gray-600 ml-auto">$75K/yr</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-gray-300">Vector Shield</span>
                  <span className="text-gray-600 ml-auto">$50K/yr</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">Vector Mirror</span>
                  <span className="text-gray-600 ml-auto">$40K/yr</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8" data-testid="button-get-ecosystem">
                Get Full Ecosystem Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Real-World Use Cases
          </motion.h2>

          <div className="space-y-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              const colorMap: Record<string, string> = {
                red: "border-red-500/30 bg-red-500/5",
                blue: "border-blue-500/30 bg-blue-500/5",
                green: "border-green-500/30 bg-green-500/5",
              };
              return (
                <motion.div
                  key={uc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-panel rounded-xl p-6 border ${colorMap[uc.color]}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${uc.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${uc.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{uc.title}</h3>
                      <p className="text-gray-400 text-sm">{uc.client}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Scenario</p>
                      <p className="text-gray-300 text-sm mb-4">{uc.scenario}</p>
                      <div className="p-3 bg-red-500/10 rounded border border-red-500/20 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Traditional Approach</p>
                        <p className="text-red-300 text-sm">{uc.traditional}</p>
                      </div>
                    </div>
                    <div>
                      <div className="p-3 bg-green-500/10 rounded border border-green-500/20 mb-4">
                        <p className="text-xs text-gray-500 mb-2">With ESG Compliance + Council</p>
                        <ul className="space-y-1">
                          {uc.withEsg.map((step, j) => (
                            <li key={j} className="text-green-300 text-sm flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded">
                        <p className="text-xs text-gray-500 mb-1">Outcome</p>
                        <p className="text-green-400 font-medium text-sm">{uc.outcome}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Compliance Packages
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border ${tier.highlighted ? 'border-green-500/50 ring-2 ring-green-500/20' : 'border-white/10'}`}
              >
                {tier.highlighted && (
                  <div className="text-xs text-green-400 font-medium uppercase mb-2">Most Popular</div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-green-400">{tier.price}</span>
                  <span className="text-gray-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mb-4">Includes: {tier.includes}</p>
                <Button 
                  className={tier.highlighted ? "w-full bg-green-600 hover:bg-green-700" : "w-full"} 
                  variant={tier.highlighted ? "default" : "outline"}
                  data-testid={`button-pricing-${i}`}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              { icon: Award, label: "EU AI Act Compliant" },
              { icon: Lock, label: "GDPR Ready" },
              { icon: Shield, label: "SOC 2 Type II" },
            ].map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{badge.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Used by 15+ Fortune 500 companies • Integration partners: Bloomberg ESG, S&P Global, MSCI
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-green-950/20 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Turn AI Governance Into Legal Defense
            </h2>
            <p className="text-gray-400 mb-8">
              Download a sample compliance package generated by the Liberation Pioneer Council
            </p>

            <div className="glass-panel rounded-xl p-6 border border-green-500/20">
              <p className="text-green-400 text-sm font-medium mb-4">
                Free DPIA template + EU AI Act checklist
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border-white/10"
                  data-testid="input-name"
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border-white/10"
                  data-testid="input-email"
                />
                <Input 
                  placeholder="Company" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="bg-white/5 border-white/10"
                  data-testid="input-company"
                />
                <Input 
                  placeholder="Role" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="bg-white/5 border-white/10"
                  data-testid="input-role"
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" data-testid="button-get-templates">
                Get Compliance Templates
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-4">
            <a href="#" className="hover:text-green-400 transition-colors">Data Processing Agreement</a>
            <a href="#" className="hover:text-green-400 transition-colors">Sample Audit Log</a>
          </div>
          <div className="text-sm text-gray-600">
            <p>compliance@vectorforgood.com • legal@vectorforgood.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
