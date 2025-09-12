"use client";
import { useEffect, useMemo, useState } from "react";
import type { AnyQuestion, QuestionCloze, QuestionMCQ } from "../../types";
import ScoreBar from "../../components/ScoreBar";
import Tiles2x2 from "../../components/Tiles2x2";
import ClozeBoard from "../../components/ClozeBoard";

export default function PlayModePage({ params }: { params: { mode: string } }) {
  const mode = params.mode as "mcq" | "cloze";
  const [data, setData] = useState<AnyQuestion[]>([]);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    fetch("/questions.json").then(r=>r.json()).then((arr:AnyQuestion[])=>{
      setData(arr.filter(q => q.type === mode));
    });
  }, [mode]);

  const q = data[i];

  function next() {
    setPicked(null);
    setLocked(false);
    setI(i+1);
  }

  if (!q) return <div className="p-6">Načítám… nebo pro tento režim zatím nemáš otázky.</div>;

  return (
    <main style={{maxWidth:880, margin:"24px auto", padding:"0 16px"}}>
      <ScoreBar
        topic={q.topic}
        index={i}
        total={data.length}
        correct={correct}
        wrong={wrong}
        streak={streak}
      />

      {q.type === "mcq" && (
        <>
          <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>{(q as QuestionMCQ).question}</h1>
          <Tiles2x2
            options={(q as QuestionMCQ).options}
            locked={locked}
            correctValue={locked ? (q as QuestionMCQ).answer : null}
            onPick={(val)=>{
              if (locked) return;
              const ok = val === (q as QuestionMCQ).answer;
              setPicked(val);
              setLocked(true);
              if (ok){ setCorrect(c=>c+1); setStreak(s=>s+1); }
              else { setWrong(w=>w+1); setStreak(0); }
            }}
          />
          {locked && (
            <div style={{marginTop:12}}>
              {(q as QuestionMCQ).explain && <div style={{fontSize:14, color:"#374151"}}>{(q as QuestionMCQ).explain}</div>}
              {i+1 < data.length ? (
                <button onClick={next} style={{marginTop:10,padding:"10px 14px", borderRadius:10, background:"#fff", border:"1px solid #e5e7eb"}}>Další otázka</button>
              ) : (
                <div style={{marginTop:10, fontSize:16, fontWeight:600}}>Hotovo! ✔️ {correct} · ❌ {wrong}</div>
              )}
            </div>
          )}
        </>
      )}

      {q.type === "cloze" && (
        <>
          <ClozeBoard
            q={q as QuestionCloze}
            onSolved={({correct:ok, wrong:bad})=>{
              setCorrect(c=>c+ok);
              setWrong(w=>w+bad);
              setStreak(ok === (q as QuestionCloze).blanks.length ? (streak+1) : 0);
              setLocked(true);
            }}
          />
          {locked && (
            <div style={{marginTop:12}}>
              {i+1 < data.length ? (
                <button onClick={next} style={{padding:"10px 14px", borderRadius:10, background:"#fff", border:"1px solid #e5e7eb"}}>Další otázka</button>
              ) : (
                <div style={{marginTop:10, fontSize:16, fontWeight:600}}>Hotovo! ✔️ {correct} · ❌ {wrong}</div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}