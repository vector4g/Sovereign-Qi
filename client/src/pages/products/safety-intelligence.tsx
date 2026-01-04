import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, MapPin, Shield, Radar, CheckCircle, AlertTriangle, 
  Globe, Building2, GraduationCap, Plane, Hotel, Bell, Scale,
  Plug, ChevronDown, ChevronUp, Phone, Mail, Play, Download,
  Users, Star, Clock, Zap, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import safetyMapHero from "@/assets/safety-map-hero.png";
import dangerStatsBg from "@/assets/danger-stats-bg.png";
import safetyIntelligenceLogo from "@/assets/safety-intelligence-logo.png";
import qiCertifiedElite from "@/assets/qi-certified-elite.png";
import qiCertified from "@/assets/qi-certified.png";
import qiPartner from "@/assets/qi-partner.png";
import { Accessibility, Moon, Users2, Handshake } from "lucide-react";

const intersectionalCategories = [
  {
    title: "LGBTQ+ Safety",
    icon: Heart,
    color: "from-pink-500 to-violet-500",
    items: ["Legal protections (marriage, employment)", "Social acceptance & visibility", "Violence & hate crime risk", "Healthcare access (HIV/PrEP, gender-affirming)"],
  },
  {
    title: "Neurodivergent Access",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    items: ["Sensory-friendly environments", "Clear communication protocols", "Autism-friendly accommodations", "ADHD considerations & support"],
  },
  {
    title: "Solo Female Safety",
    icon: Moon,
    color: "from-violet-500 to-purple-500",
    items: ["Harassment risk assessment", "Well-lit areas & safe routes", "Secure accommodations", "Transportation safety ratings"],
  },
  {
    title: "Disability Access",
    icon: Accessibility,
    color: "from-green-500 to-teal-500",
    items: ["Physical accessibility (beyond ADA)", "Visual/hearing accommodations", "Chronic illness support", "Service animal policies"],
  },
  {
    title: "Anti-Racism & Inclusion",
    icon: Handshake,
    color: "from-orange-500 to-amber-500",
    items: ["Xenophobia risk assessment", "Religious accommodation", "Language barrier support", "Cultural sensitivity training"],
  },
];

const qiTiers = [
  {
    name: "QI Elite",
    badge: qiCertifiedElite,
    color: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-500/50",
    description: "Premium 5-star properties meeting all safety standards",
    requirements: ["Full intersectional staff training", "24/7 safety support hotline", "Emergency extraction protocols", "All 5 safety categories verified"],
  },
  {
    name: "QI Certified",
    badge: qiCertified,
    color: "from-cyan-400 to-teal-500",
    borderColor: "border-cyan-500/50",
    description: "Standard 3-4 star properties with verified safety",
    requirements: ["Basic safety standards met", "Staff trained on core categories", "Incident reporting system", "Annual safety audit"],
  },
  {
    name: "QI Partner",
    badge: qiPartner,
    color: "from-violet-400 to-purple-500",
    borderColor: "border-violet-500/50",
    description: "Entry-level commitment to improvement",
    requirements: ["Commitment to safety improvement", "Baseline safety assessment", "Progress tracking", "Training roadmap"],
  },
];

const howItWorks = [
  {
    title: "Real-Time Risk Monitoring",
    icon: Radar,
    color: "cyan",
    items: [
      "ILGA & Human Rights Watch data feeds",
      "State Department travel advisories",
      "Disability rights organization reports",
      "Women's safety networks",
      "Anti-racism watchdog monitoring",
    ],
    footer: "Updates every 6 hours • Instant alerts for changes",
  },
  {
    title: "Intersectional Safety Scores",
    icon: Shield,
    color: "green",
    items: [
      "LGBTQ+ legal & social protections",
      "Neurodivergent accessibility ratings",
      "Solo female harassment risk",
      "Disability accommodation levels",
      "Racism & religious tolerance",
    ],
    footer: "Granular by city, covering all 5 categories",
  },
  {
    title: "QI Certified Properties",
    icon: CheckCircle,
    color: "violet",
    items: [
      "Hotel & venue QI certification tiers",
      "Verified staff training records",
      "Travel booking integration",
      "Automatic policy recommendations",
      "Emergency response protocols",
    ],
    footer: "Data-driven, not performative",
  },
];

const features = [
  {
    title: "Destination Risk Profiles",
    icon: Globe,
    desc: "Interactive map showing 195 countries color-coded by intersectional safety. Click any country for detailed breakdown across all 5 categories.",
    example: "Uganda - Risk Level: EXTREME - Multiple categories flagged",
  },
  {
    title: "QI Certified Properties",
    icon: Hotel,
    desc: "Vetted safe hotels with QI Certification tiers (Elite/Certified/Partner). Staff training verification, sensory-friendly options, accessibility.",
    example: "Data-driven certification, not performative",
  },
  {
    title: "Proactive Danger Alerts",
    icon: Bell,
    desc: "Real-time push notifications for law changes, hate incidents, accessibility issues. Geofencing alerts for all traveler categories.",
    example: "Automatic trip cancellation triggers",
  },
  {
    title: "Legal Landscape Monitoring",
    icon: Scale,
    desc: "Track 195 countries across LGBTQ+ laws, disability rights, women's safety, religious freedom, and anti-discrimination policies.",
    example: "Quarterly compliance reports for legal teams",
  },
  {
    title: "Corporate Travel Integration",
    icon: Plug,
    desc: "API integrations with Concur, SAP, TripActions, Slack/Teams, HR systems. Automated approval with intersectional risk scoring.",
    example: "Auto-deny unsafe destinations",
  },
];

