import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { pilotsApi } from "@/lib/api";
import { SimulationChart } from "@/components/ui/simulation-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Play, LayoutDashboard, Activity, CheckCircle2, AlertCircle, Globe, LogOut, Users, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Pilot {
  id: string;
  name: string;
  type: "ENTERPRISE" | "CITY" | "HEALTHCARE";
  orgName: string;
  region: string;
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  status: "DRAFT" | "CONFIGURED" | "RUNNING" | "COMPLETED";
  createdAt: string;
}

interface SimulationResult {
  scenarioA: {
    label: string;
    innovationIndex: number;
    burnoutIndex: number;
    liabilityIndex: number;
  };
  scenarioB: {
    label: string;
    innovationIndex: number;
    burnoutIndex: number;
    liabilityIndex: number;
  };
}

interface CouncilAdvice {
  qiPolicySummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  status: "APPROVE" | "REVISE" | "BLOCK";
}

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activePilotId, setActivePilotId] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<Record<string, SimulationResult>>({});
  const [councilAdvice, setCouncilAdvice] = useState<Record<string, CouncilAdvice>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: pilots = [], isLoading: pilotsLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: pilotsApi.list,
    enabled: !!user,
  });

  const form = useForm<Omit<Pilot, "id" | "createdAt" | "status" | "ownerEmail">>({
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

  const createPilotMutation = useMutation({
    mutationFn: pilotsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Pilot Project Created",
        description: "Ready for Council review and simulation.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const councilAdviceMutation = useMutation({
    mutationFn: pilotsApi.getCouncilAdvice,
    onSuccess: (data, pilotId) => {
      setCouncilAdvice(prev => ({ ...prev, [pilotId]: data.advice }));
      toast({
        title: "Council Deliberation Complete",
        description: `Status: ${data.advice.status}. Review the governance guidance below.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Council Deliberation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const runSimulationMutation = useMutation({
    mutationFn: pilotsApi.runSimulation,
    onSuccess: (data, pilotId) => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      setSimulationResults(prev => ({ ...prev, [pilotId]: data }));
      toast({
        title: "Simulation Complete",
        description: "Metrics available. Innovation factor increased.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Simulation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createPilotMutation.mutate(data);
  };

  const handleRequestAdvice = async (id: string) => {
    councilAdviceMutation.mutate(id);
  };

  const handleRunSimulation = async (id: string) => {
    runSimulationMutation.mutate(id);
  };

  const activePilot = pilots.find((p: Pilot) => p.id === activePilotId);
  const activePilotSimulation = activePilotId ? simulationResults[activePilotId] : null;
  const activePilotAdvice = activePilotId ? councilAdvice[activePilotId] : null;

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-black/40 p-6 flex flex-col gap-6">
        <Link href="/">
          <span className="text-2xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
            SOVEREIGN <span className="text-primary">QI</span>
          </span>
        </Link>
        
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2 bg-white/5 text-white">
            <LayoutDashboard size={18} /> Dashboard
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-gray-400 hover:text-white">
            <Activity size={18} /> Simulations
          </Button>
          <Link href="/council">
            <Button variant="ghost" className="justify-start gap-2 text-gray-400 hover:text-white w-full" data-testid="link-council-sidebar">
              <Users size={18} /> The Council
            </Button>
          </Link>
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2" data-testid="button-new-pilot">
                <Plus size={18} /> New Pilot
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure New Pilot</DialogTitle>
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs text-blue-200">
                  <p className="font-semibold mb-1">Data Usage & Privacy</p>
                  <p>
                    We use this information only to configure and run your Sovereign Qi digital-twin pilot and to follow up with you about that specific project. We collect only the minimum details needed to scope the simulation, and we do not reuse this data for unrelated analytics or marketing without your explicit consent.
                  </p>
                </div>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pilot Name</Label>
                    <Input {...form.register("name")} placeholder="e.g. Neo-Tokyo Transit" className="bg-black/20 border-white/10" required data-testid="input-pilot-name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={(v: any) => form.setValue("type", v)} defaultValue="ENTERPRISE">
                      <SelectTrigger className="bg-black/20 border-white/10" data-testid="select-pilot-type">
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
                    <Input {...form.register("orgName")} placeholder="e.g. Tokyo Metro Govt" className="bg-black/20 border-white/10" required data-testid="input-org-name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input {...form.register("region")} placeholder="e.g. APAC" className="bg-black/20 border-white/10" required data-testid="input-region" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Objective</Label>
                  <Input {...form.register("primaryObjective")} placeholder="e.g. Reduce burnout, Lower liability" className="bg-black/20 border-white/10" required data-testid="input-objective" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Majority Logic (Current State)</Label>
                  <Textarea 
                    {...form.register("majorityLogicDesc")} 
                    placeholder="How does the system work today? e.g. Efficiency first, optimize for throughput."
                    className="bg-black/20 border-white/10 min-h-[80px]" 
                    required
                    data-testid="textarea-majority-logic"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary">Qi Logic (Target State)</Label>
                  <Textarea 
                    {...form.register("qiLogicDesc")} 
                    placeholder="What would Qi Logic look like? e.g. Dignity first, optimize for personal space."
                    className="bg-primary/5 border-primary/20 min-h-[80px]" 
                    required
                    data-testid="textarea-qi-logic"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200"
                  disabled={createPilotMutation.isPending}
                  data-testid="button-submit-pilot"
                >
                  {createPilotMutation.isPending ? "Creating..." : "Initialize Pilot"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pilot List */}
          <div className="lg:col-span-1 space-y-4">
             <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Active Pilots</h2>
             {pilotsLoading ? (
               <div className="text-gray-500">Loading pilots...</div>
             ) : pilots.length === 0 ? (
               <div className="text-gray-500 text-sm">No pilots yet. Create your first one!</div>
             ) : (
               pilots.map((pilot: Pilot) => (
                 <div 
                   key={pilot.id}
                   onClick={() => setActivePilotId(pilot.id)}
                   data-testid={`card-pilot-${pilot.id}`}
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
                     {pilot.orgName} - {pilot.type}
                   </div>
                   <div className="text-xs text-gray-500 truncate">
                     {pilot.primaryObjective}
                   </div>
                 </div>
               ))
             )}
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
                  <div className="flex gap-2">
                    {!activePilotAdvice && (
                      <Button 
                        onClick={() => handleRequestAdvice(activePilot.id)}
                        disabled={councilAdviceMutation.isPending}
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        data-testid="button-request-advice"
                      >
                        {councilAdviceMutation.isPending ? "Deliberating..." : (
                          <>
                            <Users size={16} className="mr-2" /> Council Review
                          </>
                        )}
                      </Button>
                    )}
                    {activePilot.status !== "COMPLETED" && (
                      <Button 
                        onClick={() => handleRunSimulation(activePilot.id)}
                        disabled={runSimulationMutation.isPending}
                        className="bg-secondary text-black hover:bg-secondary/90 font-bold"
                        data-testid="button-run-simulation"
                      >
                        {runSimulationMutation.isPending ? "Simulating..." : (
                          <>
                            <Play size={16} className="mr-2" /> Run Qi Simulation
                          </>
                        )}
                      </Button>
                    )}
                  </div>
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

                {/* Council Advice Section */}
                {activePilotAdvice && (
                  <div className="mt-6 space-y-4 animate-in fade-in-50 duration-500">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className="text-primary" /> Council Governance Review
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        activePilotAdvice.status === "APPROVE" ? "bg-green-500/20 text-green-400" :
                        activePilotAdvice.status === "REVISE" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {activePilotAdvice.status}
                      </span>
                    </h3>
                    
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-sm text-primary uppercase flex items-center gap-2">
                          <ShieldCheck size={16} /> Qi Policy Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-300">
                        {activePilotAdvice.qiPolicySummary}
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs text-yellow-400 uppercase flex items-center gap-2">
                            <AlertTriangle size={14} /> Required Changes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-xs text-gray-400 space-y-2">
                            {activePilotAdvice.requiredChanges.map((change, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-yellow-500">-</span>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs text-red-400 uppercase flex items-center gap-2">
                            <AlertCircle size={14} /> Risk Flags
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-xs text-gray-400 space-y-2">
                            {activePilotAdvice.riskFlags.map((flag, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-red-500">!</span>
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-500/5 border-green-500/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs text-green-400 uppercase flex items-center gap-2">
                            <Sparkles size={14} /> Curb-Cut Benefits
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-xs text-gray-400 space-y-2">
                            {activePilotAdvice.curbCutBenefits.map((benefit, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-green-500">+</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activePilotSimulation || activePilot.status === "COMPLETED" ? (
                  <div className="mt-8">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <CheckCircle2 className="text-green-500" /> Simulation Results
                     </h3>
                     {activePilotSimulation && <SimulationChart result={activePilotSimulation} />}
                  </div>
                ) : (
                  <div className="h-[200px] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 flex-col gap-4">
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
