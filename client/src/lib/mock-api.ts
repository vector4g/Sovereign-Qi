
export type PilotType = "ENTERPRISE" | "CITY" | "HEALTHCARE";

export interface PilotProject {
  id: string;
  name: string;
  type: PilotType;
  orgName: string;
  region: string;
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  status: "DRAFT" | "CONFIGURED" | "RUNNING" | "COMPLETED";
  createdAt: string;
  simulationResult?: SimulationResult;
}

export interface SimulationResult {
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

// Initial mock data
const INITIAL_PILOTS: PilotProject[] = [
  {
    id: "pilot-1",
    name: "Neo-Tokyo Transit Grid",
    type: "CITY",
    orgName: "Tokyo Metro Govt",
    region: "APAC",
    primaryObjective: "Reduce commuter stress & accident liability",
    majorityLogicDesc: "Efficiency first. optimize for max throughput regardless of passenger density discomfort.",
    qiLogicDesc: "Dignity first. Optimize for personal space and flow, treating passenger stress as a system cost.",
    status: "CONFIGURED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pilot-2",
    name: "MediCare AI Triage",
    type: "HEALTHCARE",
    orgName: "Global Health Corp",
    region: "NA",
    primaryObjective: "Minimize clinician burnout",
    majorityLogicDesc: "Throughput metrics. Doctors penalized for spending >15m per patient.",
    qiLogicDesc: "Relational metrics. System optimizes for 'understanding complete' signal from patient.",
    status: "DRAFT",
    createdAt: new Date().toISOString(),
  }
];

// Simple in-memory storage simulation
class MockStorage {
  private pilots: PilotProject[] = [...INITIAL_PILOTS];
  private listeners: (() => void)[] = [];

  getPilots() {
    return this.pilots;
  }

  addPilot(pilot: Omit<PilotProject, "id" | "createdAt" | "status">) {
    const newPilot: PilotProject = {
      ...pilot,
      id: `pilot-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: "DRAFT",
    };
    this.pilots = [newPilot, ...this.pilots];
    this.notify();
    return newPilot;
  }

  async runSimulation(id: string): Promise<SimulationResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result: SimulationResult = {
      scenarioA: {
        label: "Majority Logic",
        innovationIndex: 1.0,
        burnoutIndex: 0.8,
        liabilityIndex: 0.7,
      },
      scenarioB: {
        label: "Qi Logic",
        innovationIndex: 1.4,
        burnoutIndex: 0.3,
        liabilityIndex: 0.1,
      },
    };

    this.pilots = this.pilots.map(p => 
      p.id === id ? { ...p, status: "COMPLETED", simulationResult: result } : p
    );
    this.notify();
    return result;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const mockApi = new MockStorage();