const useCases = [
  {
    id: "fortune500",
    title: "Fortune 500 HR Teams",
    icon: Building2,
    problem: "Employee sues for $8M after attack in Russia",
    solution: "Safety Intelligence auto-flagged Russia as high-risk, recommended travel ban",
    outcome: "Zero incidents since implementation, 94% employee satisfaction",
  },
  {
    id: "consulting",
    title: "Professional Services",
    icon: Users,
    problem: "Consultant closeted at work, outed during client visit to Saudi Arabia",
    solution: "Pre-travel risk assessment + safe hotel options + emergency extraction plan",
    outcome: "Consultant safely returned, firm avoided duty of care lawsuit",
  },
  {
    id: "academic",
    title: "Academic Conferences",
    icon: GraduationCap,
    problem: "Professor arrested in Qatar for 'promoting homosexuality' (wore rainbow pin)",
    solution: "Conference host used Safety Intelligence to choose Canada instead of Qatar",
    outcome: "3,000 attendees safely participated in Pride-affirming event",
  },
  {
    id: "luxury",
    title: "Luxury Travel",
    icon: Plane,
    problem: "High-net-worth client demands 5-star travel but refuses unsafe destinations",
    solution: "QueerLuxe Travel curates safe luxury experiences powered by Safety Intelligence",
    outcome: "$2M+ bookings, zero safety incidents",
  },
];

const pricing = [
  {
    name: "Enterprise",
    price: "Custom",
    subtitle: "Fortune 500 (starts at $50K/year)",
    features: ["Unlimited users", "Full API access", "Dedicated account manager", "Custom risk thresholds", "White-label option"],
    highlighted: true,
  },
  {
    name: "Mid-Market",
    price: "$15K/year",
    subtitle: "50-500 employees",
    features: ["Standard risk data", "Email alerts", "Hotel recommendations", "Basic API access", "Email support"],
    highlighted: false,
  },
  {
    name: "Nonprofit/Academic",
    price: "50% off",
    subtitle: "Verified organizations",
    features: ["Full Enterprise features", "Discounted pricing", "Grant assistance", "Research access", "Community support"],
    highlighted: false,
  },
];

