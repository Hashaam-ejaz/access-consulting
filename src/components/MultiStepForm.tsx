// src/components/MultiStepForm.tsx
import { useState, useEffect } from "preact/hooks";

const WHATSAPP = "4915772312591";
const EMAIL = "Info@TheAccessConsulting.com"; // [CLIENT TO CONFIRM]

type FormData = {
  // Section 1: Your Plans
  level: string;
  countries: string[];
  studyField: string;
  studyFieldDetail: string;
  startTimeline: string;
  postDegreePlan: string;
  priorities: string[];
  // Section 2: Your Background
  qualification: string;
  qualificationStatus: string;
  institutionGrades: string;
  workExperience: string;
  englishScore: string;
  greGmatScore: string;
  testStatus: string[];
  researchOutput: string;
  supervisorContact: string;
  documentsLink: string;
  linkedin: string;
  // Section 3: Funding and Support
  funding: string;
  services: string[];
  processStage: string;
  // Section 4: Contact
  name: string;
  city: string;
  phone: string;
  email: string;
  hearAbout: string;
};

const initial: FormData = {
  level: "", countries: [], studyField: "", studyFieldDetail: "",
  startTimeline: "", postDegreePlan: "", priorities: [],
  qualification: "", qualificationStatus: "", institutionGrades: "", workExperience: "",
  englishScore: "", greGmatScore: "", testStatus: [],
  researchOutput: "", supervisorContact: "", documentsLink: "", linkedin: "",
  funding: "", services: [], processStage: "",
  name: "", city: "", phone: "", email: "", hearAbout: "",
};

type FieldConfig = {
  label: string;
  type: "text" | "tel" | "email" | "single" | "multi";
  options?: string[];
  optional?: boolean;
  hint?: string;
  placeholder?: string;
  maxSelect?: number;
  showIf?: (d: FormData) => boolean;
};

const POSTGRAD_LEVELS = ["Master's", "MPhil / Pre-doctoral", "PhD"];

const FIELDS: Record<keyof FormData, FieldConfig> = {
  // ---- Section 1: Your Plans ----
  level: {
    label: "1. Which level are you applying for?",
    type: "single",
    options: ["Bachelor's", "Master's", "MPhil / Pre-doctoral", "PhD", "Not sure — need advice"],
  },
  countries: {
    label: "2. Which countries are you considering?",
    hint: "Select all that apply",
    type: "multi",
    options: ["UK", "Australia", "Canada", "USA", "Germany", "Italy / Other EU", "China", "Malaysia / Turkey", "Other", "Open to advice"],
  },
  studyField: {
    label: "3. What field do you want to study?",
    type: "single",
    options: ["Engineering / Computer Science", "Business / Finance / Accounting", "Medicine / Health Sciences", "Social Sciences / Law / Humanities", "Natural Sciences / Mathematics", "Other or not decided"],
  },
  studyFieldDetail: {
    label: "Specify programme or research area if known",
    type: "text",
    optional: true,
    placeholder: "e.g. MS Data Science, Renewable Energy research",
  },
  startTimeline: {
    label: "4. When do you want to start?",
    type: "single",
    options: ["Next intake (within 6 months)", "Within 12 months", "In 1-2 years", "Not decided yet"],
  },
  postDegreePlan: {
    label: "5. After completing your degree, what is your primary plan?",
    type: "single",
    options: ["Return to Pakistan", "Work or settle abroad", "Open to advice / Not decided yet"],
  },
  priorities: {
    label: "6. What matters most to you?",
    hint: "Select your top 2 priorities",
    type: "multi",
    maxSelect: 2,
    options: ["Scholarship or funding support", "University reputation and ranking", "Post-study work and PR opportunities", "Ease of admission with my profile", "Proximity to family or specific department/supervisor"],
  },
  // ---- Section 2: Your Background ----
  qualification: {
    label: "7. Highest qualification held or in progress",
    type: "single",
    options: ["Matric / O-Levels", "FSc / FA / ICS", "A-Levels", "Bachelor's", "Master's / MPhil", "Other"],
  },
  qualificationStatus: {
    label: "Status",
    type: "single",
    options: ["Completed", "In progress"],
  },
  institutionGrades: {
    label: "8. Institution and CGPA/Marks achieved",
    type: "text",
    placeholder: 'e.g. "BS Economics, LUMS – 3.4/4.0"',
  },
  workExperience: {
    label: "9. Full-time work experience (excluding internships)",
    type: "single",
    options: ["None", "Under 1 year", "1-3 years", "3-5 years", "Over 5 years"],
  },
  englishScore: {
    label: "10. Language proficiency / standardized test scores",
    hint: "Note scores if available",
    type: "text",
    optional: true,
    placeholder: "IELTS / PTE / TOEFL — e.g. IELTS 7.0",
  },
  greGmatScore: {
    label: "GRE / GMAT (if taken)",
    type: "text",
    optional: true,
    placeholder: "e.g. GRE 320",
  },
  testStatus: {
    label: "If you haven't taken a test yet",
    type: "multi",
    optional: true,
    options: ["Booked / Planning to take", "Seeking no-test pathway"],
  },
  researchOutput: {
    label: "11. Research / publication output",
    hint: "For Master's / PhD applicants",
    type: "single",
    options: ["None yet", "Thesis completed", "Conference papers", "Journal publications", "Reports / grey literature"],
    showIf: (d) => POSTGRAD_LEVELS.includes(d.level),
  },
  supervisorContact: {
    label: "12. Have you contacted a potential supervisor / department?",
    hint: "For PhD applicants",
    type: "single",
    options: ["No, not yet", "Emailed, awaiting reply", "In discussion", "Acceptance received"],
    showIf: (d) => d.level === "PhD",
  },
  documentsLink: {
    label: "13. CV, transcript, or research proposal",
    hint: "Share a link (Google Drive, Dropbox, etc.) — optional at this stage",
    type: "text",
    optional: true,
    placeholder: "https://…",
  },
  linkedin: {
    label: "14. LinkedIn profile (optional)",
    type: "text",
    optional: true,
    placeholder: "https://linkedin.com/in/…",
  },
  // ---- Section 3: Funding and Support ----
  funding: {
    label: "15. Financial approach for tuition and living costs",
    type: "single",
    options: ["Self-funded / Family-supported", "Need partial scholarship / budget-friendly options", "Need 100% full funding / scholarship to proceed"],
  },
  services: {
    label: "16. Which services do you need?",
    hint: "Select all that apply",
    type: "multi",
    options: ["University shortlisting", "Applications", "SOP / Essays", "Research / Supervisor outreach", "Test prep", "Visa / Interview prep", "Accommodation"],
  },
  processStage: {
    label: "17. Where are you in the process?",
    type: "single",
    options: ["Just starting", "Researching", "Applications in progress", "Have offer / Need visa help", "Previously applied"],
  },
  // ---- Section 4: Contact ----
  name: { label: "18. Full name", type: "text" },
  city: { label: "19. City", type: "text" },
  phone: { label: "20. WhatsApp number", type: "tel", placeholder: "+92 3xx xxxxxxx" },
  email: { label: "21. Email address", type: "email" },
  hearAbout: {
    label: "22. How did you hear about us?",
    type: "single",
    options: ["Social Media (FB / Insta / LinkedIn)", "Referral", "Google search", "Campus visit", "Word of mouth"],
  },
};

