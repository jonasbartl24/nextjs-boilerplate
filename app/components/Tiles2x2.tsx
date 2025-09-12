"use client";
import React from "react";

const colors = ["#3B82F6","#F59E0B","#22C55E","#EF4444"]; // modrá, žlutá, zelená, červená

export default function Tiles2x2({
  options,
  locked,
  correctValue,
  onPick
}: {
  options: string[];
  locked: boolean;
  correctValue?: string | null;
  onPick: (val: string) => void;
}) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {options.map((opt, i) => {
        const isCorrect = locked && correctValue === opt;
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            disabled={locked}
            style={{
              padding:"16px 18px",
              borderRadius:16,
              border:`2px solid ${isCorrect? "#22C55E" : "#e5e7eb"}`,
              boxShadow:"0 2px 8px rgba(0,0,0,.06)",
              background: colors[i % colors.length],
              color:"white",
              fontSize:16,
              textAlign:"left",
              transform:"translateY(0)",
              transition:"transform 120ms ease, border-color 120ms ease",
              cursor: locked ? "default":"pointer"
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}