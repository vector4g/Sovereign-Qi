import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, Phone, Shield, Eye, Users, Scale, Cpu, Mic, Search, Lightbulb,
  CheckCircle, FileText, AlertTriangle, Lock, Clock, Building, Briefcase, TrendingUp,
  MessageSquare, Bell, UserX, FileCheck, Upload, Globe, Languages, MapPin, Calendar,
  AlertCircle, ChevronRight, Smartphone, ShieldCheck, Key, Database, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import shieldAppMockup from "@assets/Gemini_Generated_Image_z7lwq4z7lwq4z7lw_1767531731156.png";
import alanTuringImg from "@assets/alan_turing.jpg";
import lynnConwayImg from "@assets/lynn_conway_wiki.jpg";
import bayardRustinImg from "@assets/bayard_rustin.jpg";
import sylviaRiveraImg from "@assets/sylvia_rivera_wiki.jpg";
import elizebethFriedmanImg from "@assets/elizebeth_friedman_wiki.jpg";
import claudetteColvinImg from "@assets/claudette_colvin_wiki.jpg";
import audreLordeImg from "@assets/audre_lorde_large.jpg";
import templeGrandinImg from "@assets/temple_grandin.jpg";

const councilAnalysis = [
  { name: "Alan", image: alanTuringImg, color: "purple", contribution: "Flags reports indicating LGBTQ+ safety failures" },
  { name: "Claudette", image: claudetteColvinImg, color: "yellow", contribution: "Detects when marginalized voices are being silenced/erased" },
  { name: "Audre", image: audreLordeImg, color: "pink", contribution: "Identifies intersectional harm patterns (e.g., Black women reporting both racism + sexism)" },
  { name: "Sylvia", image: sylviaRiveraImg, color: "red", contribution: "Prioritizes reports from most vulnerable employees (frontline, contractors)" },
  { name: "Temple", image: templeGrandinImg, color: "cyan", contribution: "Spots edge cases that policy didn't anticipate" },
  { name: "Elizebeth", image: elizebethFriedmanImg, color: "green", contribution: "Cross-references reports for patterns (same manager, same location)" },
  { name: "Lynn", image: lynnConwayImg, color: "blue", contribution: "Analyzes system failures (broken reporting process, tech barriers)" },
  { name: "Bayard", image: bayardRustinImg, color: "orange", contribution: "Maps coalition opportunities (connecting isolated reporters)" },
];

const reportingFeatures = [
  { icon: Key, title: "Zero-knowledge encryption", desc: "Vector can't see reporter identity" },
  { icon: MessageSquare, title: "Anonymous follow-up", desc: "Two-way communication without revealing identity" },
  { icon: Upload, title: "Secure file upload", desc: "Photos, documents, recordings - all encrypted" },
  { icon: FileText, title: "Category selection", desc: "Discrimination, Harassment, Safety, Policy Gap, Retaliation" },
  { icon: MapPin, title: "Location tagging", desc: "Department, office, remote" },
  { icon: Calendar, title: "Date/time logging", desc: "With timezone support" },
  { icon: Languages, title: "15 languages", desc: "Multiple language support" },
];

const alertLevels = [
  { level: "Critical", color: "red", icon: "🔴", desc: "Immediate danger, legal risk, multiple victims", timing: "Notify within 1 hour" },
  { level: "High", color: "orange", icon: "🟠", desc: "Pattern detected, retaliation concern", timing: "Notify within 24 hours" },
  { level: "Medium", color: "yellow", icon: "🟡", desc: "Policy gap identified", timing: "Weekly digest" },
  { level: "Info", color: "green", icon: "🟢", desc: "General feedback, kudos", timing: "Monthly report" },
];

