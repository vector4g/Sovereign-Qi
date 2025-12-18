import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_digital_twin_data_flow.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} className="w-full h-full object-cover opacity-20" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <div className="text-3xl font-display font-bold text-white tracking-tighter mb-2">
            SOVEREIGN <span className="text-primary">QI</span>
          </div>
          <p className="text-gray-400">Liberation-Grade Access Control</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock size={18} className="text-primary" /> Authenticate
            </CardTitle>
            <CardDescription>
              Enter your authorized email to access the Simulation Lab.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="researcher@sovereignqi.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white group">
                Access Terminal <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
