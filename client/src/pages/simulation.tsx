import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw, 
  Users, Shield, Zap, TrendingUp, Heart, AlertTriangle,
  Eye, Lock, CheckCircle2, XCircle, Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

type GovernanceMode = "majority" | "qi";

interface AgentState {
  id: string;
  role: string;
  label: string;
  stress: number;
  risk: number;
  access: boolean;
  position: { x: number; y: number };
}

interface Metrics {
  innovationVelocity: number;
  burnoutRate: number;
  liabilityExposure: number;
}

const initialAgents: AgentState[] = [
  { id: "1", role: "manager", label: "Manager", stress: 30, risk: 20, access: true, position: { x: 20, y: 30 } },
  { id: "2", role: "caseworker", label: "Case Worker", stress: 45, risk: 35, access: true, position: { x: 60, y: 25 } },
  { id: "3", role: "trans_patient", label: "Trans Patient", stress: 75, risk: 60, access: false, position: { x: 40, y: 55 } },
  { id: "4", role: "nd_student", label: "Neurodivergent Student", stress: 65, risk: 50, access: false, position: { x: 75, y: 60 } },
  { id: "5", role: "refugee", label: "Refugee Applicant", stress: 80, risk: 70, access: false, position: { x: 25, y: 70 } },
  { id: "6", role: "executive", label: "Executive", stress: 25, risk: 15, access: true, position: { x: 80, y: 35 } },
];

const majorityMetrics: Metrics = { innovationVelocity: 45, burnoutRate: 72, liabilityExposure: 68 };
const qiMetrics: Metrics = { innovationVelocity: 78, burnoutRate: 28, liabilityExposure: 22 };

const syntheticPersonas = [
  { id: "sp1", label: "Black Trans Woman in Healthcare", challenge: "Medical bias, identity disclosure risk", icon: Heart },
  { id: "sp2", label: "Autistic Student in School", challenge: "Sensory overload, communication barriers", icon: Eye },
  { id: "sp3", label: "Refugee Navigating Benefits", challenge: "Language barriers, documentation gaps", icon: Users },
  { id: "sp4", label: "Veteran with PTSD", challenge: "Trigger sensitivity, institutional distrust", icon: Shield },
  { id: "sp5", label: "Homeless Youth Seeking Services", challenge: "Address requirements, age verification", icon: AlertTriangle },
];