const keyFeatures = [
  {
    title: "Whistleblower Protection",
    icon: ShieldCheck,
    color: "green",
    items: [
      "Dodd-Frank Act compliant",
      "SEC whistleblower program integration",
      "Legal counsel referral network",
      "Retaliation detection algorithms",
      "Evidence preservation (tamper-proof audit trail)",
    ],
  },
  {
    title: "Encrypted Communication",
    icon: Lock,
    color: "cyan",
    items: [
      "Zero-knowledge architecture",
      "Anonymous two-way messaging",
      "Secure file storage (encrypted at rest + transit)",
      "Auto-delete options (reporter controls retention)",
      "No IP logging, no device fingerprinting",
    ],
  },
  {
    title: "Sovereign QI Integration",
    icon: Cpu,
    color: "purple",
    items: [
      "Shield reports trigger QI re-simulation",
      "Pattern detection creates summary reports",
      "Auto-queue policies for Council review",
      "8-agent deliberation with Shield feedback",
      "Alan VETO based on real-world evidence",
    ],
  },
  {
    title: "Vector Mirror Integration",
    icon: Eye,
    color: "amber",
    items: [
      "Report volume by department (heat map)",
      "Resolution rate and time-to-close",
      "Retaliation risk score",
      "Reporter satisfaction scores",
      "Gap analysis: Where policies fail in practice",
    ],
  },
  {
    title: "Compliance Documentation",
    icon: FileCheck,
    color: "blue",
    items: [
      "Every report = audit evidence of listening",
      "EEOC investigation defense ready",
      "Duty of care proof (investigation timelines)",
      "SEC/Dodd-Frank record retention",
      "Export: Legal hold, discovery, regulatory",
    ],
  },
];

const useCases = [
  {
    id: "harassment",
    title: "Stopping Harassment Before Lawsuit",
    client: "Financial Services",
    scenario: "Senior VP harassing junior analysts, 5 employees afraid to report",
    without: "Victims stay silent for 18 months → class action lawsuit → $8M settlement",
    with: [
      "3 anonymous reports in 2 weeks",
      "Pattern detected by AI",
      "Investigation launched",
      "VP terminated",
      "Zero lawsuit",
    ],
    roi: "$8M lawsuit avoided, legal fees saved, reputation protected",
    color: "red",
  },
  {
    id: "policy",
    title: "Policy Gap Detection",
    client: "Tech Company",
    scenario: "New parental leave policy deployed, looks great on paper",
    without: "HR thinks policy is working, employees struggling in silence",
    with: [
      "25 reports in first month",
      "'Manager pressuring me not to take full leave'",
      "Sovereign QI re-simulation with feedback",
      "Policy revised",
      "Satisfaction rises from 45% to 89%",
    ],
    roi: "Attrition drops 12%, Glassdoor rating improves",
    color: "blue",
  },
  {
    id: "vendor",
    title: "Vendor Misconduct",
    client: "Manufacturing",
    scenario: "Contract workers being harassed by vendor supervisor",
    without: "Contractors have no reporting mechanism, suffering in silence",
    with: [
      "Vendor access granted to Shield",
      "12 reports in 3 weeks",
      "Pattern clear",
      "Vendor contract terminated",
      "Shield mandated for all vendors",
    ],
    roi: "Duty of care extended to contractors, legal liability reduced",
    color: "orange",
  },
  {
    id: "whistleblower",
    title: "Whistleblower Protection",
    client: "Pharmaceutical",
    scenario: "Employee discovers data manipulation in clinical trial",
    without: "Employee fears retaliation, stays silent → FDA discovers later → $2B fine",
    with: [
      "Anonymous report filed",
      "Legal counsel referred",
      "SEC whistleblower program",
      "Company self-reports",
      "Reduced penalties",
    ],
    roi: "Employee protected (anonymous), company cooperates early, reputation preserved",
    color: "green",
  },
];

const securityBadges = [
  "SOC 2 Type II certified",
  "GDPR compliant",
  "Dodd-Frank Act aligned",
  "SEC whistleblower compatible",
  "ISO 27001",
  "Penetration tested quarterly",
];

const faqs = [
  { q: "Can my employer identify me?", a: "NO - zero-knowledge encryption ensures even Vector can't identify you" },
  { q: "What if I fear retaliation?", a: "Shield monitors employment actions (termination, demotion, transfer) after reports and flags potential retaliation" },
  { q: "How long are reports stored?", a: "You control data retention - auto-delete options from 30 days to permanent" },
  { q: "Can I report about my vendor/contractor?", a: "YES - Shield extends to entire supply chain" },
  { q: "What happens after I report?", a: "You receive updates via anonymous messaging, can participate in investigation anonymously" },
];

