import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, Phone, Shield, Eye, Users, Scale, Cpu, Mic, Search, Lightbulb,
  CheckCircle, FileText, AlertTriangle, Lock, Clock, Building, Briefcase, TrendingUp,
  MessageSquare, Bell, BarChart3, FileCheck, LineChart, Globe, PieChart, Target,
  AlertCircle, ChevronRight, Layers, Activity, Gauge, Database, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mirrorDashboard from "@assets/Gemini_Generated_Image_frx3uufrx3uufrx3_1767531909471.png";
import ecosystemCycle from "@assets/Gemini_Generated_Image_yqbtsjyqbtsjyqbt_1767532163545.png";

const dashboardSections = [
  { icon: Cpu, title: "Sovereign QI Data", desc: "Live feed of governance simulation results and Council deliberations", color: "purple" },
  { icon: Shield, title: "Shield Analytics", desc: "Anonymous report volume, resolution rates, pattern alerts", color: "green" },
  { icon: Target, title: "Gap Analysis", desc: "Where policy ≠ reality based on Shield feedback", color: "orange" },
  { icon: Gauge, title: "ESG Scores", desc: "Real-time E, S, G scores with trend indicators", color: "cyan" },
  { icon: AlertTriangle, title: "Risk Monitoring", desc: "Litigation risk, regulatory exposure, reputational threats", color: "red" },
];

const keyFeatures = [
  {
    title: "Real-Time Data Integration",
    icon: Activity,
    color: "cyan",
    items: [
      "Sovereign QI simulation results (live feed)",
      "Vector Shield report analytics",
      "Council deliberation transcripts",
      "External ESG data sources (Bloomberg, S&P)",
      "Employee engagement surveys",
    ],
  },
  {
    title: "Board-Ready Reporting",
    icon: FileText,
    color: "blue",
    items: [
      "One-click executive summary generation",
      "Quarterly ESG trend reports",
      "Audit-ready compliance documentation",
      "Custom visualization templates",
      "Export to PDF, PowerPoint, CSV",
    ],
  },
  {
    title: "Investor Due Diligence Package",
    icon: Briefcase,
    color: "purple",
    items: [
      "ESG metrics aligned to SASB/GRI standards",
      "Governance decision audit trails",
      "Risk assessment documentation",
      "Stakeholder engagement evidence",
      "Third-party verification ready",
    ],
  },
  {
    title: "Predictive Analytics",
    icon: LineChart,
    color: "amber",
    items: [
      "Litigation risk forecasting",
      "Policy effectiveness scoring",
      "Employee sentiment trending",
      "Regulatory change impact modeling",
      "ESG score projection",
    ],
  },
];

const useCases = [
  {
    id: "board",
    title: "Board ESG Presentation",
    client: "Fortune 500 Retailer",
    scenario: "Quarterly board meeting requires ESG update with limited prep time",
    without: "72 hours compiling data from 6 systems, manual slide creation",
    with: [
      "One-click dashboard export",
      "AI-generated executive summary",
      "Trend analysis automatically included",
      "Live Q&A with real-time data access",
    ],
    roi: "Board prep time reduced from 72 hours to 2 hours",
    color: "cyan",
  },
  {
    id: "investor",
    title: "Series C Due Diligence",
    client: "Growth Stage SaaS",
    scenario: "Lead investor requests comprehensive ESG documentation",
    without: "2-week scramble, inconsistent data, missed deadlines",
    with: [
      "Pre-built investor package exported instantly",
      "Complete audit trail of governance decisions",
      "Third-party verification documentation",
      "Live dashboard access for investors",
    ],
    roi: "$100M round closed 3 weeks faster with ESG premium",
    color: "green",
  },
  {
    id: "audit",
    title: "Regulatory Audit Response",
    client: "Healthcare Provider",
    scenario: "State regulator demands DEI compliance documentation",
    without: "Panic mode, hiring consultants, 6-month project",
    with: [
      "Complete policy simulation history",
      "Shield report analytics proving listening culture",
      "Council deliberation transcripts (VETO documentation)",
      "Gap analysis showing continuous improvement",
    ],
    roi: "Audit passed in 30 days, zero findings",
    color: "blue",
  },
  {
    id: "crisis",
    title: "Crisis Communication",
    client: "Manufacturing",
    scenario: "Workplace incident creates media scrutiny on safety culture",
    without: "No data to show proactive measures, defensive posture",
    with: [
      "Evidence of ongoing safety simulations",
      "Shield report response rates (98% within 24 hours)",
      "Policy improvements driven by employee feedback",
      "Council analysis showing edge case testing",
    ],
    roi: "Media narrative shifted from 'negligent' to 'industry leader in safety culture'",
    color: "orange",
  },
];

