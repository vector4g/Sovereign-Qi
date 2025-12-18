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
              We use NVIDIA Omniverse and Isaac Sim to build high-fidelity digital twins of entire corporate and civic ecosystems. 
              We run massive A/B tests: Majority Logic vs. Qi Logic, measuring the hidden costs of compliance and the liberated value of dignity.
            </p>
            <ul className="space-y-4">
              {[
                "Zero risk to human subjects",
                "Model burnout & liability vectors",
                "Quantify the ROI of dignity"
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
              Synthetic <span className="text-primary">Sovereignty</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Marginalized communities are "data poor" by design. We use Omniverse Replicator to generate synthetic personas that model bias pathways without extractive surveillance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy by Design",
                desc: "No real human data is harvested. We simulate the struggle, not the person."
              },
              {
                icon: Cpu,
                title: "Robustness",
                desc: "Stress-test policies against edge cases that rarely appear in training data."
              },
              {
                icon: Users,
                title: "Alignment",
                desc: "Ensure regulatory compliance before a single line of policy is written."
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
          <p className="text-xl text-gray-400 mb-12">
            The Qi Wallet uses DIDs and Zero-Knowledge Proofs to verify "has the right" without revealing "who you are". 
            Doors open, services unlock, and systems verify permission—without ever logging your identity.
          </p>
          <div className="glass-panel p-8 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
             <div className="font-mono text-left space-y-2 text-sm text-gray-300">
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>ACCESS_REQUEST:</span>
                 <span className="text-green-400">GRANTED</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>VERIFIER:</span>
                 <span>OFFICE_MAIN_DOOR_L4</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span>PROOF:</span>
                 <span className="text-primary truncate max-w-[200px]">zk-snark-0x892...</span>
               </div>
               <div className="flex justify-between pt-2">
                 <span>IDENTITY_REVEALED:</span>
                 <span className="text-red-400">FALSE</span>
               </div>
             </div>
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
