// Flashcard data for Lesson 1: "Najprostsze powitania"
// Each flashcard has a unique id, Polish phrase (front), English phrase (back), and usage hint.

export type FlashcardStatus = "hard" | "learning" | "known";

export interface Flashcard {
  id: string;
  front: string; // Polish phrase to translate
  back: string;  // English phrase
  hint?: string; // Optional usage hint shown below the front text
}

export interface FlashcardResult {
  flashcardId: string;
  status: FlashcardStatus;
}

export const LESSON_1_FLASHCARDS: Flashcard[] = [
  {
    id: "G1-01",
    front: "Cześć.",
    back: "Hello.",
    hint: "Najbezpieczniejsze powitanie. Używaj prawie wszędzie: w sklepie, pracy, hotelu, na ulicy.",
  },
  {
    id: "G1-02",
    front: "Cześć.",
    back: "Hi.",
    hint: "Krótkie, naturalne powitanie. Dobre w większości codziennych sytuacji.",
  },
  {
    id: "G1-03",
    front: "Hej.",
    back: "Hey.",
    hint: "Luźne powitanie do znajomych, rówieśników albo osób, z którymi masz swobodną relację.",
  },
  {
    id: "G1-04",
    front: "Cześć.",
    back: "Hi there.",
    hint: "Przyjazne powitanie, trochę cieplejsze niż samo „Hi”.",
  },
  {
    id: "G1-05",
    front: "Przepraszam.",
    back: "Excuse me.",
    hint: "Gdy podchodzisz do obcej osoby i chcesz zacząć grzecznie, np. zapytać o drogę.",
  },
];

export const LESSON_2_FLASHCARDS: Flashcard[] = [
  {
    id: "G2-01",
    front: "Dzień dobry.",
    back: "Good morning.",
    hint: "Grzeczne powitanie rano. Dobre w pracy, hotelu, kawiarni i codziennych sytuacjach.",
  },
  {
    id: "G2-02",
    front: "Dobrego ranka.",
    back: "Morning.",
    hint: "Krótsza, bardziej codzienna wersja porannego powitania.",
  },
  {
    id: "G2-03",
    front: "Dzień dobry.",
    back: "Good afternoon.",
    hint: "Grzeczne powitanie po południu. Brzmi trochę bardziej formalnie.",
  },
  {
    id: "G2-04",
    front: "Dobry wieczór.",
    back: "Good evening.",
    hint: "Grzeczne powitanie wieczorem, gdy spotykasz kogoś lub zaczynasz rozmowę.",
  },
  {
    id: "G2-05",
    front: "Dobranoc.",
    back: "Good night.",
    hint: "Używaj głównie na pożegnanie wieczorem lub przed snem, nie jako zwykłe powitanie.",
  },
];

export const LESSON_3_FLASHCARDS: Flashcard[] = [
  {
    id: "G3-01",
    front: "Jak się masz?",
    back: "How are you?",
    hint: "Najprostsze i najbezpieczniejsze pytanie po powitaniu.",
  },
  {
    id: "G3-02",
    front: "Jak się miewasz?",
    back: "How are you doing?",
    hint: "Bardziej naturalna, codzienna wersja pytania „jak się masz?”.",
  },
  {
    id: "G3-03",
    front: "Jak leci?",
    back: "How's it going?",
    hint: "Luźne pytanie „jak leci?”. Używaj ze znajomymi lub w swobodnej rozmowie.",
  },
  {
    id: "G3-04",
    front: "Co tam?",
    back: "What's up?",
    hint: "Bardzo luźne „co tam?”. Dobre do znajomych, nie do formalnych rozmów.",
  },
  {
    id: "G3-05",
    front: "Co u ciebie słychać?",
    back: "How have you been?",
    hint: "Gdy pytasz kogoś, kogo dawno nie widziałeś.",
  },
];

export const LESSON_4_FLASHCARDS: Flashcard[] = [
  {
    id: "G4-01",
    front: "Mam się dobrze, dzięki.",
    back: "I'm good, thanks.",
    hint: "Najbezpieczniejsza krótka odpowiedź na „How are you?”.",
  },
  {
    id: "G4-02",
    front: "Mam się dobrze, dzięki.",
    back: "I'm fine, thanks.",
    hint: "Grzeczna, neutralna odpowiedź. Dobra prawie wszędzie.",
  },
  {
    id: "G4-03",
    front: "Całkiem dobrze.",
    back: "Pretty good.",
    hint: "Naturalna, luźna odpowiedź: „całkiem dobrze”.",
  },
  {
    id: "G4-04",
    front: "Nieźle.",
    back: "Not bad.",
    hint: "Naturalna odpowiedź, gdy jest w porządku, ale bez entuzjazmu.",
  },
  {
    id: "G4-05",
    front: "Mam się dobrze, dzięki. A ty?",
    back: "I'm good, thanks. And you?",
    hint: "Gdy chcesz odpowiedzieć i od razu zapytać drugą osobę.",
  },
  {
    id: "G4-06",
    front: "A ty?",
    back: "And you?",
    hint: "Krótkie odbicie pytania: „a ty?”.",
  },
  {
    id: "G4-07",
    front: "A co u ciebie?",
    back: "How about you?",
    hint: "Trochę pełniejsza wersja „a ty?”.",
  },
];

