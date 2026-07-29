// src/components/MultiStepForm.tsx
import { useState, useEffect } from "preact/hooks";
import SearchableSelect from "./SearchableSelect";
import { COUNTRIES } from "../data/countries";

const INTENTS = [
  { value: "study-abroad", label: "Study Abroad (Bachelor's / Master's)" },
  { value: "chancenkarte", label: "Skilled Worker / Opportunity Card" },
  { value: "ausbildung", label: "Ausbildung (Vocational Training)" },
  { value: "phd", label: "PhD" },
  { value: "careers", label: "Career Mapping & Job Strategy" },
  { value: "consultation", label: "General Consultation" },
];
const DEGREE_STATUS = ["In progress", "Completed", "Not yet started"];
const APP_STAGE = ["Exploring / Researching", "Preparing documents", "Ready to apply"];
const GERMAN_LEVEL = ["N/A", "A1", "A2", "B1", "B2", "C1+"];

const WHATSAPP = "4915772312591";
const EMAIL = "[official email]"; // [CLIENT TO CONFIRM]

type FormData = {
  name: string; email: string; phone: string;
  country1: string; country2: string; country3: string;
  intake: string; intent: string; careerAddon: string; studyField: string; appStage: string;
  degreeStatus: string; cgpa: string; university: string; major: string; location: string;
  englishTest: string; euroLanguage: string;
  anythingElse: string; newsletter: boolean;
};

const initial: FormData = {
  name: "", email: "", phone: "",
  country1: "", country2: "", country3: "",
  intake: "", intent: "", careerAddon: "", studyField: "", appStage: "",
  degreeStatus: "", cgpa: "", university: "", major: "", location: "",
  englishTest: "", euroLanguage: "",
  anythingElse: "", newsletter: false,
};

const steps = [
  { section: "About You", title: "Your details", fields: ["name", "email", "phone"] },
  { section: "Your Goals", title: "Where you're headed", fields: ["country1", "country2", "country3", "intake", "intent", "careerAddon", "studyField", "appStage"] },
  { section: "Your Profile", title: "Academic profile", fields: ["degreeStatus", "cgpa", "university", "major", "location"] },
  { section: "Your Profile", title: "Language proficiency", fields: ["englishTest", "euroLanguage"] },
  { section: "Almost done", title: "Anything else?", fields: ["anythingElse", "newsletter"] },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent");
    if (intent) {
      const match = INTENTS.find((i) => i.value === intent);
      if (match) setData((d) => ({ ...d, intent: match.label }));
    }
  }, []);

  const set = (field: keyof FormData, value: string | boolean) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const { [field]: _, ...rest } = e;
      return rest;
    });
  };

  // whether the career add-on question should show
  const showCareerAddon = data.intent === "Study Abroad (Bachelor's / Master's)" || data.intent === "PhD";

  const validateStep = () => {
    const optional = ["country2", "country3", "studyField", "careerAddon", "euroLanguage", "anythingElse", "newsletter", "ielts"];
    const e: Record<string, string> = {};
    for (const f of steps[step].fields) {
      if (optional.includes(f)) continue;
      const val = String(data[f as keyof FormData] ?? "").trim();
      if (!val) e[f] = "Required";
      if (f === "email" && val && !/^[^@]+@[^@]+\.[^@]+$/.test(val)) e[f] = "Enter a valid email";
      if (f === "phone" && val && !/^\+?[0-9\s\-().]{7,20}$/.test(val)) e[f] = "Enter a valid phone number";
      if (f === "cgpa" && val && (isNaN(+val) || +val < 0 || +val > 4)) e[f] = "Enter a CGPA between 0 and 4";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
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
          Your profile has been received. We'll be in touch within 1–2 working days.
          In a hurry? Reach us directly right now:
        </p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I just submitted the form (${data.name}).`)}`}
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

      <div class="mt-6 space-y-5">
        {steps[step].fields.map((field) => {
          // conditionally hide the career add-on unless intent qualifies
          if (field === "careerAddon" && !showCareerAddon) return null;
          return (
            <Field
              key={field}
              name={field}
              data={data}
              error={errors[field]}
              onChange={(v) => set(field as keyof FormData, v)}
            />
          );
        })}
      </div>

      {status === "error" && (
        <p class="mt-4 text-sm text-red-600">Something went wrong. Please try again, or WhatsApp us directly.</p>
      )}

      <div class="mt-8 flex items-center justify-between">
        <button onClick={back} disabled={step === 0}
          class="rounded-full px-6 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink disabled:invisible">← Back</button>
        {isLast ? (
          <button onClick={submit} disabled={status === "sending"}
            class="rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95 disabled:opacity-60">
            {status === "sending" ? "Submitting…" : "Submit profile"}
          </button>
        ) : (
          <button onClick={next}
            class="rounded-full bg-ink px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95">Continue →</button>
        )}
      </div>
    </div>
  );
}

// ---- FIELD RENDERER ----
function Field({ name, data, error, onChange }: {
  name: string; data: FormData; error?: string; onChange: (v: string | boolean) => void;
}) {
  const value = data[name as keyof FormData];
  const labels: Record<string, string> = {
    name: "Full name", email: "Email address", phone: "Phone / WhatsApp number",
    country1: "Target country", country2: "Second target country (optional)", country3: "Third target country (optional)",
    intake: "Target intake (e.g. Winter 2027)", intent: "What are you applying for?",
    careerAddon: "Also interested in our Career Mapping & Job Strategy package?",
    studyField: "Field / domain you're aiming to study", appStage: "Where are you in the process?",
    degreeStatus: "Current degree status", cgpa: "Current CGPA (out of 4)", university: "University",
    major: "Majoring in", location: "Current city of residence",
    englishTest: "English test (IELTS / TOEFL / other — score if taken)",
    euroLanguage: "European language certificate (or N/A)",
    anythingElse: "Anything else you'd like to share with our team? (optional)",
    newsletter: "",
  };

  const selectMap: Record<string, { options: string[]; searchable?: boolean }> = {
    country1: { options: COUNTRIES, searchable: true },
    country2: { options: COUNTRIES, searchable: true },
    country3: { options: COUNTRIES, searchable: true },
    intent: { options: INTENTS.map((i) => i.label) },
    appStage: { options: APP_STAGE },
    degreeStatus: { options: DEGREE_STATUS },
    careerAddon: { options: ["Yes, tell me more", "No thanks"] },
  };

  const base = "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary";
  const border = error ? "border-red-400" : "border-ink/15";

  // newsletter checkbox
  if (name === "newsletter") {
    return (
      <label class="flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={value as boolean}
          onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
          class="mt-0.5 h-5 w-5 rounded border-ink/30 text-primary focus:ring-primary" />
        <span class="text-sm text-ink/70">Keep me updated with visa news, deadlines, and tips (newsletter).</span>
      </label>
    );
  }

  const selectCfg = selectMap[name];

  return (
    <label class="block">
      <span class="mb-1.5 block text-sm font-medium text-ink/80">{labels[name]}</span>
      {selectCfg ? (
        <SearchableSelect
          options={selectCfg.options}
          searchable={selectCfg.searchable}
          value={value as string}
          onChange={onChange}
          error={!!error}
        />
      ) : name === "anythingElse" ? (
        <textarea class={`${base} ${border} min-h-24 resize-y`} value={value as string}
          onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)} />
      ) : (
        <input class={`${base} ${border}`}
          type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
          value={value as string}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)} />
      )}
      {error && <span class="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}