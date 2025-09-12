export type QType = "mcq" | "cloze";

export type QuestionBase = {
  id: string;
  topic?: string;
  type: QType;
  difficulty?: 1 | 2 | 3;
  explain?: string;
  evidence?: { source?: string; page?: number };
};

export type QuestionMCQ = QuestionBase & {
  type: "mcq";
  question: string;
  options: string[];
  answer: string;
};

export type ClozeBlank = { id: string; answers: string[]; count?: number };
export type QuestionCloze = QuestionBase & {
  type: "cloze";
  text: string;         // obsahuje ___ pro každý blank (pořadí = blanks)
  blanks: ClozeBlank[];
  options: string[];    // bazének „žetonů“ (správné + distraktory)
};

export type AnyQuestion = QuestionMCQ | QuestionCloze;