import { useState, useEffect } from "preact/hooks"

const INTENTS = [
    { value: "study-abroad", label: "Study Abroad (Bachelor's / Master's)" },
    { value: "chancenkarte", label: "Skilled Worker / Opportunity Card" },
    { value: "ausbildung", label: "Ausbildung (Vocational Training)" },
    { value: "phd", label: "PhD" },
    { value: "careers", label: "Career Mapping & Job Strategy" },
    { value: "consultation", label: "General Consultation" },
]
const DEGREE_STATUS = ["In progress", "Completed", "Not yet started"]
const APP_STAGE = [
    "Just exploring",
    "Researching options",
    "Preparing documents",
    "Ready to apply",
]

const GERMAN_LEVEL = ["None", "A1", "A2", "B1", "B2", "C1+"]

type FormData = {
    name: string
    email: string
    phone: string
    intake: string
    degreeStatus: string
    appStage: string
    ielts: string
    germanLevel: string
    cgpa: string
    location: string
    intent: string
    studyField: string
    helpNeeded: string
}

const initial: FormData = {
    name: "",
    email: "",
    phone: "",
    intake: "",
    degreeStatus: "",
    appStage: "",
    ielts: "",
    germanLevel: "",
    cgpa: "",
    location: "",
    intent: "",
    studyField: "",
    helpNeeded: "",
}

// step definitions: which fields live on each screen + the section label
const steps = [
    {
        section: "About You",
        title: "Your details",
        fields: ["name", "email", "phone"],
    },
    {
        section: "Your Profile",
        title: "Your timeline & stage",
        fields: ["intake", "degreeStatus", "appStage"],
    },
    {
        section: "Your Profile",
        title: "Language proficiency",
        fields: ["ielts", "germanLevel"],
    },
    {
        section: "Your Profile",
        title: "Academic profile",
        fields: ["cgpa", "location"],
    },
    {
        section: "Your Goals",
        title: "What you're aiming for",
        fields: ["intent", "studyField"],
    },
    {
        section: "Almost done",
        title: "How can we help?",
        fields: ["helpNeeded"],
    },
]

export default function MultiStepForm() {
    const [step, setStep] = useState(0)
    const [data, setData] = useState<FormData>(initial)
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
        "idle"
    )
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const intent = params.get("intent")
        if (intent && INTENTS.some((i) => i.value === intent)) {
            setData((d) => ({ ...d, intent }))
        }
    }, [])

    const set = (field: keyof FormData, value: string) => {
        setData((d) => ({ ...d, [field]: value }))
        setErrors((e) => {
            if (!e[field]) return e
            const { [field]: _, ...rest } = e
            return rest
        })
    }

    const validateStep = () => {
        const current = steps[step].fields
        const e: Record<string, string> = {}
        for (const f of current) {
            const val = data[f as keyof FormData].trim()
            if (f === "helpNeeded" || f === "studyField" || f === "ielts") continue
            if (!val) e[f] = "Required"
            if (f === "email" && val && !/^[^@]+@[^@]+\.[^@]+$/.test(val))
                e[f] = "Enter a valid email"
            if (f === "cgpa" && val && (isNaN(+val) || +val < 0 || +val > 4))
                e[f] = "Enter a CGPA between 0 and 4"
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const next = () => {
        if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1))
    }
    const back = () => setStep((s) => Math.max(s - 1, 0))

    const submit = async () => {
        if (!validateStep()) return
        setStatus("sending")
        try {
            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error("Request failed")
            setStatus("done")
        } catch {
            setStatus("error")
        }
    }

    const isLast = step === steps.length - 1
    const progress = Math.round(((step + 1) / steps.length) * 100)

    if (status === "done") {
        return (
            <div class="rounded-2xl border border-ink/10 bg-white p-10 text-center">
                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    ✓
                </div>
                <h3 class="mt-5 text-xl font-semibold text-ink">
                    Thank you, {data.name.split(" ")[0]}.
                </h3>
                <p class="mt-2 text-ink/70">
                    We've received your profile and will be in touch within 1–2
                    working days with the pathways that fit you.
                </p>
            </div>
        )
    }

    return (
        <div class="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
            {/* progress */}
            <div class="mb-6">
                <div class="flex items-center justify-between text-sm">
                    <span class="font-medium uppercase tracking-widest text-primary">
                        {steps[step].section}
                    </span>
                    <span class="text-ink/50">
                        Step {step + 1} of {steps.length}
                    </span>
                </div>
                <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                        class="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <h3 class="text-xl font-semibold text-ink">{steps[step].title}</h3>

            {/* fields for this step */}
            <div class="mt-6 space-y-5">
                {steps[step].fields.map((field) => (
                    <Field
                        key={field}
                        name={field}
                        value={data[field as keyof FormData]}
                        error={errors[field]}
                        onInput={(v) => set(field as keyof FormData, v)}
                    />
                ))}
            </div>

            {status === "error" && (
                <p class="mt-4 text-sm text-red-600">
                    Something went wrong. Please try again, or WhatsApp us
                    directly.
                </p>
            )}

            {/* nav */}
            <div class="mt-8 flex items-center justify-between">
                <button
                    onClick={back}
                    disabled={step === 0}
                    class="rounded-full px-6 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink disabled:invisible">
                    ← Back
                </button>
                {isLast ? (
                    <button
                        onClick={submit}
                        disabled={status === "sending"}
                        class="rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95 disabled:opacity-60">
                        {status === "sending"
                            ? "Submitting…"
                            : "Submit profile"}
                    </button>
                ) : (
                    <button
                        onClick={next}
                        class="rounded-full bg-ink px-8 py-2.5 text-sm font-medium text-white transition-transform hover:scale-95">
                        Continue →
                    </button>
                )}
            </div>
        </div>
    )
}