export const LESSON_5_FLASHCARDS: Flashcard[] = [
  {
    id: "M01",
    front: "Cześć, jestem Anna.",
    back: "Hi, I'm Anna.",
    hint: "Gdy pierwszy raz mówisz komuś, kim jesteś.",
  },
  {
    id: "M02",
    front: "Dzień dobry, jestem Anna.",
    back: "Hello, I'm Anna.",
    hint: "Bardziej neutralne przedstawienie się.",
  },
  {
    id: "M03",
    front: "Ty pewnie jesteś Tom.",
    back: "You must be Tom.",
    hint: "Gdy rozpoznajesz osobę, z którą miałeś się spotkać.",
  },
  {
    id: "M04",
    front: "Miło cię poznać.",
    back: "Nice to meet you.",
    hint: "Klasyczny zwrot przy pierwszym poznaniu.",
  },
  {
    id: "M05",
    front: "Miło mi też cię poznać.",
    back: "Nice to meet you too.",
    hint: "Odpowiedź na „Nice to meet you”.",
  },
  {
    id: "M06",
    front: "Ciebie też.",
    back: "You too.",
    hint: "Krótka odpowiedź, bardzo naturalna w rozmowie.",
  },
  {
    id: "M07",
    front: "To jest Anna.",
    back: "This is Anna.",
    hint: "Gdy przedstawiasz komuś inną osobę.",
  },
  {
    id: "M08",
    front: "Witaj.",
    back: "Welcome.",
    hint: "Gdy chcesz przywitać kogoś w grupie lub miejscu.",
  },
];

// -----------------------------------------------------------------------------
// LESSON 6 – Dialog data (Boss fight: Mini-dialogi końcowe)
// -----------------------------------------------------------------------------

export interface DialogTurn {
  speaker: "system" | "user";
  text?: string; // system text
  expected?: string; // expected correct answer (for user turns)
  acceptedAnswers?: string[]; // list of accepted answers (for user turns)
  hint?: string; // hint shown on request (for user turns)
}

export interface Dialog {
  id: string;
  title: string;
  turns: DialogTurn[];
}

export const LESSON_6_DIALOGS: Dialog[] = [
  {
    id: "D01",
    title: "Proste powitanie",
    turns: [
      {
        speaker: "system",
        text: "Hi.",
      },
      {
        speaker: "user",
        expected: "Hello.",
        acceptedAnswers: ["Hello.", "Hi.", "Hey."],
        hint: "Odpowiedz prostym powitaniem.",
      },
      {
        speaker: "system",
        text: "How are you?",
      },
      {
        speaker: "user",
        expected: "I'm good, thanks. And you?",
        acceptedAnswers: [
          "I'm good, thanks. And you?",
          "I'm good, thanks. And you?",
          "I am good, thanks. And you?",
          "I'm fine, thanks. And you?",
          "I'm fine, thanks. And you?",
          "I'm fine. How are you?",
          "I'm good. How are you?",
          "I'm fine, how are you?",
          "I'm good, how are you?",
          "Fine, thanks. And you?",
          "Good, thanks. And you?",
          "Fine. How are you?",
          "Good. How are you?",
          "Not bad. And you?",
          "Pretty good. How are you?",
        ],
        hint: "Odpowiedz krótko, że masz się dobrze, i odbij pytanie.",
      },
    ],
  },
  {
    id: "D02",
    title: "Luźna rozmowa",
    turns: [
      {
        speaker: "system",
        text: "Hey.",
      },
      {
        speaker: "user",
        expected: "Hey.",
        acceptedAnswers: ["Hey.", "Hi.", "Hello."],
        hint: "Odpowiedz luźnym powitaniem.",
      },
      {
        speaker: "system",
        text: "How's it going?",
      },
      {
        speaker: "user",
        expected: "Pretty good. How about you?",
        acceptedAnswers: [
          "Pretty good. How about you?",
          "Pretty good, how about you?",
          "Pretty good. And you?",
          "Good. How about you?",
          "Good. And you?",
          "Not bad. How about you?",
          "Not bad. And you?",
          "I'm good. How about you?",
          "I'm fine. How about you?",
        ],
        hint: "Powiedz, że całkiem dobrze, i zapytaj drugą osobę.",
      },
    ],
  },
  {
    id: "D03",
    title: "Pierwsze spotkanie",
    turns: [
      {
        speaker: "system",
        text: "Hi, I'm Anna.",
      },
      {
        speaker: "user",
        expected: "Nice to meet you.",
        acceptedAnswers: [
          "Nice to meet you.",
          "Nice to meet you, Anna.",
          "Hi Anna, nice to meet you.",
          "Hello Anna, nice to meet you.",
        ],
        hint: "Użyj klasycznego zwrotu przy pierwszym poznaniu.",
      },
      {
        speaker: "system",
        text: "Nice to meet you too.",
      },
    ],
  },
  {
    id: "D04",
    title: "Spotkanie po czasie",
    turns: [
      {
        speaker: "system",
        text: "Hi there.",
      },
      {
        speaker: "user",
        expected: "Hey.",
        acceptedAnswers: ["Hey.", "Hi.", "Hello.", "Hi there."],
        hint: "Odpowiedz prostym, luźnym powitaniem.",
      },
      {
        speaker: "system",
        text: "How have you been?",
      },
      {
        speaker: "user",
        expected: "Not bad. And you?",
        acceptedAnswers: [
          "Not bad. And you?",
          "Not bad, and you?",
          "Pretty good. And you?",
          "I'm good. And you?",
          "I'm good. And you?",
          "I'm fine. And you?",
          "Good. And you?",
          "Fine. And you?",
          "Not bad. How about you?",
          "Pretty good. How about you?",
        ],
        hint: "Odpowiedz krótko i odbij pytanie.",
      },
    ],
  },
];