const steps: { section: string; title: string; fields: (keyof FormData)[] }[] = [
  { section: "Section 1 · Your Plans", title: "What do you want to study?", fields: ["level", "countries", "studyField", "studyFieldDetail"] },
  { section: "Section 1 · Your Plans", title: "Timeline & priorities", fields: ["startTimeline", "postDegreePlan", "priorities"] },
  { section: "Section 2 · Your Background", title: "Education & experience", fields: ["qualification", "qualificationStatus", "institutionGrades", "workExperience"] },
  { section: "Section 2 · Your Background", title: "Tests, research & documents", fields: ["englishScore", "greGmatScore", "testStatus", "researchOutput", "supervisorContact", "documentsLink", "linkedin"] },
  { section: "Section 3 · Funding & Support", title: "Funding and services", fields: ["funding", "services", "processStage"] },
  { section: "Section 4 · Contact", title: "How can we reach you?", fields: ["name", "city", "phone", "email", "hearAbout"] },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [intent, setIntent] = useState("");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("intent");
    if (!param) return;
    setIntent(param);
    if (param === "phd") setData((d) => ({ ...d, level: "PhD" }));
  }, []);

  const set = (field: keyof FormData, value: string | string[]) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const { [field]: _, ...rest } = e;
      return rest;
    });
  };

  const visibleFields = (s: number) =>
    steps[s].fields.filter((f) => {
      const cfg = FIELDS[f];
      return !cfg.showIf || cfg.showIf(data);
    });

  const validateStep = () => {
    const e: Record<string, string> = {};
    for (const f of visibleFields(step)) {
      const cfg = FIELDS[f];
      if (cfg.optional) continue;
      const val = data[f];
      if (Array.isArray(val)) {
        if (val.length === 0) e[f] = "Select at least one option";
        continue;
      }
      const trimmed = String(val ?? "").trim();
      if (!trimmed) { e[f] = "Required"; continue; }
      if (f === "email" && !/^[^@]+@[^@]+\.[^@]+$/.test(trimmed)) e[f] = "Enter a valid email";
      if (f === "phone" && !/^\+?[0-9\s\-().]{7,20}$/.test(trimmed)) e[f] = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setStatus("sending");
    // flatten arrays so each column lands as readable text in the sheet
    const payload: Record<string, string> = { intent };
    for (const [k, v] of Object.entries(data)) {
      payload[k] = Array.isArray(v) ? v.join("; ") : v;
    }
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      (window as any).fbq?.("track", "Lead");
      setStatus("done");
    } catch { setStatus("error"); }
  };

  const isLast = step === steps.length - 1;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  // ---- SUCCESS SCREEN ----
  if (status === "done") {
    return (
      <div class="rounded-2xl border border-ink/10 bg-white p-8 text-center md:p-10">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">✓</div>
        <h3 class="mt-5 text-xl font-semibold text-ink">Thank you, {data.name.split(" ")[0]}!</h3>
        <p class="mx-auto mt-2 max-w-md text-ink/70">
          Your applicant profile has been received. We'll be in touch within 1–2 working days.
          In a hurry? Reach us directly right now:
        </p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I just submitted the applicant profile form (${data.name}).`)}`}
             target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-95">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1l1.9 1c.3.1.4.2.5.3.1.2.1.8-.1 1.5z"/></svg>
            WhatsApp us
          </a>
          <a href={`mailto:${EMAIL}`}
             class="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/40">
            Email us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
      <div class="mb-6">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium uppercase tracking-widest text-primary">{steps[step].section}</span>
          <span class="text-ink/50">Step {step + 1} of {steps.length}</span>
        </div>
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div class="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h3 class="text-xl font-semibold text-ink">{steps[step].title}</h3>

      <div class="mt-6 space-y-6">
        {visibleFields(step).map((field) => (
          <Field
            key={field}
            name={field}
            data={data}
            error={errors[field]}
            onChange={(v) => set(field, v)}
          />
        ))}
      </div>

      {status === "error" && (
        <p class="mt-4 text-sm text-red-600">Something went wrong. Please try again, or WhatsApp us directly.</p>
      )}

      <div class="mt-8 flex items-center justify-between">
        <button type="button" onClick={back} disabled={step === 0}
          class="rounded-full px-6 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink disabled:invisible">← Back</button>
        {isLast ? (
          <button type="button" onClick={submit} disabled={status === "sending"}
            class="rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95 disabled:opacity-60">
            {status === "sending" ? "Submitting…" : "Submit profile"}
          </button>
        ) : (
          <button type="button" onClick={next}
            class="rounded-full bg-ink px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95">Continue →</button>
        )}
      </div>
    </div>
  );
}

