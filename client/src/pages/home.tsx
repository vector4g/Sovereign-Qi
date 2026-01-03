import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, Shield, Globe, Cpu, Users, CheckCircle2, 
  Play, Calendar, Building2, Heart, Scale, FileCheck,
  Zap, Lock, Eye, TrendingUp, AlertTriangle
} from "lucide-react";
import heroBg from "@assets/Gemini_Generated_Image_ikjberikjberikjb_1767472048932.png";
import vectorLogo from "@assets/vector-logo_1767470093417.png";
import sovereignQiLogo from "@assets/Gemini_Generated_Image_jny8c8jny8c8jny8_(1)_1767470665497.png";
import safetyIntelLogo from "@assets/Gemini_Generated_Image_p2bm07p2bm07p2bm_1767471242892.png";
import esgComplianceLogo from "@assets/Gemini_Generated_Image_71m3f271m3f271m3_1767471538654.png";
import legalComplianceImg from "@assets/Gemini_Generated_Image_98mppl98mppl98mp_1767472748138.png";
import peopleDeiImg from "@assets/Gemini_Generated_Image_l2i3aul2i3aul2i3_1767472748139.png";
import cityMunicipalImg from "@assets/Gemini_Generated_Image_hryekmhryekmhrye_1767472748138.png";
import councilChamberImg from "@assets/Gemini_Generated_Image_h7o9svh7o9svh7o9_1767473865791.png";
import brokenGridImg from "@assets/Gemini_Generated_Image_m8yh53m8yh53m8yh_1767474175691.png";
import businessCaseImg from "@assets/Gemini_Generated_Image_2pxxvc2pxxvc2pxx_1767475383937.png";
import alanTuringImg from "@assets/alan_turing.jpg";
import lynnConwayImg from "@assets/lynn_conway.jpg";
import bayardRustinImg from "@assets/bayard_rustin.jpg";
import sylviaRiveraImg from "@assets/sylvia_rivera.jpg";
import elizebethFriedmanImg from "@assets/elizebeth_friedman.jpg";
import claudetteColvinImg from "@assets/claudette_colvin.jpg";
import audreLordeImg from "@assets/audre_lorde.jpg";
import templeGrandinImg from "@assets/temple_grandin.jpg";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="https://vectorforgood.com" target="_blank" rel="noopener noreferrer">
              <img src={vectorLogo} alt="Vector for Good" className="h-10 w-auto" />
            </a>
            <span className="text-xs text-gray-500 border-l border-white/20 pl-3 hidden md:block">Liberation-Grade AI</span>
          </div>
          <div className="flex gap-4 items-center">
            <a 
              href="#products"
              className="text-gray-400 hover:text-white transition-colors font-medium hidden md:block"
              data-testid="link-products"
            >
              Products
            </a>
            <Link 
              href="/simulation"
              className="text-gray-400 hover:text-white transition-colors font-medium hidden md:block"
              data-testid="link-simulation"
            >
              Demo
            </Link>
            <Link 
              href="/council"
              className="text-gray-400 hover:text-white transition-colors font-medium hidden md:block"
              data-testid="link-council"
            >
              The Council
            </Link>
            {user ? (
              <Link 
                href="/dashboard"
                className="bg-primary/90 hover:bg-primary text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                data-testid="link-dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="bg-white text-black px-6 py-2 rounded-full font-medium transition-all hover:bg-gray-100"
                data-testid="link-login"
              >
                Request Demo
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} className="w-full h-full object-cover" alt="8-Agent Council Visualization" />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/40 border border-primary/60 mb-10 backdrop-blur-md shadow-lg">
              <span className="text-white text-sm font-semibold tracking-wide">Trusted by Fortune 100 Legal & Compliance Teams</span>
            </div>
            
            <h1 className="font-display font-bold mb-4 text-white leading-none">
              <span className="block text-5xl md:text-6xl lg:text-7xl mb-2">Test Your Policies</span>
              <span className="block text-6xl md:text-8xl lg:text-[120px] text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">Before Your People Pay</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light mb-12 mt-8">
              Simulate governance decisions on digital twins. Get AI council deliberation from 8 perspectives. 
              Prove you did diligence—<span className="text-white font-medium">before the deposition.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href={user ? "/dashboard" : "/login"} data-testid="cta-demo">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-7 rounded-full font-bold gap-2 shadow-lg">
                  <Calendar className="w-5 h-5" /> Book a Demo
                </Button>
              </Link>
              <Link href="/simulation" data-testid="cta-watch">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-7 rounded-full font-bold gap-2 backdrop-blur-sm">
                  <Play className="w-5 h-5" /> Watch It Work
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>EU AI Act Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Public Benefit Corporation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${brokenGridImg})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
              Your Current Governance Process Is <span className="text-red-400">Broken</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              You make policy decisions based on majority logic—optimizing for averages, hoping nothing breaks. 
              But averages erase edge cases. And when something breaks, it's not the C-suite that suffers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                stat: "75%",
                label: "of DEI failures",
                desc: "happen because policies were tested on paper, not on the people they affect"
              },
              {
                icon: Eye,
                stat: "Single POV",
                label: "creates blind spots",
                desc: "Legal sees liability. HR sees compliance. Nobody sees the trans employee who can't use the bathroom."
              },
              {
                icon: Scale,
                stat: "$2.4M",
                label: "average settlement",
                desc: "for duty of care failures you could have prevented with simulation"
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-xl border border-red-500/30 bg-black/60 backdrop-blur-sm">
                <item.icon className="w-8 h-8 text-red-400 mb-4" />
                <div className="text-3xl font-display font-bold text-white mb-1">{item.stat}</div>
                <div className="text-red-400 font-medium mb-3">{item.label}</div>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-background border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-6 font-mono text-sm">
              PRODUCT SUITE
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Three Products. One Mission.
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Protect the people your policies affect most.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sovereign QI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent group hover:border-primary/50 transition-all"
            >
              <div className="p-8">
                <div className="w-20 h-20 mb-6">
                  <img src={sovereignQiLogo} alt="Sovereign QI" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs font-mono text-primary mb-2">FLAGSHIP PRODUCT</div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Sovereign QI</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  AI governance simulation and 8-agent council deliberation. Test policies on digital twins before deploying on real humans.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "NVIDIA Omniverse digital twins",
                    "8-agent Liberation Pioneer Council",
                    "Alan's VETO power for vulnerable communities",
                    "Majority vs Qi Logic A/B testing",
                    "Full audit trail for compliance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/simulation" data-testid="link-sovereign-qi">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                    See Demo <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Safety Intelligence Platform */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden border border-secondary/30 bg-gradient-to-b from-secondary/10 to-transparent group hover:border-secondary/50 transition-all"
            >
              <div className="p-8">
                <div className="w-20 h-20 mb-6">
                  <img src={safetyIntelLogo} alt="Safety Intelligence" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs font-mono text-secondary mb-2">TRAVEL & SAFETY</div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Safety Intelligence</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Real-time LGBTQ+ travel safety data covering 195 countries. Know which destinations are safe before your employees travel.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Real-time risk scores by destination",
                    "Hotel & venue safety ratings",
                    "Legal landscape monitoring",
                    "Travel booking integration",
                    "Proactive danger alerts"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={user ? "/dashboard" : "/login"} data-testid="link-safety-intel">
                  <Button variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10 gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ESG Compliance Suite */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl overflow-hidden border border-green-500/30 bg-gradient-to-b from-green-500/10 to-transparent group hover:border-green-500/50 transition-all"
            >
              <div className="p-8">
                <div className="w-20 h-20 mb-6">
                  <img src={esgComplianceLogo} alt="ESG Compliance" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs font-mono text-green-400 mb-2">COMPLIANCE</div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">ESG Compliance</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Prove you did diligence. Documentation, audit trails, and compliance reporting for EU AI Act, GDPR, and duty of care.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Data Protection Impact Assessments",
                    "EU AI Act documentation",
                    "Governance decision audit logs",
                    "Exportable compliance reports",
                    "Investor-ready ESG metrics"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={user ? "/dashboard" : "/login"} data-testid="link-esg-compliance">
                  <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Council - Liberation Pioneers */}
      <section className="py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-mono text-sm">
              8-AGENT DELIBERATION
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              The Council of <span className="text-primary">Liberation Pioneers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Every agent is named after someone marginalized yet world-changing. They bring perspectives 
              single decision-makers miss—and Alan holds <span className="text-red-400 font-bold">VETO power</span> to protect vulnerable communities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { 
                name: "Alan", 
                fullName: "Alan Turing",
                role: "Cultural Codebreaker", 
                power: "VETO",
                color: "from-purple-500 to-violet-600",
                borderColor: "border-purple-500",
                image: alanTuringImg,
                bio: "Gay mathematician who cracked Enigma. Chemically castrated for his sexuality.",
                years: "1912–1954"
              },
              { 
                name: "Lynn", 
                fullName: "Lynn Conway",
                role: "Technical Architecture", 
                power: null,
                color: "from-blue-400 to-cyan-500",
                borderColor: "border-blue-400",
                image: lynnConwayImg,
                bio: "Trans computer scientist fired from IBM in 1968. Revolutionized chip design.",
                years: "1938–2024"
              },
              { 
                name: "Bayard", 
                fullName: "Bayard Rustin",
                role: "Strategic Coordination", 
                power: null,
                color: "from-orange-400 to-amber-500",
                borderColor: "border-orange-400",
                image: bayardRustinImg,
                bio: "Gay architect of the 1963 March on Washington. Erased due to his sexuality.",
                years: "1912–1987"
              },
              { 
                name: "Sylvia", 
                fullName: "Sylvia Rivera",
                role: "Street-Level Harm", 
                power: null,
                color: "from-red-400 to-pink-500",
                borderColor: "border-red-400",
                image: sylviaRiveraImg,
                bio: "Trans Latina at Stonewall. Co-founded STAR for homeless trans youth.",
                years: "1951–2002"
              },
              { 
                name: "Elizebeth", 
                fullName: "Elizebeth Friedman",
                role: "Signal Intelligence", 
                power: null,
                color: "from-green-400 to-emerald-500",
                borderColor: "border-green-400",
                image: elizebethFriedmanImg,
                bio: "America's first female cryptanalyst. Overshadowed by her husband.",
                years: "1892–1980"
              },
              { 
                name: "Claudette", 
                fullName: "Claudette Colvin",
                role: "Erasure Detection", 
                power: null,
                color: "from-yellow-400 to-orange-400",
                borderColor: "border-yellow-400",
                image: claudetteColvinImg,
                bio: "Refused her bus seat 9 months before Rosa Parks. Deemed 'not the right image.'",
                years: "b. 1939"
              },
              { 
                name: "Audre", 
                fullName: "Audre Lorde",
                role: "Intersectional Analysis", 
                power: null,
                color: "from-pink-400 to-rose-500",
                borderColor: "border-pink-400",
                image: audreLordeImg,
                bio: "Black lesbian feminist poet. 'The master's tools will never dismantle the master's house.'",
                years: "1934–1992"
              },
              { 
                name: "Temple", 
                fullName: "Temple Grandin",
                role: "Edge Case Specialist", 
                power: null,
                color: "from-cyan-400 to-teal-500",
                borderColor: "border-cyan-400",
                image: templeGrandinImg,
                bio: "Autistic scientist who sees what neurotypical designers miss.",
                years: "b. 1947"
              }
            ].map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group relative glass-panel rounded-xl overflow-hidden border ${agent.borderColor}/30 hover:${agent.borderColor} transition-all hover:shadow-lg`}
                style={{ boxShadow: agent.power ? '0 0 20px rgba(168, 85, 247, 0.3)' : undefined }}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 ring-2 ring-offset-2 ring-offset-black ${agent.borderColor}`}>
                    <img 
                      src={agent.image} 
                      alt={agent.fullName}
                      className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-20 group-hover:opacity-0 transition-opacity`} />
                  </div>
                  {agent.power && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                      {agent.power}
                    </span>
                  )}
                  <h3 className={`text-lg font-bold bg-gradient-to-r ${agent.color} bg-clip-text text-transparent`}>
                    {agent.name}
                  </h3>
                  <div className="text-xs text-gray-400 font-medium mb-1">{agent.role}</div>
                  <p className="text-[10px] text-gray-500 leading-tight hidden md:block">{agent.bio}</p>
                  <div className="text-[9px] text-gray-600 mt-1">{agent.years}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/council" data-testid="link-meet-council">
              <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                <Users className="w-4 h-4" /> Meet the Full Council
              </Button>
            </Link>
            <p className="text-xs text-gray-600 mt-4">
              Photos: Public domain via Wikimedia Commons, Library of Congress, and institutional archives
            </p>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessCaseImg})` }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,20,0.4) 0%, rgba(0,0,20,0.7) 100%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              The Business Case
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              Reduce risk. Increase innovation. Prove compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { metric: "90%", label: "Faster Policy Testing", desc: "Weeks instead of months" },
              { metric: "8x", label: "More Perspectives", desc: "Multi-agent vs single POV" },
              { metric: "100%", label: "Audit Trail Coverage", desc: "Every decision documented" },
              { metric: "$0", label: "Real Human Risk", desc: "All testing on digital twins" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
              >
                <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2" style={{ textShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
                  {item.metric}
                </div>
                <div className="text-white font-bold mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{item.label}</div>
                <div className="text-gray-300 text-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Built for Enterprise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Serving the teams that protect people at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Scale,
                title: "Legal & Compliance",
                roles: ["General Counsel", "Chief Compliance Officer", "Risk Management"],
                benefit: "Prove diligence before litigation",
                image: legalComplianceImg,
                tintClass: "bg-purple-500/10"
              },
              {
                icon: Heart,
                title: "People & DEI",
                roles: ["Chief Diversity Officer", "HR Leadership", "Employee Experience"],
                benefit: "Build DEI that's real, not theater",
                image: peopleDeiImg,
                tintClass: "bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
              },
              {
                icon: Building2,
                title: "City & Municipal",
                roles: ["CTO/CIO", "Policy Teams", "Public Safety"],
                benefit: "Civic tech that earns trust",
                image: cityMunicipalImg,
                tintClass: "bg-cyan-500/10"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="relative rounded-xl border border-white/10 hover:border-primary/30 transition-all overflow-hidden group min-h-[500px]"
              >
                <div 
                  className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})`, backgroundPosition: 'center top' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.7) 100%)' }} />
                <div className={`absolute inset-0 ${item.tintClass}`} />
                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <item.icon 
                        className="w-8 h-8 text-primary flex-shrink-0" 
                        style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} 
                      />
                      <h3 
                        className="text-lg font-bold text-white" 
                        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs">
                      {item.roles.map((role, j) => (
                        <span 
                          key={j} 
                          className="font-medium" 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            textShadow: '0 0 16px rgba(139, 92, 246, 0.5), 0 1px 6px rgba(0,0,0,0.9)' 
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <div 
                      className="text-cyan-400 font-semibold text-xs" 
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}
                    >
                      {item.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 border-t border-primary/20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${councilChamberImg})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 border border-primary/50 mb-8 backdrop-blur-sm">
            <span className="text-white text-sm font-semibold">🎯 8-Agent Liberation Pioneer Council</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Ready to Govern Without Guessing?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            Book a demo to see Sovereign QI deliberate on a real governance scenario. 
            Watch 8 agents find the blind spots you didn't know you had.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/dashboard" : "/login"} data-testid="cta-bottom-demo">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-bold gap-2 shadow-lg">
                <Calendar className="w-5 h-5" /> Book a Demo
              </Button>
            </Link>
            <a href="https://vectorforgood.com/contact" target="_blank" rel="noopener noreferrer" data-testid="cta-contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 rounded-full font-bold backdrop-blur-sm">
                Contact Sales
              </Button>
            </a>
          </div>
          <p className="text-gray-300 text-sm mt-8" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Enterprise pricing. Custom pilots. White-glove onboarding.
          </p>
          <p className="text-primary text-sm mt-2">
            <a href="https://vectorforgood.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              vectorforgood.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <a href="https://vectorforgood.com" target="_blank" rel="noopener noreferrer" className="block mb-3">
                <img src={vectorLogo} alt="Vector for Good" className="h-12 w-auto" />
              </a>
              <p className="text-gray-500 text-sm">Public Benefit Corporation | Liberation-Grade AI</p>
              <a href="https://vectorforgood.com" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                vectorforgood.com
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-gray-500 items-center">
              <div className="flex gap-6">
                <Link href="/council" className="hover:text-white transition-colors">The Council</Link>
                <Link href="/simulation" className="hover:text-white transition-colors">Demo</Link>
                <a href="https://vectorforgood.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a>
              </div>
              <div className="flex gap-4 text-xs">
                <a href="https://vectorforgood.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy</a>
                <a href="https://vectorforgood.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Vector for Good PBC. Simulation Before Legislation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
