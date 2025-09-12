"use client";
import React from "react";

export default function ScoreBar({
  topic,
  index,
  total,
  correct,
  wrong,
  streak
}: {
  topic?: string;
  index: number;
  total: number;
  correct: number;
  wrong: number;
  streak: number;
}) {
  const pct = total ? (index / total) * 100 : 0;
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:14,opacity:.75}}>
        Téma: {topic ?? "–"} · Otázka {index + 1}/{total}
      </div>
      <div style={{display:"flex",gap:12,fontSize:14}}>
        <span>✔️ {correct}</span>
        <span>❌ {wrong}</span>
        <span>🔥 {streak}</span>
      </div>
      <div style={{gridColumn:"1 / -1",height:6,background:"#e5e7eb",borderRadius:999}}>
        <div style={{height:"100%",width:`${pct}%`,background:"#111827",borderRadius:999}}/>
      </div>
    </div>
  );
}