// --- single field renderer: picks input type by field name ---
function Field({
    name,
    value,
    error,
    onInput,
}: {
    name: string
    value: string
    error?: string
    onInput: (v: string) => void
}) {
    const labels: Record<string, string> = {
        name: "Full name",
        email: "Email address",
        phone: "Phone / WhatsApp number",
        intake: "Target intake (e.g. Winter 2027)",
        degreeStatus: "Degree status",
        appStage: "Where are you in the process?",
        ielts: "IELTS band (if taken)",
        germanLevel: "German level",
        cgpa: "Current CGPA (out of 4)",
        location: "Current city",
        intent: "What are you applying for?",
        studyField: "Field of study (optional)",
        helpNeeded: "Anything specific you'd like help with? (optional)",
    }
    const selects: Record<string, string[]> = {
        degreeStatus: DEGREE_STATUS,
        appStage: APP_STAGE,
        germanLevel: GERMAN_LEVEL,
        intent: INTENTS.map((i) => i.label),
    }

    const base =
        "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary"
    const border = error ? "border-red-400" : "border-ink/15"

    return (
        <label class="block">
            <span class="mb-1.5 block text-sm font-medium text-ink/80">
                {labels[name]}
            </span>
            {name === "intent" ? (
                <select
                    class={`${base} ${border}`}
                    value={value}
                    onChange={(e) =>
                        onInput((e.target as HTMLSelectElement).value)
                    }>
                    <option value="">Select…</option>
                    {INTENTS.map((i) => (
                        <option value={i.value}>{i.label}</option>
                    ))}
                </select>
            ) : selects[name] ? (
                <select
                    class={`${base} ${border}`}
                    value={value}
                    onChange={(e) =>
                        onInput((e.target as HTMLSelectElement).value)
                    }>
                    <option value="">Select…</option>
                    {selects[name].map((opt) => (
                        <option value={opt}>{opt}</option>
                    ))}
                </select>
            ) : name === "helpNeeded" ? (
                <textarea
                    class={`${base} ${border} min-h-24 resize-y`}
                    value={value}
                    onInput={(e) =>
                        onInput((e.target as HTMLTextAreaElement).value)
                    }
                />
            ) : (
                <input
                    class={`${base} ${border}`}
                    type={
                        name === "email"
                            ? "email"
                            : name === "phone"
                              ? "tel"
                              : "text"
                    }
                    value={value}
                    onInput={(e) =>
                        onInput((e.target as HTMLInputElement).value)
                    }
                />
            )}
            {error && (
                <span class="mt-1 block text-xs text-red-500">{error}</span>
            )}
        </label>
    )
}
