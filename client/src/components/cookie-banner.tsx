import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    const dnt = navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";
    
    if (!consent && !dnt) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_preferences", JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
    }));
    setIsVisible(false);
  };

  const rejectNonEssential = () => {
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_preferences", JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
    }));
    setIsVisible(false);
  };

  const dismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        >
          <div className="max-w-5xl mx-auto">
            <div 
              className="relative rounded-xl p-6 border-t-2 border-violet-500"
              style={{
                background: "rgba(15, 15, 35, 0.95)",
                backdropFilter: "blur(12px)",
              }}
            >
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Dismiss"
                data-testid="button-dismiss-cookie"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-gray-300">
                    Sovereign QI uses minimal cookies for functionality and security. 
                    We never sell your data or track you across sites.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6"
                    data-testid="button-cookie-accept"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={rejectNonEssential}
                    variant="outline"
                    className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white px-6"
                    data-testid="button-cookie-reject"
                  >
                    Reject Non-Essential
                  </Button>
                  <Link href="/cookies">
                    <Button
                      variant="ghost"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                      data-testid="link-cookie-settings"
                    >
                      Cookie Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