// ---- FIELD RENDERER ----
function Field({ name, data, error, onChange }: {
  name: keyof FormData; data: FormData; error?: string; onChange: (v: string | string[]) => void;
}) {
  const cfg = FIELDS[name];
  const value = data[name];

  const base = "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary";
  const border = error ? "border-red-400" : "border-ink/15";

  if (cfg.type === "single" || cfg.type === "multi") {
    const selected = cfg.type === "multi" ? (value as string[]) : [value as string];
    const toggle = (opt: string) => {
      if (cfg.type === "single") {
        onChange(opt === value ? "" : opt);
        return;
      }
      const list = value as string[];
      if (list.includes(opt)) {
        onChange(list.filter((o) => o !== opt));
      } else if (!cfg.maxSelect || list.length < cfg.maxSelect) {
        onChange([...list, opt]);
      }
    };

    return (
      <div>
        <FieldLabel cfg={cfg} count={cfg.maxSelect ? `${(value as string[]).length}/${cfg.maxSelect}` : undefined} />
        <div class="flex flex-wrap gap-2">
          {cfg.options!.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button type="button" key={opt} onClick={() => toggle(opt)} aria-pressed={active}
                class={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : `${error ? "border-red-300" : "border-ink/15"} text-ink/70 hover:border-ink/40`
                }`}>
                {opt}
              </button>
            );
          })}
        </div>
        {error && <span class="mt-1.5 block text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <label class="block">
      <FieldLabel cfg={cfg} />
      <input class={`${base} ${border}`}
        type={cfg.type}
        value={value as string}
        placeholder={cfg.placeholder}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)} />
      {error && <span class="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function FieldLabel({ cfg, count }: { cfg: FieldConfig; count?: string }) {
  return (
    <span class="mb-2 block">
      <span class="block text-sm font-medium text-ink/80">
        {cfg.label}
        {count && <span class="ml-2 text-xs font-normal text-ink/50">{count} selected</span>}
      </span>
      {cfg.hint && <span class="mt-0.5 block text-xs text-ink/50">{cfg.hint}</span>}
    </span>
  );
}
