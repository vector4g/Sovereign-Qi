import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, Loader2, AlertTriangle, CheckCircle2, 
  XCircle, ChevronDown, ChevronUp, Users, Shield, 
  Cpu, Scale, Eye, Mic, Search, Lightbulb, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

interface InitialBrief {
  agent: string;
  pioneerName: string;
  observations: string[];
  recommendations: string[];
  urgencyLevel: string;
  confidenceLevel: number;
  latencyMs: number;
}

interface CrossCritique {
  agent: string;
  pioneerName: string;
  agreementWith: { agent: string; point: string };
  blindSpotFlag: { agent: string; concern: string };
  gapAddress: string;
  latencyMs: number;
}

interface Synthesis {
  identifiedConflicts: Array<{ between: string[]; nature: string }>;
  tradeOffs: Array<{ weAccept: string; weForgo: string; rationale: string }>;
  unifiedPolicy: {
    immediateActions: string[];
    shortTermChanges: string[];
    longTermReforms: string[];
    attributions: Array<{ decision: string; sourceAgent: string; contribution: string }>;
  };
  overruledObjections: Array<{ from: string; objection: string; reason: string }>;
  finalStatus: "APPROVE" | "REVISE" | "BLOCK";
  latencyMs: number;
}

interface Reflection {
  singleAgentCounterfactuals: Array<{ agent: string; hypotheticalOutcome: string; problem: string }>;
  collectiveAdvantage: string;
  keyInsight: string;
  latencyMs: number;
}

interface DemoResult {
  scenario: {
    title: string;
    description: string;
    embeddedTensions: string[];
    caseFile: {
      incident: string;
      context: string;
      stakeholders: string[];
      urgency: string;
    };
  };
  phases: {
    initialBriefs: InitialBrief[];
    crossCritiques: CrossCritique[];
    synthesis: Synthesis;
    reflection: Reflection;
  };
  totalLatencyMs: number;
}

const agentIcons: Record<string, any> = {
  alan: Shield,
  lynn: Cpu,
  bayard: Scale,
  sylvia: Eye,
  elizebeth: Search,
  claudette: Mic,
  audre: Users,
  temple: Lightbulb,
};

const agentColors: Record<string, string> = {
  alan: "from-red-500 to-orange-500",
  lynn: "from-cyan-500 to-blue-500",
  bayard: "from-emerald-500 to-green-500",
  sylvia: "from-fuchsia-500 to-pink-500",
  elizebeth: "from-indigo-500 to-purple-500",
  claudette: "from-pink-500 to-rose-500",
  audre: "from-purple-500 to-violet-500",
  temple: "from-amber-500 to-yellow-500",
};