const faqs = [
  { q: "How often is data updated?", a: "Every 6 hours for routine updates, plus instant alerts for breaking news, law changes, or safety incidents." },
  { q: "Do you track individual employees?", a: "No - we provide aggregate safety data only. Individual tracking is opt-in only with employee consent." },
  { q: "What about closeted employees?", a: "Anonymous risk assessments available. Employees can access safety data without disclosing identity to employer." },
  { q: "Can we customize risk thresholds?", a: "Yes - some companies ban all non-marriage-equality countries, others focus on criminalization. Fully configurable." },
  { q: "What happens during a crisis?", a: "24/7 emergency hotline + coordination with extraction services + direct embassy contacts." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
        data-testid={`faq-${q.slice(0, 20).replace(/\s/g, '-')}`}
      >
        <span className="text-white font-medium">{q}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pb-4 text-gray-400"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

export default function SafetyIntelligence() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", role: "", employees: "" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-slate-900/50 text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tighter" data-testid="link-home">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={safetyMapHero} 
            alt="World map with LGBTQ+ safety hotspots" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src={safetyIntelligenceLogo} 
                alt="Safety Intelligence - Intersectional Travel Protection" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>
            <p className="text-sm uppercase tracking-wider text-cyan-400 font-mono mb-4">INTERSECTIONAL TRAVEL PROTECTION</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Safety Intelligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Real-time intersectional travel safety data covering 195 countries. Protecting LGBTQ+, neurodivergent, solo female, disabled, and travelers of color.
              <span className="text-cyan-300 font-medium"> Intelligence-grade safety, not performative.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg" data-testid="button-request-demo">
                Request Enterprise Demo
              </Button>
              <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-3 text-lg" data-testid="button-sample-report">
                <Download className="w-5 h-5 mr-2" /> View Sample Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="relative py-16 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Your Employees Are Traveling Into the Unknown
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto mb-8">
          <img 
            src={dangerStatsBg} 
            alt="71 countries criminalize LGBTQ+ relationships, 15 have death penalty, $12M average lawsuit cost" 
            className="w-full h-auto rounded-xl shadow-2xl shadow-red-500/20"
          />
        </div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-xl p-6 md:p-8 border border-red-500/20 text-center max-w-3xl mx-auto"
        >
          <p className="text-lg md:text-xl text-gray-200 italic mb-3">
            "We sent our employee to Uganda for a conference. Two weeks later, he was arrested. We had no idea."
          </p>
          <cite className="text-red-400 text-sm font-medium">— Fortune 500 HR Director, 2024</cite>
        </motion.blockquote>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            How Safety Intelligence Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((col, i) => {
              const Icon = col.icon;
              const colorClasses = {
                cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                green: "bg-green-500/20 text-green-300 border-green-500/30",
                violet: "bg-violet-500/20 text-violet-300 border-violet-500/30",
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-panel rounded-xl p-6 border ${colorClasses[col.color as keyof typeof colorClasses]}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[col.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{col.title}</h3>
                  <ul className="space-y-2 mb-4">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 border-t border-white/10 pt-4">{col.footer}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intersectional Safety Categories */}
      <section className="py-16 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-950/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              5 Intersectional Safety Categories
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The first platform protecting ALL marginalized travelers with compounding vulnerabilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {intersectionalCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-3">{cat.title}</h3>
                  <ul className="space-y-1.5">
                    {cat.items.map((item, j) => (
                      <li key={j} className="text-xs text-gray-400 flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
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

      {/* QI Certified Tiers */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              QI Certified Properties
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Data-driven certification tiers for hotels and venues. Not self-declared — rigorously verified.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {qiTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border ${tier.borderColor} text-center`}
              >
                <img 
                  src={tier.badge} 
                  alt={`${tier.name} certification badge`}
                  className="w-32 h-32 mx-auto mb-4 object-contain"
                />
                <h3 className={`text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                  {tier.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <ul className="space-y-2 text-left">
                  {tier.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{feature.desc}</p>
                  <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                    <p className="text-red-300 text-xs font-mono">{feature.example}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
            Use Cases
          </motion.h2>

          <Tabs defaultValue="fortune500" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto mb-8">
              {useCases.map(uc => {
                const Icon = uc.icon;
                return (
                  <TabsTrigger
                    key={uc.id}
                    value={uc.id}
                    className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 rounded-lg border border-white/10 data-[state=active]:border-cyan-500/30"
                    data-testid={`tab-${uc.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs md:text-sm">{uc.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {useCases.map(uc => (
              <TabsContent key={uc.id} value={uc.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-xl p-8 border border-white/10"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-red-400 text-xs font-mono mb-2">PROBLEM</p>
                      <p className="text-gray-300">{uc.problem}</p>
                    </div>
                    <div>
                      <p className="text-cyan-400 text-xs font-mono mb-2">SOLUTION</p>
                      <p className="text-gray-300">{uc.solution}</p>
                    </div>
                    <div>
                      <p className="text-green-400 text-xs font-mono mb-2">OUTCOME</p>
                      <p className="text-gray-300">{uc.outcome}</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Pricing & Plans
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-6 border ${plan.highlighted ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10'}`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-mono text-cyan-400 mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-cyan-300 mb-1">{plan.price}</p>
                <p className="text-gray-500 text-sm mb-4">{plan.subtitle}</p>
                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            <Star className="w-4 h-4 inline mr-1" />
            Individual Travelers: Consumer app coming soon (beta waitlist open)
          </p>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-display font-bold text-white mb-8"
          >
            Integration Partners
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
            {["IGLTA", "ILGA", "Human Rights Watch", "State Department", "Concur", "SAP", "TripActions"].map((partner, i) => (
              <span key={i} className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-8 border border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5 text-center"
          >
            <Heart className="w-8 h-8 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Trust & Credibility</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
              <p>Founded by International Queer Safety Foundation (501c3)</p>
              <p>Backed by IGLTA partnership</p>
              <p>Advisory board: Former State Dept LGBTQ+ envoys</p>
              <p>Trusted by Fortune 100 CHROs</p>
            </div>
          </motion.div>
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
          <div className="glass-panel rounded-xl p-6 border border-white/10">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 text-center"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Protect Your People. Prove Diligence.
            </h2>
            <p className="text-gray-400 mb-8">
              Book a 30-minute demo to see Safety Intelligence assess your company's current travel policy.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
                data-testid="input-name"
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10"
                data-testid="input-email"
              />
              <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-white/5 border-white/10"
                data-testid="input-company"
              />
              <Input
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-white/5 border-white/10"
                data-testid="input-role"
              />
            </div>
            <Input
              placeholder="# of Employees"
              value={formData.employees}
              onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              className="bg-white/5 border-white/10 mb-6"
              data-testid="input-employees"
            />

            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 text-lg" data-testid="button-submit-demo">
              Get Custom Risk Assessment
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Demo includes: Risk assessment of top 10 destinations • Sample danger alerts • ROI calculator
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <a href="https://iglta.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">IGLTA Partnership</a>
            <a href="mailto:safety@vectorforgood.com" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" /> safety@vectorforgood.com
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-cyan-400 font-medium mb-4">
            <Phone className="w-4 h-4" />
            <span>Emergency Hotline: 1-800-SAFE-QI (24/7)</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Vector for Good PBC. Safety Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
