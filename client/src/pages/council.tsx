import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, Shield, Eye, Users, Scale, Cpu, Mic, Search, Lightbulb, Play, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import alanTuringImg from "@assets/alan_turing.jpg";
import lynnConwayImg from "@assets/lynn_conway_wiki.jpg";
import bayardRustinImg from "@assets/bayard_rustin.jpg";
import sylviaRiveraImg from "@assets/sylvia_rivera_wiki.jpg";
import elizebethFriedmanImg from "@assets/elizebeth_friedman_wiki.jpg";
import claudetteColvinImg from "@assets/claudette_colvin_wiki.jpg";
import audreLordeImg from "@assets/audre_lorde_large.jpg";
import templeGrandinImg from "@assets/temple_grandin.jpg";
import councilChamberImg from "@assets/Gemini_Generated_Image_h7o9svh7o9svh7o9_1767473865791.png";

interface Agent {
  id: string;
  name: string;
  namesake: string;
  years: string;
  role: string;
  specialization: string;
  quote: string;
  bio: string;
  icon: LucideIcon;
  color: string;
  image: string;
  hasVeto?: boolean;
}

const agents: Agent[] = [
  {
    id: "alan",
    name: "ALAN",
    namesake: "Alan Turing",
    years: "1912-1954",
    role: "Cultural Codebreaker",
    specialization: "VETO POWER - Coded Threat Detection",
    quote: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    bio: "The father of computer science who broke Nazi codes at Bletchley Park, shortening WWII by years and saving millions of lives. Prosecuted by the British government for being gay, chemically castrated, and driven to suicide at 41. Alan holds veto power in our council because we will never again let brilliant minds be destroyed by the systems they save. When Alan detects coded threats—dog whistles, surveillance disguised as safety, policies that target identities—his BLOCK overrides everything.",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    image: alanTuringImg,
    hasVeto: true,
  },
  {
    id: "temple",
    name: "TEMPLE",
    namesake: "Temple Grandin",
    years: "1947-present",
    role: "Pattern Recognizer",
    specialization: "What If Analysis & Edge Cases",
    quote: "The world needs all kinds of minds.",
    bio: "Autistic scientist who revolutionized livestock handling by seeing the world differently. Rejected by neurotypical gatekeepers, she persisted and became one of the most influential animal behaviorists alive. Temple explores 'What If' scenarios—the edge cases, the unintended consequences, the perspectives that don't fit standard models. She asks: 'What if we're wrong? What does this look like from an entirely different angle?'",
    icon: Lightbulb,
    color: "from-amber-500 to-yellow-500",
    image: templeGrandinImg,
  },
  {
    id: "claudette",
    name: "CLAUDETTE",
    namesake: "Claudette Colvin",
    years: "1939-present",
    role: "Erasure Detector",
    specialization: "Voice Amplification & Visibility",
    quote: "When it comes to justice, there is no easy way to get it.",
    bio: "At 15, she refused to give up her bus seat in Montgomery, Alabama—NINE MONTHS before Rosa Parks. But civil rights leaders decided she wasn't the 'right image' because she was pregnant, dark-skinned, and working-class. Her act of resistance was erased from history. Claudette detects when marginalized voices are being erased, sanitized, or deemed 'not the right messenger.'",
    icon: Mic,
    color: "from-pink-500 to-rose-500",
    image: claudetteColvinImg,
  },
  {
    id: "audre",
    name: "AUDRE",
    namesake: "Audre Lorde",
    years: "1934-1992",
    role: "Intersectional Analyst",
    specialization: "Compound Harm Detection",
    quote: "The master's tools will never dismantle the master's house.",
    bio: "Black lesbian feminist warrior poet who refused to separate her identities or her struggles. While white feminists talked about gender and Black activists talked about race, Audre insisted we examine where these systems intersect and compound. Audre performs intersectional analysis—identifying how policies that seem neutral on one axis create compounding harm when identities overlap.",
    icon: Users,
    color: "from-purple-500 to-violet-500",
    image: audreLordeImg,
  },
  {
    id: "lynn",
    name: "LYNN",
    namesake: "Lynn Conway",
    years: "1938-present",
    role: "Architect of Second Chances",
    specialization: "Technical Architecture & System Design",
    quote: "How long can a system built on lies sustain itself?",
    bio: "Trans woman who made foundational contributions to computer chip design (VLSI). Fired from IBM in 1968 for transitioning, she rebuilt her career in secret and became a legend—only publicly coming out in 1999 at age 61. Lynn handles technical architecture and system design, advocating for policies that give people second chances—systems that don't punish people for transitioning, coming out, or leaving abusive situations.",
    icon: Cpu,
    color: "from-cyan-500 to-blue-500",
    image: lynnConwayImg,
  },
  {
    id: "bayard",
    name: "BAYARD",
    namesake: "Bayard Rustin",
    years: "1912-1987",
    role: "Strategic Coordinator",
    specialization: "Coalition Building & Strategy",
    quote: "We need, in every community, a group of angelic troublemakers.",
    bio: "Gay Black Quaker who was the chief architect of the 1963 March on Washington. He taught MLK about nonviolence, organized the logistics of the largest demonstration in US history, but was pushed into the shadows because white allies and Black leaders feared his homosexuality would 'hurt the movement.' Bayard handles strategic coordination and coalition-building, identifying when competing interests can find common ground.",
    icon: Scale,
    color: "from-emerald-500 to-green-500",
    image: bayardRustinImg,
  },
  {
    id: "sylvia",
    name: "SYLVIA",
    namesake: "Sylvia Rivera",
    years: "1951-2002",
    role: "Street-Level Sentinel",
    specialization: "Ground-Level Harm Detection",
    quote: "We have to be visible. We should not be ashamed of who we are.",
    bio: "Trans Latina who fought at Stonewall and spent her life protecting homeless trans youth. Booed off the stage at a 1973 pride rally for demanding the movement prioritize trans people and sex workers. Died in poverty after a lifetime of service. Sylvia performs street-level harm detection. She asks: 'What does this policy do to the homeless? To sex workers? To undocumented people?'",
    icon: Eye,
    color: "from-fuchsia-500 to-pink-500",
    image: sylviaRiveraImg,
  },
  {
    id: "elizebeth",
    name: "ELIZEBETH",
    namesake: "Elizebeth Friedman",
    years: "1892-1980",
    role: "Signal Intelligence Expert",
    specialization: "Pattern Recognition & Surveillance Detection",
    quote: "Anything that can be done by one person can be done by another.",
    bio: "America's first female cryptanalyst who broke codes for the Coast Guard, took down smuggling rings, and laid groundwork for the NSA. Her work was classified for decades and often attributed to her husband or the FBI. Elizebeth specializes in signal intelligence and pattern recognition—detecting surveillance, hidden agendas, and coded language in policy documents.",
    icon: Search,
    color: "from-indigo-500 to-purple-500",
    image: elizebethFriedmanImg,
  },
];

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = agent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div
        className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${
          agent.hasVeto
            ? "border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        {agent.hasVeto && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        )}

        <div className="p-6">
          {/* Large Portrait */}
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-40 h-40 rounded-full bg-gradient-to-br ${agent.color} p-1.5 ${agent.hasVeto ? 'animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]' : ''}`}
            >
              <img 
                src={agent.image} 
                alt={agent.namesake}
                className="w-full h-full rounded-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>

          {/* Name and Info */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-2xl font-display font-bold text-white">
                {agent.name}
              </h3>
              {agent.hasVeto && (
                <motion.span 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-2 py-0.5 text-xs font-mono bg-red-500/30 text-red-300 rounded border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  VETO POWER
                </motion.span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Named after{" "}
              <span className="text-white font-medium">{agent.namesake}</span>
              <span className="text-gray-500 ml-1">({agent.years})</span>
            </p>
          </div>

          <div className="mb-4 text-center">
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-mono bg-gradient-to-r ${agent.color} bg-opacity-10 text-white/90 border border-white/10`}
            >
              {agent.role}
            </div>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5"
          >
            <p className="text-sm text-gray-400 font-mono">
              <span className="text-violet-300 font-semibold">SPECIALIZATION:</span>{" "}
              {agent.specialization}
            </p>
          </motion.div>

          <blockquote className="text-gray-300 italic text-sm border-l-2 border-violet-400/60 pl-4 mb-4">
            "{agent.quote}"
          </blockquote>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {agent.bio}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-violet-300 hover:text-violet-200 transition-colors font-medium"
            data-testid={`button-expand-${agent.id}`}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Learn More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Council() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-display font-bold text-white tracking-tighter"
            data-testid="link-home"
          >
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              data-testid="link-back"
            >
              <ArrowLeft className="w-4 h-4" /> Back
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
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-all border border-white/10"
                data-testid="link-login"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={councilChamberImg} 
            alt="Council Chamber" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[96px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30 mb-6 font-mono text-sm font-medium">
              LIBERATION TECHNOLOGY
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white leading-tight">
              The Council of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Liberation Pioneers
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light mb-8">
              Every AI agent in our council is named after someone who was
              marginalized, silenced, or erased from history despite making
              world-changing contributions. These weren't just heroes—they were
              codebreakers in every sense.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-8 mb-16 border border-primary/20"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Why Names Matter
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              When mainstream AI is trained on datasets that erase marginalized
              voices, we choose differently. We name our agents after people
              who:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Fought when fighting meant losing everything",
                "Built systems while being excluded from systems",
                "Saw patterns others couldn't see",
                "Protected the vulnerable when no one else would",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-gray-300 bg-white/5 rounded-lg p-3"
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 mt-6 text-sm italic">
              This isn't nostalgia. It's inheritance. Each agent carries forward
              the methodology, the courage, and the vision of their namesake.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {agents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-secondary/20 text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              The Promise
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              These aren't mascots. They're methodologies. When our agents
              analyze your policies, they bring the perspective of people who
              lived the consequences of unjust systems.
            </p>
            <div className="inline-block p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-white/10">
              <p className="text-xl text-white font-medium">
                <span className="text-violet-300 font-semibold">Sovereign Qi</span> exists
                because these people shouldn't have had to fight alone.
              </p>
              <p className="text-secondary mt-2 font-bold">
                Our council ensures no one does.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 text-center"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              See the Council in Action
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Watch all 8 agents deliberate on a real-world case: LGBTQ+ employee travel safety.
              See how each agent analyzes from their unique perspective, challenges each other's blind spots,
              and synthesizes a unified policy no single agent could produce alone.
            </p>
            <Link href="/demo" data-testid="link-demo">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 py-3 text-lg">
                <Play className="w-5 h-5" /> Watch Live Case Hearing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Photo Attribution */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-display font-bold text-white mb-4 text-center">
              Photo Attribution & Sources
            </h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              All Liberation Pioneer portraits are public domain or Creative Commons licensed from the following archives:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={alanTuringImg} alt="Alan Turing" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Alan Turing</span>
                <br />NPL/UK Archives
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={bayardRustinImg} alt="Bayard Rustin" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Bayard Rustin</span>
                <br />Library of Congress
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={claudetteColvinImg} alt="Claudette Colvin" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Claudette Colvin</span>
                <br />Wikimedia Commons
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={audreLordeImg} alt="Audre Lorde" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Audre Lorde</span>
                <br />Library of Congress
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={lynnConwayImg} alt="Lynn Conway" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Lynn Conway</span>
                <br />CC BY-SA 2.5
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={sylviaRiveraImg} alt="Sylvia Rivera" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Sylvia Rivera</span>
                <br />Wikimedia Commons
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={elizebethFriedmanImg} alt="Elizebeth Friedman" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Elizebeth Friedman</span>
                <br />NSA Archives (PD)
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden border border-white/10">
                  <img src={templeGrandinImg} alt="Temple Grandin" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-400">Temple Grandin</span>
                <br />CSU Archives
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2025 Sovereign Qi. Liberation-Grade AI.</p>
      </footer>
    </div>
  );
}
