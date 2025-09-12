"use client";
import Link from "next/link";

export default function Page() {
  return (
    <main style={{maxWidth:880, margin:"24px auto", padding:"0 16px"}}>
      <h1 style={{fontSize:28, fontWeight:800, marginBottom:8}}>Vyber typ hry</h1>
      <p style={{opacity:.75, marginBottom:20}}>MCQ (výběr), nebo Doplňovačka s „žetony“. Další módy doplníme později.</p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <Link href="/play/mcq" style={{
          display:"block", padding:"18px", borderRadius:16, border:"2px solid #e5e7eb",
          boxShadow:"0 2px 8px rgba(0,0,0,.06)", background:"#3B82F6", color:"#fff", textDecoration:"none"
        }}>
          🟦 Klasický kvíz (MCQ)
        </Link>

        <Link href="/play/cloze" style={{
          display:"block", padding:"18px", borderRadius:16, border:"2px solid #e5e7eb",
          boxShadow:"0 2px 8px rgba(0,0,0,.06)", background:"#22C55E", color:"#fff", textDecoration:"none"
        }}>
          🟩 Doplňovačka (Cloze)
        </Link>
      </div>
    </main>
  );
}