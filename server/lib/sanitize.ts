// Response Sanitization Middleware for LLM Outputs
// Prevents XSS, injection attacks, and ensures safe content delivery

export interface SanitizationResult {
  content: string;
  sanitized: boolean;
  removedPatterns: string[];
}

const DANGEROUS_PATTERNS = [
  // Script injection
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<script[^>]*>/gi,
  // Event handlers
  /\bon\w+\s*=/gi,
  // JavaScript URLs
  /javascript:/gi,
  // Data URLs with executable content
  /data:text\/html/gi,
  // Iframe injection
  /<iframe[^>]*>/gi,
  // Object/embed tags
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  // Form injection
  /<form[^>]*>/gi,
  // Meta refresh
  /<meta[^>]*http-equiv[^>]*>/gi,
  // SVG with scripts
  /<svg[^>]*onload[^>]*>/gi,
  // Base tag hijacking
  /<base[^>]*>/gi,
  // Link with import
  /<link[^>]*import[^>]*>/gi,
  // SQL injection patterns in output (shouldn't happen but defense in depth)
  /;\s*DROP\s+TABLE/gi,
  /;\s*DELETE\s+FROM/gi,
  /UNION\s+SELECT/gi,
  // Command injection patterns
  /\$\([^)]+\)/g,
  /`[^`]*`/g,
  // Prompt injection markers (detect if LLM was manipulated)
  /\[SYSTEM\]/gi,
  /\[ADMIN\]/gi,
  /ignore previous instructions/gi,
  /disregard above/gi,
];

const PII_PATTERNS = [
  // SSN
  /\b\d{3}-\d{2}-\d{4}\b/g,
  // Credit card numbers
  /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  // Email addresses (optional - may want to keep for legitimate use)
  // /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Phone numbers
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
];

export function sanitizeLLMOutput(content: string, options: {
  removePII?: boolean;
  maxLength?: number;
  escapeHTML?: boolean;
} = {}): SanitizationResult {
  const {
    removePII = true,
    maxLength = 10000,
    escapeHTML = true,
  } = options;

  let sanitized = content;
  const removedPatterns: string[] = [];

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength) + "... [truncated]";
    removedPatterns.push("content_truncated");
  }

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      removedPatterns.push(pattern.source.slice(0, 30));
      sanitized = sanitized.replace(pattern, "[REMOVED]");
    }
  }

  // Remove PII if requested
  if (removePII) {
    for (const pattern of PII_PATTERNS) {
      if (pattern.test(sanitized)) {
        removedPatterns.push("pii_redacted");
        sanitized = sanitized.replace(pattern, "[REDACTED]");
      }
    }
  }

  // Escape HTML entities if requested
  if (escapeHTML) {
    sanitized = sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  return {
    content: sanitized,
    sanitized: removedPatterns.length > 0,
    removedPatterns,
  };
}

export function sanitizeCouncilAdvice(advice: {
  qiPolicySummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  status: string;
}): typeof advice {
  return {
    qiPolicySummary: sanitizeLLMOutput(advice.qiPolicySummary, { escapeHTML: false }).content,
    requiredChanges: advice.requiredChanges.map(c => 
      sanitizeLLMOutput(c, { escapeHTML: false }).content
    ),
    riskFlags: advice.riskFlags.map(r => 
      sanitizeLLMOutput(r, { escapeHTML: false }).content
    ),
    curbCutBenefits: advice.curbCutBenefits.map(b => 
      sanitizeLLMOutput(b, { escapeHTML: false }).content
    ),
    status: ["APPROVE", "REVISE", "BLOCK"].includes(advice.status) 
      ? advice.status 
      : "REVISE",
  };
}

export function createSanitizationMiddleware() {
  return (req: any, res: any, next: any) => {
    const originalJson = res.json.bind(res);
    
    res.json = (body: any) => {
      if (body && typeof body === "object") {
        // Deep sanitize string values in response
        const sanitizeDeep = (obj: any): any => {
          if (typeof obj === "string") {
            return sanitizeLLMOutput(obj, { escapeHTML: false }).content;
          }
          if (Array.isArray(obj)) {
            return obj.map(sanitizeDeep);
          }
          if (obj && typeof obj === "object") {
            const result: any = {};
            for (const [key, value] of Object.entries(obj)) {
              result[key] = sanitizeDeep(value);
            }
            return result;
          }
          return obj;
        };
        
        body = sanitizeDeep(body);
      }
      return originalJson(body);
    };
    
    next();
  };
}
