"use client";
import { useState } from "react";

export default function QuizCZ() {
  const questions = [
    {
      id: "q1",
      question: "Kdo napsal drama R.U.R.?",
      options: ["Karel Čapek", "Josef Čapek", "Franz Kafka"],
      answer: "Karel Čapek",
    },
    {
      id: "q2",
      question: "Čapkův román Válka s ___ je satira na společnost.",
      options: ["kočkami", "mloky", "psy"],
      answer: "mloky",
    },
  ];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const q = questions[index];

  function handleAnswer(opt: string) {
    if (answered) return;
    if (opt === q.answer) setScore(score + 1);
    setAnswered(true);
  }

  function next() {
    setIndex(index + 1);
    setAnswered(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Otázka {index + 1} / {questions.length}</h2>
      <p>{q.question}</p>
      {q.options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleAnswer(opt)}
          style={{ display: "block", margin: "0.5rem 0" }}
        >
          {opt}
        </button>
      ))}

      {answered && (
        <div>
          <p>
            {q.answer === q.options.find((o) => o === q.answer)
              ? `Správná odpověď: ${q.answer}`
              : "Chyba"}
          </p>
          {index + 1 < questions.length ? (
            <button onClick={next}>Další otázka</button>
          ) : (
            <p>Hotovo! Skóre: {score}/{questions.length}</p>
          )}
        </div>
      )}
    </div>
  );
}