"use client";
import React, {useMemo, useState} from "react";
import type { QuestionCloze } from "../types";

function normalize(s:string){ return s.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().trim(); }

export default function ClozeBoard({
  q,
  onSolved
}:{
  q: QuestionCloze;
  onSolved?: (result:{correct:number; wrong:number; total:number})=>void;
}) {
  // rozparsuj text na části a blanky
  const parts = useMemo(() => q.text.split("___"), [q.text]);
  const [assign, setAssign] = useState<Record<string,string>>({}); // blankId -> option
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({}); // blankId -> correct?

  const optionsLeft = useMemo(() => {
    const used = new Set(Object.values(assign));
    return q.options.filter(o => !used.has(o));
  }, [q.options, assign]);

  function placeOption(option:string) {
    // najdi první prázdný blank v pořadí
    const firstEmpty = q.blanks.find(b => !assign[b.id]);
    if (!firstEmpty) return;
    setAssign(a => ({...a, [firstEmpty.id]: option}));
  }

  function removeFromBlank(blankId:string) {
    setAssign(a => {
      const nv = {...a};
      delete nv[blankId];
      return nv;
    });
  }

  function check() {
    let correct=0, wrong=0;
    const fb: Record<string, boolean> = {};
    q.blanks.forEach(b=>{
      const val = assign[b.id];
      const ok = !!val && b.answers.some(ans => normalize(ans) === normalize(val));
      fb[b.id] = ok;
      ok? correct++ : wrong++;
    });
    setFeedback(fb);
    setLocked(true);
    onSolved?.({correct, wrong, total: q.blanks.length});
  }

  function resetWrongOnly() {
    setLocked(false);
    setFeedback({});
    setAssign(a=>{
      const nv={...a};
      q.blanks.forEach(b=>{
        if(!b.answers.some(ans=> normalize(ans)===normalize(a[b.id]||""))){
          delete nv[b.id];
        }
      });
      return nv;
    });
  }

  return (
    <div>
      {/* Text s blanky */}
      <div style={{lineHeight:1.7, fontSize:18, marginBottom:16}}>
        {parts.map((chunk, i)=>(
          <React.Fragment key={i}>
            <span>{chunk}</span>
            {i < q.blanks.length && (
              <button
                onClick={()=> !locked && assign[q.blanks[i].id] && removeFromBlank(q.blanks[i].id)}
                disabled={!assign[q.blanks[i].id]}
                title={assign[q.blanks[i].id] ? "Odebrat" : "Vyber žeton níže"}
                style={{
                  margin:"0 6px",
                  padding:"6px 10px",
                  minWidth:90,
                  borderRadius:12,
                  border:`2px solid ${
                    locked ? (feedback[q.blanks[i].id]? "#22C55E" : "#EF4444") : "#9CA3AF"
                  }`,
                  color: locked ? (feedback[q.blanks[i].id]? "#14532D" : "#7F1D1D") : "#111827",
                  background:"#F9FAFB",
                  cursor: assign[q.blanks[i].id] ? "pointer":"default"
                }}
              >
                {assign[q.blanks[i].id] || "_____"}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Zásobník žetonů */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap", marginBottom:16}}>
        {optionsLeft.map((opt,i)=>(
          <button
            key={opt}
            disabled={locked}
            onClick={()=> placeOption(opt)}
            style={{
              padding:"10px 14px",
              borderRadius:999,
              border:"2px solid #e5e7eb",
              background:"#111827",
              color:"#fff",
              fontSize:14
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Ovládání */}
      <div style={{display:"flex",gap:8}}>
        {!locked ? (
          <button onClick={check} style={{padding:"10px 14px", borderRadius:10, background:"#111827", color:"#fff"}}>Zkontrolovat</button>
        ) : (
          <>
            <button onClick={resetWrongOnly} style={{padding:"10px 14px", borderRadius:10, background:"#fff", border:"1px solid #e5e7eb"}}>Opravit chybné</button>
          </>
        )}
      </div>

      {locked && q.explain && (
        <div style={{marginTop:12, fontSize:14, color:"#374151"}}>{q.explain}</div>
      )}
    </div>
  );
}v