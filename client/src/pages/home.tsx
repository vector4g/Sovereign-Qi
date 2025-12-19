import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Cpu, Users } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_digital_twin_data_flow.png";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-display font-bold text-white tracking-tighter">
            SOVEREIGN <span className="text-primary">QI</span>
          </div>
          <div className="flex gap-4">
            {user ? (
               <Link href="/dashboard">
                <a className="bg-primary/90 hover:bg-primary text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                  Dashboard
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-all border border-white/10">
                  Log In
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} className="w-full h-full object-cover opacity-40" alt="Digital Twin Void" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-white leading-tight">
              Simulation Before <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">Legislation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light mb-10">
              We use digital twins and zero-knowledge identity to train on the struggle, not the identity.
              Experience leadership without surveillance, moving from AI as a tool to AI as liberation technology.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href={user ? "/dashboard" : "/login"}>
                <a className="group bg-white text-black px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  {user ? "Enter The Lab" : "Access Terminal"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simulation Before Legislation */}
      <section className="py-24 bg-background relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Simulation Before <br /><span className="text-secondary">Legislation</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Sovereign Qi utilizes NVIDIA Omniverse and Isaac Sim to construct high-fidelity digital twins of organizational and civic ecosystems. 
              We deploy autonomous social agents to A/B test standard 'Majority Logic' against dignity-first 'Qi Logic' protocols. 
              This approach allows us to measure innovation velocity, burnout rates, and liability exposure over simulated years, eliminating the ethical risks of experimenting on live human subjects.
            </p>
            <ul className="space-y-4">
              {[
                "High-fidelity simulation of complex social dynamics using Isaac Sim",
                "Comparative analysis of Majority vs. Qi governance models",
                "Longitudinal risk assessment over simulated multi-year timelines"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-[400px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent group-hover:opacity-100 transition-opacity" />
            <Globe className="w-32 h-32 text-secondary/50" />
            <div className="absolute bottom-6 left-6 font-mono text-sm text-secondary">
              SYSTEM_STATUS: SIMULATING...
            </div>
          </div>
        </div>
      </section>

      {/* Synthetic Sovereignty */}
      <section className="py-24 bg-black/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              Synthetic <span className="text-primary">Sovereignty</span> <br/>
              <span className="text-2xl text-gray-400 block mt-2">(The Anti‑Surveillance Move)</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Marginalized communities are often 'data poor' because they must hide from surveillance to survive. 
              Sovereign Qi leverages Omniverse Replicator to generate synthetic personas that statistically mirror these lived challenges—such as medical bias faced by a Black trans woman—without ever recording or exposing real individuals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Train on the Struggle",
                desc: "We model the systemic friction, not the individual identity. Synthetic data captures the dynamic of bias without the surveillance of vulnerable people."
              },
              {
                icon: Cpu,
                title: "Privacy by Default",
                desc: "No real human data is harvested. We generate statistical twins that face real-world barriers, protecting community anonymity completely."
              },
              {
                icon: Users,
                title: "Robustness & Justice",
                desc: "Fill the gaps in 'data poor' datasets. Ensure your systems work for the critical edge cases that matter most, not just the statistical majority."
              }
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-8 rounded-xl hover:border-primary/50 transition-colors">
                <feature.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qi Wallet */}
      <section className="py-24 bg-background border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 font-mono text-sm">
            ZK-IDENTITY PROTOCOL
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white">
            Zero-Knowledge Leadership
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            The Qi Wallet empowers you to prove your rights without exposing your identity. 
            Using Decentralized Identifiers (DIDs) and Zero-Knowledge Proofs, a system can ask "Do you have permission?" and receive a cryptographic "Yes"—without ever needing to know who you are.
          </p>
          <div className="glass-panel p-8 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent max-w-2xl mx-auto">
             <div className="font-mono text-left space-y-4 text-sm text-gray-300">
               <div className="border-b border-white/10 pb-4 mb-4">
                 <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Shield size={16} className="text-primary"/> THE SAFE OFFICE EXAMPLE</h3>
                 <p className="text-gray-400 text-xs leading-relaxed">
                   Traditional systems log: <span className="text-red-400">"Levi entered at 8:02 AM."</span><br/>
                   Qi Systems verify: <span className="text-green-400">"Someone with permission entered."</span>
                 </p>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span>DOOR_QUERY:</span>
                   <span className="text-secondary">HAS_VALID_ACCESS_TOKEN?</span>
                 </div>
                 <div className="flex justify-between">
                   <span>WALLET_RESPONSE:</span>
                   <span className="text-primary">PROOF_VALIDATED (True)</span>
                 </div>
                 <div className="flex justify-between pt-2 border-t border-white/5">
                   <span>IDENTITY_LOGGED:</span>
                   <span className="text-gray-500">NULL (Anonymity Preserved)</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Curb Cut for Humanity */}
      <section className="py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              The Curb Cut for <span className="text-secondary">Humanity</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Sovereign Qi is built on an accessibility‑first principle: design for those most excluded, and everyone else inherits the safety and clarity. When our models learn to read neurodivergent cues, anti‑trans dog‑whistles, and intersectional bias, they become more reliable for veterans, stroke survivors, kids in conflict, and anyone navigating complex systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Trauma-Informed AI",
                desc: "Neurodivergent-aware sensing that also improves support for trauma‑affected veterans."
              },
              {
                title: "Safety Beyond Identity",
                desc: "Anti‑trans dog‑whistle detection that also flags subtle school bullying and workplace harassment."
              },
              {
                title: "Universal Care",
                desc: "Bias detection tuned on trans healthcare that raises diagnostic quality for all edge‑case patients."
              }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-xl border border-white/5 hover:border-secondary/30 transition-all group">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <span className="font-mono text-secondary text-lg font-bold">0{i+1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2025 Sovereign Qi. Liberation-Grade AI.</p>
      </footer>
    </div>
  );
}
