import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: "click" | "observe";
}

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  hasCompletedTour: boolean;
  markTourCompleted: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

const TOUR_STORAGE_KEY = "sovereign_qi_tour_completed";

export const dashboardTourSteps: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='welcome']",
    title: "Welcome to Sovereign Qi",
    content: "This guided tour will show you how to create and simulate pilot projects using our AI governance council. Let's get started!",
    placement: "bottom",
  },
  {
    id: "new-pilot",
    target: "[data-testid='button-new-pilot']",
    title: "Create a New Pilot",
    content: "Click this button to create your first pilot project. You'll define governance rules comparing 'Majority Logic' with 'Qi Logic'.",
    placement: "left",
  },
  {
    id: "pilot-list",
    target: "[data-tour='pilot-list']",
    title: "Your Pilot Projects",
    content: "All your pilots appear here. Click on any pilot to view details, request Council review, and run simulations.",
    placement: "right",
  },
  {
    id: "sidebar-nav",
    target: "[data-tour='sidebar-nav']",
    title: "Navigation",
    content: "Use the sidebar to navigate between Dashboard, Simulations, and The Council page where you can learn about each AI agent.",
    placement: "right",
  },
];

function TooltipOverlay({ step, stepIndex, totalSteps, onNext, onPrev, onClose }: {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    let retryTimer: NodeJS.Timeout | null = null;

    const updatePosition = () => {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetFound(true);
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const padding = 16;

        let top = 0;
        let left = 0;

        switch (step.placement) {
          case "top":
            top = rect.top + window.scrollY - tooltipHeight - padding;
            left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;
            break;
          case "bottom":
            top = rect.bottom + window.scrollY + padding;
            left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;
            break;
          case "left":
            top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
            left = rect.left + window.scrollX - tooltipWidth - padding;
            break;
          case "right":
          default:
            top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + window.scrollX + padding;
            break;
        }

        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
        top = Math.max(padding, Math.min(top, window.innerHeight + window.scrollY - tooltipHeight - padding));

        setTooltipPos({ top, left });
      } else {
        setTargetFound(false);
        if (retryCount < maxRetries) {
          retryCount++;
          retryTimer = setTimeout(updatePosition, 200);
        }
      }
    };

    setTargetFound(false);
    retryCount = 0;
    updatePosition();
    
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [step]);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  if (!targetFound) {
    return (
      <div className="fixed inset-0 z-[9998] bg-black/75 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1f2e] border border-primary/30 rounded-xl p-6 max-w-sm text-center"
        >
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading tour step...</p>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="mt-4 text-gray-500"
            data-testid="button-skip-tour"
          >
            Skip Tour
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg className="w-full h-full absolute">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={position.left - 8}
                y={position.top - 8}
                width={position.width + 16}
                height={position.height + 16}
                rx="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      <div
        className="fixed z-[9999] border-2 border-primary rounded-lg pointer-events-none animate-pulse"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed z-[10000] w-80"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        <div className="bg-[#1a1f2e] border border-primary/30 rounded-xl shadow-2xl shadow-primary/20 overflow-hidden">
          <div className="bg-primary/10 px-4 py-3 flex items-center justify-between border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary">
                STEP {stepIndex + 1} OF {totalSteps}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              data-testid="button-close-tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{step.content}</p>
          </div>

          <div className="px-4 py-3 bg-black/20 flex items-center justify-between">
            <Button
              onClick={onPrev}
              disabled={isFirst}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white disabled:opacity-30"
              data-testid="button-tour-prev"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === stepIndex ? "bg-primary" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={onNext}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
              data-testid="button-tour-next"
            >
              {isLast ? "Finish" : "Next"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function TourProvider({ children, steps }: { children: ReactNode; steps: TourStep[] }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    }
    return false;
  });

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markTourCompleted();
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  const markTourCompleted = () => {
    setHasCompletedTour(true);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  };

  const currentTourStep = steps[currentStep];

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
        hasCompletedTour,
        markTourCompleted,
      }}
    >
      {children}
      <AnimatePresence>
        {isActive && currentTourStep && (
          <TooltipOverlay
            step={currentTourStep}
            stepIndex={currentStep}
            totalSteps={steps.length}
            onNext={nextStep}
            onPrev={prevStep}
            onClose={endTour}
          />
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

export function TourTriggerButton() {
  const { startTour, isActive } = useTour();

  if (isActive) return null;

  return (
    <Button
      onClick={startTour}
      variant="outline"
      size="sm"
      className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
      data-testid="button-start-tour"
    >
      <HelpCircle className="w-4 h-4" /> Take a Tour
    </Button>
  );
}
