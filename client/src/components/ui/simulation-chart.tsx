import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SimulationResult } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SimulationChartProps {
  result: SimulationResult;
}

export function SimulationChart({ result }: SimulationChartProps) {
  const data = [
    {
      metric: "Innovation",
      "Majority Logic": result.scenarioA.innovationIndex,
      "Qi Logic": result.scenarioB.innovationIndex,
    },
    {
      metric: "Burnout",
      "Majority Logic": result.scenarioA.burnoutIndex,
      "Qi Logic": result.scenarioB.burnoutIndex,
    },
    {
      metric: "Liability",
      "Majority Logic": result.scenarioA.liabilityIndex,
      "Qi Logic": result.scenarioB.liabilityIndex,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid gap-6 md:grid-cols-2"
    >
      <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-secondary font-display">Comparative Analysis</CardTitle>
          <CardDescription>System Performance Delta</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="metric" stroke="#888" tick={{ fill: '#888' }} />
              <YAxis stroke="#888" tick={{ fill: '#888' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Majority Logic" fill="#64748b" />
              <Bar dataKey="Qi Logic" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary font-display">Innovation Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono text-primary font-bold">
              +40%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Qi Logic unlocks latent creative capacity by removing structural friction.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-secondary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-secondary font-display">Liability Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono text-secondary font-bold">
              -90%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              By modeling dignity-first norms, systemic risk and legal exposure collapse.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