const integrationLinks = [
  { name: "Sovereign QI", desc: "Governance simulation engine", link: "/council", icon: Cpu },
  { name: "Vector Shield", desc: "Anonymous reporting", link: "/products/esg-compliance/vector-shield", icon: Shield },
  { name: "ESG Compliance Hub", desc: "Documentation & audit trails", link: "/products/esg-compliance", icon: FileCheck },
];

const pricingTiers = [
  {
    name: "Enterprise",
    price: "$40K",
    period: "/year",
    description: "Full executive dashboard suite",
    features: [
      "Unlimited users",
      "Real-time Sovereign QI integration",
      "Vector Shield analytics",
      "Custom report templates",
      "Investor due diligence package",
      "Dedicated success manager",
    ],
    highlighted: true,
  },
  {
    name: "Mid-Market",
    price: "$12K",
    period: "/year",
    description: "Essential ESG visibility",
    features: [
      "Up to 10 dashboard users",
      "Standard integrations",
      "Quarterly report generation",
      "Email support",
    ],
    highlighted: false,
  },
];

const metricCards = [
  { stat: "87%", desc: "of investors", sub: "Now require ESG metrics before investment", color: "cyan" },
  { stat: "$4.5M", desc: "average cost", sub: "Of ESG washing allegations and settlements", color: "red" },
  { stat: "72 hrs", desc: "average time", sub: "Spent preparing each board ESG report", color: "orange" },
];

