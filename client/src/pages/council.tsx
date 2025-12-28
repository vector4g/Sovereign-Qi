import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, Shield, Eye, Users, Scale, Cpu, Mic, Search, Lightbulb, Play, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

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
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} p-0.5 flex-shrink-0`}
            >
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-display font-bold text-white">
                  {agent.name}
                </h3>
                {agent.hasVeto && (
                  <span className="px-2 py-0.5 text-xs font-mono bg-red-500/20 text-red-400 rounded border border-red-500/30">
                    VETO
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Named after{" "}
                <span className="text-white font-medium">{agent.namesake}</span>
                <span className="text-gray-500 ml-1">({agent.years})</span>
              </p>
            </div>
          </div>

          <div className="mb-4">
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
              <span className="text-primary">SPECIALIZATION:</span>{" "}
              {agent.specialization}
            </p>
          </motion.div>

          <blockquote className="text-gray-300 italic text-sm border-l-2 border-primary/50 pl-4 mb-4">
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
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
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
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[96px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-mono text-sm">
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
                <span className="text-primary">Sovereign Qi</span> exists
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

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2025 Sovereign Qi. Liberation-Grade AI.</p>
      </footer>
    </div>
  );
}