function MetricBar({ label, value, color, previousValue, higherIsBetter = false }: { 
  label: string; 
  value: number; 
  color: string; 
  previousValue?: number;
  higherIsBetter?: boolean;
}) {
  const valueIncreased = previousValue !== undefined && value > previousValue;
  const valueDecreased = previousValue !== undefined && value < previousValue;
  
  const improved = higherIsBetter ? valueIncreased : valueDecreased;
  const degraded = higherIsBetter ? valueDecreased : valueIncreased;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={`font-mono font-bold ${
          improved ? 'text-green-400' : degraded ? 'text-red-400' : 'text-white'
        }`}>
          {value}%
          {improved && <span className="ml-1 text-xs">{higherIsBetter ? '↑' : '↓'}</span>}
          {degraded && <span className="ml-1 text-xs">{higherIsBetter ? '↓' : '↑'}</span>}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function AgentNode({ agent, mode }: { agent: AgentState; mode: GovernanceMode }) {
  const qiAdjustedStress = mode === "qi" ? Math.max(10, agent.stress - 35) : agent.stress;
  const qiAdjustedRisk = mode === "qi" ? Math.max(5, agent.risk - 40) : agent.risk;
  const qiAccess = mode === "qi" ? true : agent.access;
  
  const stressColor = qiAdjustedStress > 60 ? "bg-red-500" : qiAdjustedStress > 40 ? "bg-yellow-500" : "bg-green-500";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.random() * 0.5 }}
      className="absolute group"
      style={{ left: `${agent.position.x}%`, top: `${agent.position.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
        qiAccess ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20'
      }`}>
        <Users className="w-5 h-5 text-white" />
      </div>
      
      <div className="absolute -top-2 -right-2">
        <div className={`w-3 h-3 rounded-full ${stressColor} animate-pulse`} />
      </div>
      
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-black/90 border border-white/20 rounded-lg p-3 text-xs whitespace-nowrap">
          <div className="font-bold text-white mb-2">{agent.label}</div>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Stress:</span>
              <span className={qiAdjustedStress > 60 ? 'text-red-400' : qiAdjustedStress > 40 ? 'text-yellow-400' : 'text-green-400'}>
                {qiAdjustedStress}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Risk:</span>
              <span className={qiAdjustedRisk > 50 ? 'text-red-400' : 'text-yellow-400'}>
                {qiAdjustedRisk}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Access:</span>
              <span className={qiAccess ? 'text-green-400' : 'text-red-400'}>
                {qiAccess ? 'GRANTED' : 'BLOCKED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ZKAccessDemo() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= 4) {
          setIsPlaying(false);
          return 4;
        }
        return s + 1;
      });
    }, 1200);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  const restart = () => {
    setStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Zero-Knowledge Access Demo
        </h4>
        <Button
          onClick={restart}
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid="button-restart-zk"
        >
          <RotateCcw className="w-4 h-4" /> {step === 0 ? "Start" : "Replay"}
        </Button>
      </div>

      <div className="relative h-40 bg-black/30 rounded-lg border border-white/10 overflow-hidden">
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ x: step >= 1 ? 180 : 0 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
          >
            <Users className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className={`w-20 h-32 rounded-lg border-2 transition-colors ${
            step >= 3 ? 'border-green-500 bg-green-500/10' : 'border-gray-500 bg-gray-500/10'
          }`}>
            <div className="w-full h-full flex items-center justify-center">
              {step >= 3 ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <Lock className="w-8 h-8 text-gray-500" />
              )}
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">SECURE DOOR</div>
        </div>
      </div>

      <div className="mt-6 space-y-3 font-mono text-sm">
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between py-2 border-b border-white/10"
            >
              <span className="text-gray-400">DOOR_QUERY:</span>
              <span className="text-secondary">HAS_VALID_ACCESS_TOKEN?</span>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between py-2 border-b border-white/10"
            >
              <span className="text-gray-400">WALLET_RESPONSE:</span>
              <span className="text-primary">PROOF_VALIDATED (True)</span>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between py-2 border-b border-white/10"
            >
              <span className="text-gray-400">ACCESS_GRANTED:</span>
              <span className="text-green-400">DOOR_UNLOCKED</span>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between py-2 bg-green-500/10 rounded px-2"
            >
              <span className="text-gray-400">IDENTITY_LOGGED:</span>
              <span className="text-gray-500">NULL (Anonymity Preserved)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Simulation() {
  const { user } = useAuth();
  const [mode, setMode] = useState<GovernanceMode>("majority");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedWeeks, setSimulatedWeeks] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const currentMetrics = mode === "qi" ? qiMetrics : majorityMetrics;
  const previousMetrics = mode === "qi" ? majorityMetrics : undefined;

  useEffect(() => {
    if (!isSimulating) return;
    
    const timer = setInterval(() => {
      setSimulatedWeeks(w => {
        if (w >= 52) {
          setIsSimulating(false);
          return 52;
        }
        return w + 4;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, [isSimulating]);

  const startSimulation = () => {
    setSimulatedWeeks(0);
    setIsSimulating(true);
  };

  const toggleMode = () => {
    setMode(m => m === "majority" ? "qi" : "majority");
    setSimulatedWeeks(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tighter" data-testid="link-home">
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/demo" className="text-gray-400 hover:text-white transition-colors" data-testid="link-demo">
              Council Demo
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
              NVIDIA OMNIVERSE + ISAAC SIM
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Digital Twin <span className="text-primary">Simulation</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We build a safe digital twin of power, simulate majority vs. Qi governance, 
              and never touch a real person's data.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-white">Social Digital Twin</h3>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-gray-500">MODE:</span>
                      <button
                        onClick={toggleMode}
                        className={`px-3 py-1 rounded-full transition-all ${
                          mode === "majority" 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                        data-testid="button-toggle-mode"
                      >
                        {mode === "majority" ? "MAJORITY LOGIC" : "QI LOGIC"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">WEEK {simulatedWeeks}/52</span>
                    <Button
                      onClick={startSimulation}
                      disabled={isSimulating}
                      size="sm"
                      className="gap-2"
                      data-testid="button-simulate"
                    >
                      {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isSimulating ? "Simulating..." : "Run Simulation"}
                    </Button>
                  </div>
                </div>

                <div className="relative h-80 bg-gradient-to-br from-gray-900 to-black">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                  </div>

                  <div className="absolute top-4 left-4 bg-black/50 rounded px-2 py-1 font-mono text-xs text-gray-500">
                    ISAAC_SIM:OFFICE_CHAMBER_v2.usd
                  </div>

                  {initialAgents.map(agent => (
                    <AgentNode key={agent.id} agent={agent} mode={mode} />
                  ))}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="flex gap-4 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-400">Low Stress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-gray-400">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-400">High Stress</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      HOVER AGENTS FOR DETAILS
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Shuffle className="w-5 h-5 text-secondary" />
                    Omniverse Replicator: Synthetic Personas
                  </h3>
                  <span className="text-xs text-gray-500 font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded">
                    NO REAL HUMANS IN DATASET
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  We generate statistical twins that face real-world barriers. These are <span className="text-primary">challenges, not identities</span>—training on the struggle.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {syntheticPersonas.map((persona, i) => (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-colors"
                    >
                      <persona.icon className="w-6 h-6 text-primary mb-2" />
                      <div className="font-medium text-white text-sm mb-1">{persona.label}</div>
                      <div className="text-xs text-gray-500">{persona.challenge}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <ZKAccessDemo />
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-xl p-6 border border-white/10 sticky top-24"
              >
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Governance Metrics
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500 font-mono">CURRENT MODE</div>
                      <div className={`font-bold ${mode === "qi" ? "text-green-400" : "text-red-400"}`}>
                        {mode === "majority" ? "MAJORITY LOGIC" : "QI LOGIC"}
                      </div>
                    </div>
                    <Button
                      onClick={toggleMode}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      data-testid="button-switch-logic"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Switch
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <MetricBar
                    label="Innovation Velocity"
                    value={currentMetrics.innovationVelocity}
                    color="bg-gradient-to-r from-green-500 to-emerald-500"
                    previousValue={previousMetrics?.innovationVelocity}
                    higherIsBetter={true}
                  />
                  <MetricBar
                    label="Burnout Rate"
                    value={currentMetrics.burnoutRate}
                    color={currentMetrics.burnoutRate > 50 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}
                    previousValue={previousMetrics?.burnoutRate}
                    higherIsBetter={false}
                  />
                  <MetricBar
                    label="Liability Exposure"
                    value={currentMetrics.liabilityExposure}
                    color={currentMetrics.liabilityExposure > 50 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}
                    previousValue={previousMetrics?.liabilityExposure}
                    higherIsBetter={false}
                  />
                </div>

                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-xs text-primary font-mono mb-2">SIMULATION INSIGHT</div>
                  <p className="text-sm text-gray-300">
                    {mode === "qi" 
                      ? "Qi Logic shows 73% improvement in innovation velocity while reducing burnout by 61% over simulated year."
                      : "Majority Logic optimizes for averages—edge cases hit friction, driving burnout and liability."}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center italic">
                    "This all happened in simulation, not on your staff or communities."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 glass-panel rounded-xl p-8 border border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5 text-center"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Ready to Connect Your Governance Rules?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              The next step is connecting your governance rules and risk thresholds into this digital twin.
              No experiments on live humans—just data-driven policy design.
            </p>
            <Link href={user ? "/dashboard" : "/login"} data-testid="link-get-started">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 py-3 text-lg">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 Sovereign Qi. Liberation-Grade AI.</p>
      </footer>
    </div>
  );
}
