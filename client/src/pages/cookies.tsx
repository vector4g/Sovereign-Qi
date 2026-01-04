import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, Shield, BarChart3, Megaphone, Clock, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export default function Cookies() {
  const [preferences, setPreferences] = useState<CookieCategory[]>([
    {
      id: "necessary",
      name: "Strictly Necessary",
      description: "Authentication tokens, session management, security cookies. Core functionality - cannot be disabled.",
      required: true,
      enabled: true,
    },
    {
      id: "functional",
      name: "Functional",
      description: "Language preference, theme settings, dashboard layout customization. Enhanced user experience.",
      required: false,
      enabled: true,
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Privacy-focused page views and feature usage (anonymized). Product improvement only - never sold.",
      required: false,
      enabled: false,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences(prefs =>
      prefs.map(p => (p.id === id && !p.required ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
    localStorage.setItem("cookie_consent", "true");
  };

  const acceptAll = () => {
    const allEnabled = preferences.map(p => ({ ...p, enabled: true }));
    setPreferences(allEnabled);
    localStorage.setItem("cookie_preferences", JSON.stringify(allEnabled));
    localStorage.setItem("cookie_consent", "true");
  };

  const rejectNonEssential = () => {
    const onlyRequired = preferences.map(p => ({ ...p, enabled: p.required }));
    setPreferences(onlyRequired);
    localStorage.setItem("cookie_preferences", JSON.stringify(onlyRequired));
    localStorage.setItem("cookie_consent", "true");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-slate-900/50 text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-display font-bold text-white tracking-tighter"
            data-testid="link-home"
          >
            SOVEREIGN <span className="text-primary">QI</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            data-testid="link-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-sm text-gray-400 mb-6">Last Updated: January 3, 2026</p>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              This Cookie Policy explains how Sovereign QI uses cookies and similar tracking technologies. 
              <span className="text-violet-300 font-medium"> TL;DR: We use minimal cookies for functionality 
              and security—no invasive tracking.</span>
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Cookie className="w-5 h-5 text-violet-300" />
                </div>
                <h2 className="text-2xl font-semibold text-violet-300">What Are Cookies?</h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Small text files stored on your device
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Help us remember your preferences and improve your experience
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Types: <span className="text-white">Session cookies</span> (temporary) vs <span className="text-white">Persistent cookies</span> (long-term)
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel rounded-xl p-6 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Shield className="w-5 h-5 text-green-300" />
                </div>
                <h2 className="text-2xl font-semibold text-green-300">Strictly Necessary (Always Active)</h2>
              </div>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  Authentication tokens (keeps you logged in)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  Session management (remembers your simulation state)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  Security cookies (prevents CSRF attacks)
                </li>
              </ul>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-200 text-sm">Purpose: Core functionality - cannot be disabled</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel rounded-xl p-6 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Settings className="w-5 h-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-semibold text-blue-300">Functional Cookies (Optional)</h2>
              </div>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Language preference
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Theme settings (dark/light mode)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  Dashboard layout customization
                </li>
              </ul>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-200 text-sm">Purpose: Enhanced user experience</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-panel rounded-xl p-6 border border-yellow-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <BarChart3 className="w-5 h-5 text-yellow-300" />
                </div>
                <h2 className="text-2xl font-semibold text-yellow-300">Analytics Cookies (Optional)</h2>
              </div>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  Page views and feature usage (anonymized)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  Simulation completion rates
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  Tool: Privacy-focused analytics (not Google Analytics)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                  Data: Aggregated, <span className="text-white font-medium">never sold to third parties</span>
                </li>
              </ul>
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-200 text-sm">Purpose: Product improvement only</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-panel rounded-xl p-6 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Megaphone className="w-5 h-5 text-red-300" />
                </div>
                <h2 className="text-2xl font-semibold text-red-300">Marketing Cookies (Disabled by Default)</h2>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-200 font-medium mb-2">We do NOT use marketing/advertising cookies</p>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li>• No retargeting, no cross-site tracking</li>
                  <li>• No Facebook Pixel, Google Ads, or similar</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Clock className="w-5 h-5 text-violet-300" />
                </div>
                <h2 className="text-2xl font-semibold text-violet-300">Cookie Duration</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium mb-1">Session cookies</p>
                  <p className="text-gray-400 text-sm">Expire when you close browser</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium mb-1">Auth tokens</p>
                  <p className="text-gray-400 text-sm">30 days (or until logout)</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium mb-1">Preference cookies</p>
                  <p className="text-gray-400 text-sm">1 year</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium mb-1">Analytics cookies</p>
                  <p className="text-gray-400 text-sm">90 days (anonymized after 30)</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-panel rounded-xl p-6 border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">Cookie Preferences</h2>
              <div className="space-y-4 mb-6">
                {preferences.map(pref => (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{pref.name}</p>
                        {pref.required && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-300 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{pref.description}</p>
                    </div>
                    <Switch
                      checked={pref.enabled}
                      onCheckedChange={() => togglePreference(pref.id)}
                      disabled={pref.required}
                      data-testid={`switch-cookie-${pref.id}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={acceptAll}
                  className="bg-violet-600 hover:bg-violet-700"
                  data-testid="button-accept-all"
                >
                  Accept All
                </Button>
                <Button
                  onClick={rejectNonEssential}
                  variant="outline"
                  className="border-gray-600"
                  data-testid="button-reject-non-essential"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  onClick={handleSave}
                  variant="ghost"
                  className="text-violet-300"
                  data-testid="button-save-preferences"
                >
                  Save Preferences
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-panel rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-violet-300 mb-4">GDPR & ePrivacy Compliance</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Explicit consent required for non-essential cookies (EU users)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Granular consent options (no 'Accept All' dark patterns)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Easy withdrawal of consent
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  We honor Do Not Track (DNT) signals automatically
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0" />
                  Children: No cookies for users under 16
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="glass-panel rounded-xl p-6 border border-white/10 text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 mb-6">
                Questions about cookies?{" "}
                <a href="mailto:cookies@vectorforgood.com" className="text-violet-300 hover:underline">
                  cookies@vectorforgood.com
                </a>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="gap-2" data-testid="button-download-cookies">
                  <Download className="w-4 h-4" /> Download Cookie Policy (PDF)
                </Button>
                <Link href="/privacy">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 Vector for Good PBC. Simulation Before Legislation.</p>
      </footer>
    </div>
  );
}
