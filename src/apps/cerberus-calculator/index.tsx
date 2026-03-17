import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export default function CerberusCalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const handleButton = (label: string) => {
    if (label === "C") {
      setDisplay("0"); setPrev(null); setOp(null); setReset(false);
      return;
    }
    if (label === "±") { setDisplay((d) => String(-parseFloat(d))); return; }
    if (label === "%") { setDisplay((d) => String(parseFloat(d) / 100)); return; }
    if (["÷", "×", "−", "+"].includes(label)) {
      setPrev(display); setOp(label); setReset(true);
      return;
    }
    if (label === "=") {
      if (!op || prev === null) return;
      const a = parseFloat(prev), b = parseFloat(display);
      const result = op === "÷" ? a / b : op === "×" ? a * b : op === "−" ? a - b : a + b;
      setDisplay(String(result)); setPrev(null); setOp(null); setReset(false);
      return;
    }
    if (label === "." && display.includes(".")) return;
    const next = reset || display === "0" ? label : display + label;
    setDisplay(next); setReset(false);
  };

  return (
    <div className="container py-8 max-w-xs mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Button>
      </Link>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-6 text-right">
          {op && <p className="text-sm text-muted-foreground">{prev} {op}</p>}
          <p className="font-display text-4xl font-bold truncate">{display}</p>
        </div>
        <div className="grid grid-cols-4 gap-px bg-border">
          {BUTTONS.flat().map((label) => (
            <button
              key={label}
              onClick={() => handleButton(label)}
              className={[
                "py-5 text-lg font-semibold transition-colors",
                label === "0" ? "col-span-2" : "",
                label === "=" ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                ["÷", "×", "−", "+"].includes(label) ? "bg-secondary text-primary hover:bg-secondary/80" :
                ["C", "±", "%"].includes(label) ? "bg-secondary text-muted-foreground hover:bg-secondary/80" :
                "bg-card hover:bg-secondary",
              ].filter(Boolean).join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
