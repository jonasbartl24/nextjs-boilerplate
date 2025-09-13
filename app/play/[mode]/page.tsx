"use client";
import { useEffect, useMemo, useState } from "react";
import type { AnyQuestion, QuestionCloze, QuestionMCQ } from "../../types";
import ScoreBar from "../../components/ScoreBar";
import Tiles2x2 from "../../components/Tiles2x2";
import ClozeBoard from "../../components/ClozeBoard";

export default function PlayModePage({ params }: { params: { mode: string } }) {
  const mode = params.mode as "mcq" | "cloze";

  const [all, setAll] = useState<AnyQuestion[]>([]);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [locked, setLocked] = useState(false); // = zodpovězeno
  const [picked, setPicked] = useState<string | null>(null);

  // načti data a filtruj podle režimu
  useEffect(() => {
    fetch("/questions.json")
      .then((r) => r.json())
      .then((arr: AnyQuestion[]) => {
        setAll(arr.filter((q) => q.type === mode));
        setI(0);
        setCorrect(0);
        setWrong(0);
        setStreak(0);
        setLocked(false);
        setPicked(null);
      });
  }, [mode]);

  // omezíme na max 10 otázek
  const data = useMemo(() => all.slice(0, 10), [all]);
  const total = data.length;
  const q = data[i];

  function next() {
    if (i + 1 < total) {
      setPicked(null);
      setLocked(false);
      setI((x) => x + 1);
    }
  }

  if (!q) return <div className="p-6">Načítám… nebo pro tento režim zatím nemáš otázky.</div>;

  const finished = i + 1 >= total && locked;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  return (
    <main style={{ maxWidth: 880, margin: "24px auto", padding: "0 16px" }}>
      <ScoreBar topic={q.topic} index={i} total={total} correct={correct} wrong={wrong} streak={streak} />

      {/* TĚLO OTÁZKY */}
      {q.type === "mcq" && (
        <>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            {(q as QuestionMCQ).question}
          </h1>
          <Tiles2x2
            options={(q as QuestionMCQ).options}
            locked={locked}
            correctValue={locked ? (q as QuestionMCQ).answer : null}
            onPick={(val) => {
              if (locked) return;
              const ok = val === (q as QuestionMCQ).answer;
              setPicked(val);
              setLocked(true);
              if (ok) {
                setCorrect((c) => c + 1);
                setStreak((s) => s + 1);
              } else {
                setWrong((w) => w + 1);
                setStreak(0);
              }
            }}
          />
          {locked && (q as QuestionMCQ).explain && (
            <div style={{ marginTop: 12, fontSize: 14, color: "#374151" }}>{(q as QuestionMCQ).explain}</div>
          )}
        </>
      )}

      {q.type === "cloze" && (
        <>
          <ClozeBoard
            q={q as QuestionCloze}
            onSolved={({ correct: ok, wrong: bad }) => {
              if (locked) return;
              setCorrect((c) => c + ok);
              setWrong((w) => w + bad);
              // plný zásah do všech blanků = +1 do série
              setStreak(ok === (q as QuestionCloze).blanks.length ? streak + 1 : 0);
              setLocked(true);
            }}
          />
          {locked && q.explain && (
            <div style={{ marginTop: 12, fontSize: 14, color: "#374151" }}>{q.explain}</div>
          )}
        </>
      )}

      {/* FOOTER: DALŠÍ / VÝSLEDKY */}
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
        {!finished ? (
          <button
            onClick={next}
            disabled={!locked}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: locked ? "#111827" : "#9CA3AF",
              color: "#fff",
              border: "none",
              cursor: locked ? "pointer" : "not-allowed",
              opacity: locked ? 1 : 0.8,
              transition: "transform 120ms ease",
            }}
          >
            Další
          </button>
        ) : (
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            Hotovo! ✔️ {correct} · ❌ {wrong} · {percent} %
          </div>
        )}
      </div>
    </main>
  );
}