const pricingTiers = [
  {
    name: "Enterprise",
    price: "$50K",
    period: "/year",
    description: "Unlimited employees + vendors",
    features: [
      "Mobile + web app",
      "24/7 support",
      "Legal counsel referral",
      "Sovereign QI integration",
      "Mirror dashboard included",
    ],
    highlighted: true,
  },
  {
    name: "Mid-Market",
    price: "$15K",
    period: "/year",
    description: "Up to 500 users",
    features: [
      "Standard features",
      "Email support",
      "Mirror dashboard",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Nonprofit",
    price: "50%",
    period: "discount",
    description: "Mission-aligned organizations",
    features: [
      "All Enterprise features",
      "Reduced pricing",
      "Priority support",
      "Impact reporting",
    ],
    highlighted: false,
  },
];

export default function VectorShieldPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", employees: "" });

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tighter" data-testid="link-home">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <Link href="/products/esg-compliance" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> Back to ESG Compliance
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-emerald-950/30 to-background" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L90 90 L10 90 Z' fill='none' stroke='%2310b981' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-6">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-sm uppercase tracking-wider text-green-400 font-mono mb-4">EMPLOYEE & VENDOR REPORTING</p>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Vector Shield
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Anonymous, encrypted incident reporting. Give your people a voice. Give your executives ground truth. Prove you listened.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["End-to-End Encrypted", "Whistleblower Protected", "No Retaliation Guarantee"].map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-xs">
                    <CheckCircle className="w-3 h-3" /> {badge}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3" data-testid="button-request-demo">
                  Request Shield Demo
                </Button>
                <Button variant="outline" className="border-green-500/50 text-green-300 hover:bg-green-500/10 px-8 py-3" data-testid="button-whitepaper">
                  <Download className="w-5 h-5 mr-2" /> Security Whitepaper
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={shieldAppMockup} 
                alt="Vector Shield mobile app - anonymous incident reporting" 
                className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl shadow-green-500/20"
              />
            </motion.div>
          </div>
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
            Your Employees Know What's Broken. Are You Listening?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: "71%", desc: "of employees", sub: "Won't report issues due to fear of retaliation", color: "orange" },
              { stat: "$2.4M", desc: "average settlement", sub: "When harassment goes unreported", color: "red" },
              { stat: "18 months", desc: "average time", sub: "From first incident to lawsuit filing", color: "yellow" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border border-${item.color}-500/30 text-center`}
              >
                <p className={`text-4xl font-bold text-${item.color}-400 mb-2`}>{item.stat}</p>
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
              "We had a DEI policy on paper. Employees were suffering in silence. By the time HR found out, we were in federal court."
            </p>
            <cite className="text-red-400 text-sm font-medium">— Fortune 500 CHRO, 2024</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* How It Works - Anonymous Reporting */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              How Vector Shield Works
            </h2>
            <p className="text-gray-400">Secure, anonymous reporting with AI-powered pattern detection</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                <span className="text-green-400">1.</span> Anonymous Reporting
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {reportingFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 glass-panel rounded-lg border border-white/5">
                      <Icon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{feature.title}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src={shieldAppMockup} 
                alt="Vector Shield reporting interface" 
                className="w-64 rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>

          {/* Council Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              <span className="text-green-400">2.</span> AI-Powered Pattern Detection (Council Integration)
            </h3>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              The 8 Liberation Pioneer agents analyze Shield reports to detect patterns humans miss
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              {councilAnalysis.map((agent, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-panel rounded-xl p-4 border border-${agent.color}-500/30`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={agent.image} 
                      alt={agent.name}
                      className={`w-10 h-10 rounded-full object-cover ring-2 ring-${agent.color}-500`}
                    />
                    <span className="font-bold text-white">{agent.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{agent.contribution}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Executive Alerting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              <span className="text-green-400">3.</span> Executive Alerting
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {alertLevels.map((alert, i) => (
                <div key={i} className={`glass-panel rounded-xl p-4 border border-${alert.color}-500/30`}>
                  <div className="text-2xl mb-2">{alert.icon}</div>
                  <p className={`font-bold text-${alert.color}-400 mb-1`}>{alert.level}</p>
                  <p className="text-xs text-gray-400 mb-2">{alert.desc}</p>
                  <p className="text-xs text-gray-500">{alert.timing}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Key Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, i) => {
              const Icon = feature.icon;
              const colorMap: Record<string, string> = {
                green: "bg-green-500/20 text-green-300 border-green-500/30",
                cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-panel rounded-xl p-6 border ${colorMap[feature.color]}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${colorMap[feature.color]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, j) => (
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

      {/* Use Cases */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Real-World Use Cases
          </motion.h2>

          <Tabs defaultValue="harassment" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto mb-8">
              {useCases.map(uc => (
                <TabsTrigger
                  key={uc.id}
                  value={uc.id}
                  className="px-4 py-3 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 rounded-lg border border-white/10 data-[state=active]:border-green-500/30 text-xs"
                  data-testid={`tab-${uc.id}`}
                >
                  {uc.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {useCases.map(uc => (
              <TabsContent key={uc.id} value={uc.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-panel rounded-xl p-6 border border-${uc.color}-500/20`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-white">{uc.title}</h3>
                    <span className="text-xs text-gray-500">({uc.client})</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{uc.scenario}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-xs text-gray-500 mb-2">Without Shield</p>
                      <p className="text-red-300 text-sm">{uc.without}</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-xs text-gray-500 mb-2">With Shield</p>
                      <ul className="space-y-1">
                        {uc.with.map((step, j) => (
                          <li key={j} className="text-green-300 text-sm flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/20 rounded">
                    <p className="text-xs text-gray-500">ROI</p>
                    <p className="text-green-400 font-medium text-sm">{uc.roi}</p>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-display font-bold text-white text-center mb-8"
          >
            Security & Compliance
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {securityBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg border border-green-500/20">
                <Award className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{badge}</span>
              </div>
            ))}
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
            Pricing
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                  <div className="text-xs text-green-400 font-medium uppercase mb-2">Recommended</div>
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
                <Button 
                  className={tier.highlighted ? "w-full bg-green-600 hover:bg-green-700" : "w-full"} 
                  variant={tier.highlighted ? "default" : "outline"}
                  data-testid={`button-pricing-${i}`}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Bundle: Shield + Mirror + Sovereign QI = <span className="text-green-400 font-medium">$150K/year</span> (save $15K)
            </p>
            <Link href="/products/esg-compliance" className="text-green-400 hover:text-green-300 text-sm underline">
              View full ecosystem pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl p-5 border border-white/10"
              >
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
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
              Give Your People a Voice They Can Trust
            </h2>
            <p className="text-gray-400 mb-8">
              Request a demo to see how Vector Shield creates psychological safety at scale
            </p>

            <div className="glass-panel rounded-xl p-6 border border-green-500/20">
              <p className="text-green-400 text-sm font-medium mb-4">
                Demo includes: Live walkthrough, encryption deep-dive, compliance review
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
                  placeholder="# Employees" 
                  value={formData.employees}
                  onChange={(e) => setFormData({...formData, employees: e.target.value})}
                  className="bg-white/5 border-white/10"
                  data-testid="input-employees"
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" data-testid="button-request-shield-demo">
                Request Shield Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Links */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/dashboard" className="glass-panel rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Sovereign QI</span>
              </div>
              <p className="text-xs text-gray-500">Shield reports power QI simulations</p>
            </Link>
            <Link href="/products/esg-compliance" className="glass-panel rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Vector Mirror</span>
              </div>
              <p className="text-xs text-gray-500">See Shield data in executive dashboard</p>
            </Link>
            <Link href="/products/esg-compliance" className="glass-panel rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">ESG Ecosystem</span>
              </div>
              <p className="text-xs text-gray-500">Complete compliance suite</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-4">
            <a href="#" className="hover:text-green-400 transition-colors">Security Whitepaper</a>
            <a href="#" className="hover:text-green-400 transition-colors">Whistleblower Resources</a>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Emergency hotline: <span className="text-green-400">1-800-SHIELD-QI</span> (24/7 crisis support)
          </p>
          <p className="text-sm text-gray-600">
            shield@vectorforgood.com
          </p>
        </div>
      </footer>
    </div>
  );
}
