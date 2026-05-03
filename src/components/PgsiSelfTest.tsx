import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, RotateCcw } from "lucide-react";

// Problem Gambling Severity Index (PGSI) — 9 validated questions
const QUESTIONS = [
  "Have you bet more than you could really afford to lose?",
  "Have you needed to gamble with larger amounts to get the same excitement?",
  "Have you gone back another day to try and win back money you lost?",
  "Have you borrowed money or sold anything to get money to gamble?",
  "Have you felt that you might have a problem with gambling?",
  "Has gambling caused you any health problems, including stress or anxiety?",
  "Have people criticised your betting or told you you had a gambling problem?",
  "Has your gambling caused any financial problems for you or your household?",
  "Have you felt guilty about the way you gamble or what happens when you gamble?",
];

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Most of the time", value: 2 },
  { label: "Almost always", value: 3 },
];

const interpret = (score: number) => {
  if (score === 0) return { band: "No risk", tone: "text-success", advice: "Keep betting for fun. Stay within your limits." };
  if (score <= 2) return { band: "Low risk", tone: "text-success", advice: "Low level of problems with few or no identified consequences." };
  if (score <= 7) return { band: "Moderate risk", tone: "text-warning", advice: "Moderate problems leading to some negative consequences. Consider setting deposit limits." };
  return { band: "Problem gambling", tone: "text-destructive", advice: "Strongly recommend self-exclusion and contacting NCPG on 0800 006 008." };
};

const PgsiSelfTest = () => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce<number>((s, v) => s + (v ?? 0), 0);
  const complete = answers.every((a) => a !== null);
  const result = interpret(score);

  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="text-primary" />
        <h3 className="font-display text-xl">Self-Assessment (PGSI)</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        In the past 12 months, how often have any of these things happened?
      </p>

      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="border border-border rounded-lg p-3">
            <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
            <div className="flex flex-wrap gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    const next = [...answers];
                    next[i] = o.value;
                    setAnswers(next);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    answers[i] === o.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => setSubmitted(true)} disabled={!complete}>See My Result</Button>
        <Button variant="ghost" onClick={reset}><RotateCcw size={14} className="mr-1" /> Reset</Button>
      </div>

      {submitted && complete && (
        <div className="mt-5 p-4 rounded-lg bg-muted/40 border border-border">
          <p className="text-xs uppercase text-muted-foreground">Your score</p>
          <p className="font-display text-2xl">{score} / 27 — <span className={result.tone}>{result.band}</span></p>
          <p className="text-sm text-muted-foreground mt-2">{result.advice}</p>
          <p className="text-xs text-muted-foreground mt-3">
            This is an indicative screening tool, not a clinical diagnosis. For confidential support call NCPG on{" "}
            <a href="tel:0800006008" className="text-primary font-bold">0800 006 008</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default PgsiSelfTest;