export default function VectorMirrorPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", role: "" });

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
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-blue-950/30 to-background" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 mb-6">
                <Eye className="w-10 h-10 text-cyan-400" />
              </div>
              <p className="text-sm uppercase tracking-wider text-cyan-400 font-mono mb-4">EXECUTIVE ESG DASHBOARD</p>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
                Vector Mirror
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Real-time ESG performance. Governance simulation + employee reality = Board-ready truth.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Real-Time Data", "Board-Ready Reports", "Investor Package"].map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                    <CheckCircle className="w-3 h-3" /> {badge}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3" data-testid="button-request-demo">
                  Request Mirror Demo
                </Button>
                <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-3" data-testid="button-sample-report">
                  <Download className="w-5 h-5 mr-2" /> Sample Board Report
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
                src={mirrorDashboard} 
                alt="Vector Mirror executive ESG dashboard" 
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl shadow-cyan-500/20 border border-cyan-500/20"
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
            Your Board Is Asking Questions. Can You Answer With Data?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {metricCards.map((item, i) => (
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
            className="glass-panel rounded-xl p-6 md:p-8 border border-cyan-500/20 text-center"
          >
            <p className="text-lg md:text-xl text-gray-200 italic mb-3">
              "The board asked about our DEI progress. I had a slide deck with aspirations. They wanted metrics. I couldn't answer."
            </p>
            <cite className="text-cyan-400 text-sm font-medium">— Chief People Officer, Tech Unicorn</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              The Executive ESG Command Center
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Five integrated views that turn governance data into board-ready insights</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                {dashboardSections.map((section, i) => {
                  const Icon = section.icon;
                  const colorMap: Record<string, string> = {
                    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                    green: "bg-green-500/20 text-green-300 border-green-500/30",
                    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
                    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                    red: "bg-red-500/20 text-red-300 border-red-500/30",
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-start gap-4 p-4 glass-panel rounded-xl border ${colorMap[section.color]}`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${colorMap[section.color]} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{section.title}</h4>
                        <p className="text-sm text-gray-400">{section.desc}</p>
                      </div>
                    </motion.div>
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
                src={ecosystemCycle} 
                alt="ESG data ecosystem integration" 
                className="w-full max-w-md rounded-2xl shadow-xl border border-cyan-500/10"
              />
            </motion.div>
          </div>
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

          <div className="grid md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, i) => {
              const Icon = feature.icon;
              const colorMap: Record<string, string> = {
                cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
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
                        <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
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
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-950/10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Real-World Use Cases
          </motion.h2>

          <Tabs defaultValue="board" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto mb-8">
              {useCases.map(uc => (
                <TabsTrigger
                  key={uc.id}
                  value={uc.id}
                  className={`data-[state=active]:bg-${uc.color}-500/20 data-[state=active]:border-${uc.color}-500/50 border border-white/10 rounded-lg py-2 px-3 text-sm`}
                  data-testid={`tab-usecase-${uc.id}`}
                >
                  {uc.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {useCases.map(uc => (
              <TabsContent key={uc.id} value={uc.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-panel rounded-xl p-6 md:p-8 border border-${uc.color}-500/30`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded bg-${uc.color}-500/20 text-${uc.color}-300 text-xs font-medium`}>
                      {uc.client}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{uc.title}</h3>
                  <p className="text-gray-400 mb-6">{uc.scenario}</p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 font-medium text-sm mb-2">❌ Without Vector Mirror</p>
                      <p className="text-gray-400 text-sm">{uc.without}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-green-400 font-medium text-sm mb-2">✓ With Vector Mirror</p>
                      <ul className="space-y-1">
                        {uc.with.map((item, i) => (
                          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg bg-${uc.color}-500/10 border border-${uc.color}-500/20`}>
                    <p className={`text-${uc.color}-300 font-medium`}>ROI: {uc.roi}</p>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Links */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-4"
          >
            Connected Ecosystem
          </motion.h2>
          <p className="text-gray-400 text-center mb-10">
            Vector Mirror integrates with all Sovereign QI products
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {integrationLinks.map((int, i) => {
              const Icon = int.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={int.link}>
                    <div className="glass-panel rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-colors cursor-pointer group" data-testid={`link-integration-${int.name.toLowerCase().replace(' ', '-')}`}>
                      <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{int.name}</h4>
                      <p className="text-sm text-gray-400">{int.desc}</p>
                      <ChevronRight className="w-5 h-5 text-cyan-400 mt-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-950/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Pricing
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border ${tier.highlighted ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' : 'border-white/10'}`}
              >
                {tier.highlighted && (
                  <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-cyan-400">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={tier.highlighted ? "w-full bg-cyan-600 hover:bg-cyan-700 text-white" : "w-full"} 
                  variant={tier.highlighted ? "default" : "outline"}
                  data-testid={`button-pricing-${tier.name.toLowerCase()}`}
                >
                  {tier.highlighted ? "Get Started" : "Contact Sales"}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-cyan-500/30"
          >
            <div className="text-center mb-8">
              <Eye className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                See Your ESG Data in Real-Time
              </h2>
              <p className="text-gray-400">
                Schedule a personalized demo with your own governance data
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-cyan-500"
                  data-testid="input-name"
                />
                <Input
                  placeholder="Work Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-cyan-500"
                  data-testid="input-email"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-cyan-500"
                  data-testid="input-company"
                />
                <Input
                  placeholder="Your Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-cyan-500"
                  data-testid="input-role"
                />
              </div>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3" data-testid="button-submit-demo">
                <Phone className="w-5 h-5 mr-2" /> Schedule Demo
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-display font-bold text-white tracking-tighter">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/products/esg-compliance" className="hover:text-white transition-colors">ESG Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
