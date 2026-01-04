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

const dangerStats = [
  { number: "71", label: "countries", desc: "Criminalize LGBTQ+ relationships", color: "text-red-400" },
  { number: "15", label: "countries", desc: "Death penalty for LGBTQ+ people", color: "text-red-600" },
  { number: "$12M", label: "average", desc: "Cost of duty of care failure lawsuit", color: "text-orange-400" },
];

const howItWorks = [
  {
    title: "Real-Time Risk Monitoring",
    icon: Radar,
    color: "cyan",
    items: [
      "ILGA (International Lesbian Gay Association)",
      "Human Rights Watch",
      "State Department travel advisories",
      "LGBTQ+ journalist networks",
      "Social media sentiment analysis",
    ],
    footer: "Updates every 6 hours • Instant alerts for law changes",
  },
  {
    title: "Comprehensive Safety Scores",
    icon: Shield,
    color: "green",
    items: [
      "Legal protections (marriage, employment, housing)",
      "Social acceptance (Pride events, visibility)",
      "Violence risk (hate crimes, police harassment)",
      "Healthcare access (HIV/PrEP, gender-affirming)",
      "Emergency resources (embassies, safe houses)",
    ],
    footer: "Granular by city, not just country-level",
  },
  {
    title: "Actionable Intelligence",
    icon: CheckCircle,
    color: "violet",
    items: [
      "Hotel & venue safety ratings (IGLTA-certified)",
      "Local LGBTQ+ resources and contacts",
      "Travel booking integration",
      "Automatic policy recommendations",
      "Ban travel to high-risk zones",
    ],
    footer: "Integrated with corporate travel tools",
  },
];

const features = [
  {
    title: "Destination Risk Profiles",
    icon: Globe,
    desc: "Interactive map showing 195 countries color-coded by safety. Click any country for legal landscape, recent incidents, and safe zones.",
    example: "Uganda - Risk Level: EXTREME - Travel banned for LGBTQ+ employees",
  },
  {
    title: "Hotel & Venue Certification",
    icon: Hotel,
    desc: "Vetted safe hotels with IGLTA partnerships. 'Rainbow Verified' badge system, staff training verification, private check-in for trans guests.",
    example: "Panic button integration for emergencies",
  },
  {
    title: "Proactive Danger Alerts",
    icon: Bell,
    desc: "Real-time push notifications for new laws, Pride attacks, police raids. Geofencing alerts when employees enter high-risk zones.",
    example: "Automatic trip cancellation triggers",
  },
  {
    title: "Legal Landscape Monitoring",
    icon: Scale,
    desc: "Track 195 countries' LGBTQ+ laws: criminalization, penalties, enforcement patterns, recent prosecutions.",
    example: "Quarterly compliance reports for legal teams",
  },
  {
    title: "Corporate Travel Integration",
    icon: Plug,
    desc: "API integrations with Concur, SAP, TripActions, Slack/Teams, HR systems. Automated approval workflows.",
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[96px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-violet-500 p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
            </div>
            <p className="text-sm uppercase tracking-wider text-cyan-400 font-mono mb-4">TRAVEL & SAFETY</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Safety Intelligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Real-time LGBTQ+ travel safety data covering 195 countries. 
              <span className="text-cyan-300 font-medium"> Protect your people before they board the plane.</span>
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
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Your Employees Are Traveling Into the Unknown
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {dangerStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-xl p-6 border border-red-500/20 text-center"
              >
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.number}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white mt-2">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-8 border border-white/10 text-center"
          >
            <p className="text-xl text-gray-300 italic mb-4">
              "We sent our employee to Uganda for a conference. Two weeks later, he was arrested. We had no idea."
            </p>
            <cite className="text-gray-500 text-sm">— Fortune 500 HR Director, 2024</cite>
          </motion.blockquote>
        </div>
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
