// Flashcard data for Lesson 1: "Start rozmowy: najbezpieczniejsze powitania"
// Each flashcard has a unique id, Polish context/description (front), and English phrase (back).

export type FlashcardStatus = "hard" | "learning" | "known";

export interface Flashcard {
  id: string;
  front: string; // Polish description/context
  back: string;  // English phrase
}

export interface FlashcardResult {
  flashcardId: string;
  status: FlashcardStatus;
}

export const LESSON_1_FLASHCARDS: Flashcard[] = [
  {
    id: "G01",
    front: "Najbardziej uniwersalne powitanie. Działa w sklepie, pracy, hotelu, na ulicy i w wiadomości. Bezpieczny pierwszy wybór.",
    back: "Hello.",
  },
  {
    id: "G02",
    front: "Krótsze i trochę luźniejsze powitanie. Dobre do znajomych, kolegów z pracy, obsługi w kawiarni i codziennych sytuacji.",
    back: "Hi.",
  },
  {
    id: "G03",
    front: "Przyjazne, lekkie powitanie. Dobre, gdy chcesz brzmieć naturalnie, ale nie przesadnie formalnie.",
    back: "Hi there.",
  },
  {
    id: "G04",
    front: "Bardzo luźne powitanie. Używaj do znajomych, rówieśników albo osób, z którymi masz swobodną relację.",
    back: "Hey.",
  },
  {
    id: "G05",
    front: "Grzeczne rozpoczęcie rozmowy, gdy podchodzisz do obcej osoby i chcesz o coś zapytać.",
    back: "Excuse me.",
  },
  {
    id: "G06",
    front: "Powitanie, gdy zaczynasz rozmowę i chcesz od razu przejść do prośby lub pytania.",
    back: "Hello, can I ask you something?",
  },
  {
    id: "G07",
    front: "Przyjazne powitanie, gdy widzisz kogoś, kogo już znasz.",
    back: "Good to see you.",
  },
  {
    id: "G08",
    front: "Bardziej naturalna wersja, gdy cieszysz się, że znowu kogoś widzisz.",
    back: "Nice to see you.",
  },
];