function AgentBadge({ agent, pioneerName }: { agent: string; pioneerName: string }) {
  const Icon = agentIcons[agent] || Users;
  const color = agentColors[agent] || "from-gray-500 to-gray-600";
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} p-0.5`}>
        <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div>
        <div className="font-bold text-white text-sm">{agent.toUpperCase()}</div>
        <div className="text-xs text-gray-500">{pioneerName}</div>
      </div>
    </div>
  );
}

function PhaseCard({ title, phase, isActive, children }: { 
  title: string; 
  phase: number; 
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: phase * 0.2 }}
      className={`glass-panel rounded-xl border ${isActive ? 'border-primary/50' : 'border-white/10'} overflow-hidden`}
    >
      <div className={`px-4 py-3 border-b ${isActive ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/5'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isActive ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'
          }`}>
            {phase}
          </div>
          <h3 className="font-display font-bold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
}

function BriefCard({ brief }: { brief: InitialBrief }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <AgentBadge agent={brief.agent} pioneerName={brief.pioneerName} />
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-mono ${
            brief.urgencyLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
            brief.urgencyLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {brief.urgencyLevel.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">{brief.confidenceLevel}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="text-xs text-primary font-mono mb-1">OBSERVATIONS:</div>
          <ul className="text-sm text-gray-300 space-y-1">
            {brief.observations.slice(0, expanded ? undefined : 2).map((obs, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs text-secondary font-mono mb-1 mt-3">RECOMMENDATIONS:</div>
              <ul className="text-sm text-gray-300 space-y-1">
                {brief.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-secondary mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-gray-500 hover:text-white flex items-center gap-1"
        data-testid={`button-expand-brief-${brief.agent}`}
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

function CritiqueCard({ critique }: { critique: CrossCritique }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <AgentBadge agent={critique.agent} pioneerName={critique.pioneerName} />
      
      <div className="mt-3 space-y-3">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs text-green-400 font-mono">AGREES WITH {critique.agreementWith.agent.toUpperCase()}:</span>
            <p className="text-sm text-gray-300 mt-0.5">{critique.agreementWith.point}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs text-yellow-400 font-mono">FLAGS BLIND SPOT IN {critique.blindSpotFlag.agent.toUpperCase()}:</span>
            <p className="text-sm text-gray-300 mt-0.5">{critique.blindSpotFlag.concern}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs text-primary font-mono">GAP ADDRESSED:</span>
            <p className="text-sm text-gray-300 mt-0.5">{critique.gapAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const { user } = useAuth();
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  const runDemo = async (mode: "quick" | "full") => {
    setLoading(true);
    setError(null);
    setActivePhase(1);
    
    try {
      const response = await fetch(`/api/demo/deliberation?mode=${mode}`);
      if (!response.ok) throw new Error("Demo failed");
      const data = await response.json();
      setResult(data);
      setActivePhase(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tighter" data-testid="link-home">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/council" className="text-gray-400 hover:text-white transition-colors" data-testid="link-council">
              The Council
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" data-testid="link-back">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-4 font-mono text-sm">
              LIVE DEMONSTRATION
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Council Case <span className="text-primary">Hearing</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Watch the Liberation Pioneer Council deliberate on a complex travel safety case.
              Each agent analyzes from their unique perspective, then they challenge each other's blind spots
              before synthesizing a unified policy.
            </p>
          </motion.div>

          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-2xl p-8 border border-primary/20 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                The Case: LGBTQ+ Travel Safety Incident
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A Fortune 100 company sends employees to a country where queer relationships are criminalized.
                One openly queer employee was harassed outside their hotel, and local police demanded a bribe
                while making threatening comments. The employee is now safe but demands answers.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-bold text-white mb-2">Embedded Tensions</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Legal vs. lived risk</li>
                    <li>• Corporate liability vs. employee autonomy</li>
                    <li>• Short-term PR vs. long-term ESG</li>
                    <li>• Business necessity vs. safety</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-bold text-white mb-2">Why This Case?</h4>
                  <p className="text-sm text-gray-400">
                    No single agent can safely decide alone. The case requires safety intelligence,
                    legal analysis, DEI advocacy, and operational feasibility - all in tension.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => runDemo("quick")}
                  className="bg-white/10 hover:bg-white/20 text-white gap-2"
                  data-testid="button-quick-demo"
                >
                  <Zap className="w-4 h-4" /> Quick Demo (Instant)
                </Button>
                <Button
                  onClick={() => runDemo("full")}
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                  data-testid="button-full-demo"
                >
                  <Play className="w-4 h-4" /> Full AI Deliberation (30-60s)
                </Button>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-400">Council is deliberating...</p>
              <p className="text-sm text-gray-500 mt-2">8 agents analyzing the case in parallel</p>
            </motion.div>
          )}

          {error && (
            <div className="glass-panel rounded-xl p-6 border border-red-500/30 max-w-xl mx-auto text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
              <Button onClick={() => setError(null)} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white">
                  Deliberation Results
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Total time: {(result.totalLatencyMs / 1000).toFixed(1)}s
                  </span>
                  <Button
                    onClick={() => { setResult(null); setActivePhase(0); }}
                    variant="outline"
                    size="sm"
                    data-testid="button-reset-demo"
                  >
                    Reset Demo
                  </Button>
                </div>
              </div>

              <PhaseCard title="Initial Briefs" phase={1} isActive={activePhase >= 1}>
                <p className="text-sm text-gray-400 mb-4">
                  Each agent analyzes the case independently from their unique perspective.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.phases.initialBriefs.map((brief) => (
                    <BriefCard key={brief.agent} brief={brief} />
                  ))}
                </div>
              </PhaseCard>

              <PhaseCard title="Cross-Critique" phase={2} isActive={activePhase >= 2}>
                <p className="text-sm text-gray-400 mb-4">
                  Agents review each other's work, acknowledge agreements, and flag blind spots.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.phases.crossCritiques.map((critique) => (
                    <CritiqueCard key={critique.agent} critique={critique} />
                  ))}
                </div>
              </PhaseCard>

              <PhaseCard title="Council Synthesis" phase={3} isActive={activePhase >= 3}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Identified Conflicts
                    </h4>
                    <div className="space-y-2">
                      {result.phases.synthesis.identifiedConflicts.map((conflict, i) => (
                        <div key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="text-sm text-yellow-400 font-mono mb-1">
                            {conflict.between.map(a => a.toUpperCase()).join(" vs ")}
                          </div>
                          <p className="text-sm text-gray-300">{conflict.nature}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" />
                      Trade-offs Made
                    </h4>
                    <div className="space-y-3">
                      {result.phases.synthesis.tradeOffs.map((tradeoff, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <div>
                              <span className="text-xs text-green-400 font-mono">WE ACCEPT:</span>
                              <p className="text-sm text-gray-300">{tradeoff.weAccept}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 mb-2">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                              <span className="text-xs text-red-400 font-mono">WE FORGO:</span>
                              <p className="text-sm text-gray-300">{tradeoff.weForgo}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 italic mt-2">{tradeoff.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Unified Policy</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h5 className="text-red-400 font-mono text-xs mb-2">IMMEDIATE ACTIONS</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {result.phases.synthesis.unifiedPolicy.immediateActions.map((action, i) => (
                            <li key={i}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h5 className="text-yellow-400 font-mono text-xs mb-2">SHORT-TERM CHANGES</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {result.phases.synthesis.unifiedPolicy.shortTermChanges.map((change, i) => (
                            <li key={i}>• {change}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h5 className="text-green-400 font-mono text-xs mb-2">LONG-TERM REFORMS</h5>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {result.phases.synthesis.unifiedPolicy.longTermReforms.map((reform, i) => (
                            <li key={i}>• {reform}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-4">
                    <span className="text-gray-400">Final Status:</span>
                    <span className={`px-4 py-2 rounded-full font-bold ${
                      result.phases.synthesis.finalStatus === "APPROVE" ? "bg-green-500/20 text-green-400" :
                      result.phases.synthesis.finalStatus === "BLOCK" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {result.phases.synthesis.finalStatus}
                    </span>
                  </div>
                </div>
              </PhaseCard>

              <PhaseCard title="Reflection: Why Council Wins" phase={4} isActive={activePhase >= 4}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Single-Agent Counterfactuals</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      What would have happened if only ONE agent made the decision?
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {result.phases.reflection.singleAgentCounterfactuals.map((cf) => (
                        <div key={cf.agent} className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AgentBadge agent={cf.agent} pioneerName="" />
                          </div>
                          <p className="text-sm text-gray-300 mb-1">
                            <span className="text-primary">If only {cf.agent.toUpperCase()}:</span> {cf.hypotheticalOutcome}
                          </p>
                          <p className="text-xs text-red-400">
                            Problem: {cf.problem}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel rounded-xl p-6 border border-primary/30 bg-primary/5">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Collective Intelligence Advantage
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {result.phases.reflection.collectiveAdvantage}
                    </p>
                    <div className="mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <span className="text-secondary font-mono text-xs">KEY INSIGHT:</span>
                      <p className="text-white mt-1">{result.phases.reflection.keyInsight}</p>
                    </div>
                  </div>
                </div>
              </PhaseCard>
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 Sovereign Qi. Liberation-Grade AI.</p>
      </footer>
    </div>
  );
}
