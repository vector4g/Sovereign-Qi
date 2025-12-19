import { useState, useSyncExternalStore, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { mockApi, PilotProject, PilotType } from "@/lib/mock-api";
import { SimulationChart } from "@/components/ui/simulation-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, LayoutDashboard, Activity, CheckCircle2, AlertCircle, Globe, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

// Custom hook to sync with our mock store
function usePilots() {
  const pilots = useSyncExternalStore(
    (cb) => mockApi.subscribe(cb),
    () => mockApi.getPilots()
  );
  return pilots;
}

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const pilots = usePilots();
  const { toast } = useToast();
  const [activePilotId, setActivePilotId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const form = useForm<Omit<PilotProject, "id" | "createdAt" | "status" | "simulationResult">>({
    defaultValues: {
      type: "ENTERPRISE",
      name: "",
      orgName: "",
      region: "",
      primaryObjective: "",
      majorityLogicDesc: "",
      qiLogicDesc: ""
    }
  });

  const onSubmit = (data: any) => {
    mockApi.addPilot(data);
    toast({
      title: "Pilot Project Created",
      description: "Ready for simulation configuration.",
    });
    form.reset();
  };

  const handleRunSimulation = async (id: string) => {
    setIsSimulating(true);
    setActivePilotId(id);
    try {
      await mockApi.runSimulation(id);
      toast({
        title: "Simulation Complete",
        description: "Metrics available. Innovation factor increased.",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Find the currently selected pilot object
  const activePilot = pilots.find(p => p.id === activePilotId);

  if (isLoading || !user) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-black/40 p-6 flex flex-col gap-6">
        <Link href="/">
          <a className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity">
            SOVEREIGN <span className="text-primary">QI</span>
          </a>
        </Link>
        
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2 bg-white/5 text-white">
            <LayoutDashboard size={18} /> Dashboard
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-gray-400 hover:text-white">
            <Activity size={18} /> Simulations
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
            <div className="text-sm overflow-hidden">
              <div className="font-bold text-white truncate max-w-[120px]">User</div>
              <div className="text-gray-500 text-xs truncate max-w-[140px]">{user}</div>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="w-full justify-start gap-2 border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Pilot Overview</h1>
            <p className="text-gray-400">Manage digital twins and simulation runs.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus size={18} /> New Pilot
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure New Pilot</DialogTitle>
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs text-blue-200">
                  <p className="font-semibold mb-1">Data Usage & Privacy</p>
                  <p>
                    We use this information only to configure and run your Sovereign Qi digital‑twin pilot and to follow up with you about that specific project. We collect only the minimum details needed to scope the simulation, and we do not reuse this data for unrelated analytics or marketing without your explicit consent.
                  </p>
                </div>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pilot Name</Label>
                    <Input {...form.register("name")} placeholder="e.g. Neo-Tokyo Transit" className="bg-black/20 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={(v: any) => form.setValue("type", v)} defaultValue="ENTERPRISE">
                      <SelectTrigger className="bg-black/20 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                        <SelectItem value="CITY">City</SelectItem>
                        <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input {...form.register("orgName")} placeholder="e.g. Tokyo Metro Govt" className="bg-black/20 border-white/10" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input {...form.register("region")} placeholder="e.g. APAC" className="bg-black/20 border-white/10" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Objective</Label>
                  <Input {...form.register("primaryObjective")} placeholder="e.g. Reduce burnout, Lower liability" className="bg-black/20 border-white/10" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Majority Logic (Current State)</Label>
                  <Textarea 
                    {...form.register("majorityLogicDesc")} 
                    placeholder="How does the system work today? e.g. Efficiency first, optimize for throughput."
                    className="bg-black/20 border-white/10 min-h-[80px]" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary">Qi Logic (Target State)</Label>
                  <Textarea 
                    {...form.register("qiLogicDesc")} 
                    placeholder="What would Qi Logic look like? e.g. Dignity first, optimize for personal space."
                    className="bg-primary/5 border-primary/20 min-h-[80px]" 
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                  Initialize Pilot
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pilot List */}
          <div className="lg:col-span-1 space-y-4">
             <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Active Pilots</h2>
             {pilots.map(pilot => (
               <div 
                 key={pilot.id}
                 onClick={() => setActivePilotId(pilot.id)}
                 className={`p-4 rounded-lg border cursor-pointer transition-all ${
                   activePilotId === pilot.id 
                     ? "bg-primary/10 border-primary" 
                     : "bg-white/5 border-white/10 hover:border-white/20"
                 }`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-white">{pilot.name}</h3>
                   <span className={`text-xs px-2 py-0.5 rounded-full border ${
                     pilot.status === "COMPLETED" 
                       ? "bg-green-500/10 text-green-500 border-green-500/20" 
                       : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                   }`}>
                     {pilot.status}
                   </span>
                 </div>
                 <div className="text-sm text-gray-400 mb-3">
                   {pilot.orgName} • {pilot.type}
                 </div>
                 <div className="text-xs text-gray-500 truncate">
                   {pilot.primaryObjective}
                 </div>
               </div>
             ))}
          </div>

          {/* Details / Simulation Area */}
          <div className="lg:col-span-2">
            {activePilot ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">{activePilot.name}</h2>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Globe size={14} /> {activePilot.region}</span>
                      <span className="flex items-center gap-1"><AlertCircle size={14} /> {activePilot.primaryObjective}</span>
                    </div>
                  </div>
                  {activePilot.status !== "COMPLETED" && (
                    <Button 
                      onClick={() => handleRunSimulation(activePilot.id)}
                      disabled={isSimulating}
                      className="bg-secondary text-black hover:bg-secondary/90 font-bold"
                    >
                      {isSimulating ? "Simulating..." : (
                        <>
                          <Play size={16} className="mr-2" /> Run Qi Simulation
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-400 uppercase">Majority Logic</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-300">
                      {activePilot.majorityLogicDesc}
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-sm text-primary uppercase">Qi Logic</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-300">
                      {activePilot.qiLogicDesc}
                    </CardContent>
                  </Card>
                </div>

                {activePilot.simulationResult ? (
                  <div className="mt-8">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <CheckCircle2 className="text-green-500" /> Simulation Results
                     </h3>
                     <SimulationChart result={activePilot.simulationResult} />
                  </div>
                ) : (
                  <div className="h-[300px] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 flex-col gap-4">
                    <Activity size={48} className="opacity-20" />
                    <p>Ready to run Omniverse simulation.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a pilot to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
