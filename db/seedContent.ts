export const MVP_SEED_CONTENT = {
    course: {
      slug: 'angielski-pl-en',
      title: 'Angielski',
      baseLanguage: 'pl',
      targetLanguage: 'en',
      imageUrl: null as string | null,
    },
    unit: {
      slug: 'powitanie',
      title: 'Powitania i pierwszy kontakt',
      order: 1,
      description: 'Bezpieczne powitania i zwroty do rozpoczęcia rozmowy.',
    },
    lessons: [
      // === INTRO LESSON (lessonIndex 0) ===
      {
        lessonIndex: 0,
        slug: 'plan-rozdzialu-powitania',
        title: 'Plan rozdziału',
        order: 0,
        isReview: false,
        type: 'intro' as const,
        theoryMarkdown: '',
        challenges: [],
      },
      // === LESSON 1 (FLASHCARD MODE) ===
      {
        lessonIndex: 1,
        slug: 'najprostsze-powitania',
        title: 'Najprostsze powitania',
        order: 1,
        isReview: false,
        theoryMarkdown: `
  # Najprostsze powitania

  W tej lekcji poznasz najprostsze angielskie powitania, których możesz użyć w każdej sytuacji.

  ## Bezpieczne powitania
  - **Hello** – uniwersalne, działa wszędzie
  - **Hi** – krótsze, naturalne
  - **Hey** – luźne, do znajomych
  - **Hi there** – przyjazne, cieplejsze niż samo "Hi"

  ## Rozpoczynanie rozmowy
  - **Excuse me** – grzeczne zwrócenie uwagi obcej osoby
        `.trim(),
        // Lesson 1 uses flashcards instead of quiz challenges.
        // The flashcards are defined separately and used by the FlashcardLesson component.
        challenges: [],
      },
      // === LESSON 2 (FLASHCARD MODE) ===
      {
        lessonIndex: 2,
        slug: 'powitania-wedlug-pory-dnia',
        title: 'Powitania według pory dnia',
        order: 2,
        isReview: false,
        theoryMarkdown: `
  # Powitania według pory dnia

  W tej lekcji poznasz angielskie powitania dopasowane do pory dnia.

  ## Rano
  - **Good morning** – "Dzień dobry" (rano)
  - **Morning** – krótsza, codzienna wersja

  ## Po południu
  - **Good afternoon** – "Dzień dobry" (po południu)

  ## Wieczorem
  - **Good evening** – "Dobry wieczór"
  - **Good night** – "Dobranoc" (na pożegnanie)
        `.trim(),
        // Lesson 2 uses flashcards instead of quiz challenges.
        // The flashcards are defined separately and used by the FlashcardLesson component.
        challenges: [],
      },
      // === LESSON 3 (FLASHCARD MODE) ===
      {
        lessonIndex: 3,
        slug: 'jak-sie-masz',
        title: 'Jak się masz?',
        order: 3,
        isReview: false,
        theoryMarkdown: `
  # Jak się masz?

  W tej lekcji poznasz angielskie zwroty pytające o samopoczucie – od formalnych po bardzo codzienne.

  ## Podstawowe pytania
  - **How are you?** – "Jak się masz?" (uniwersalne)
  - **How are you doing?** – "Jak się miewasz?" (bardziej naturalne)
  - **How's it going?** – "Jak leci?" (luźne)

  ## Gdy dawno się nie widzieliście
  - **How have you been?** – "Co u ciebie słychać?"

  ## Bardzo luźne
  - **What's up?** – "Co tam?"
        `.trim(),
        // Lesson 3 uses flashcards instead of quiz challenges.
        // The flashcards are defined separately and used by the FlashcardLesson component.
        challenges: [],
      },
      // === LESSON 4 (FLASHCARD MODE) ===
      {
        lessonIndex: 4,
        slug: 'krotkie-odpowiedzi',
        title: 'Krótkie odpowiedzi',
        order: 4,
        isReview: false,
        theoryMarkdown: `
  # Krótkie odpowiedzi

  W tej lekcji poznasz krótkie odpowiedzi na pytanie "How are you?" i podobne zwroty.

  ## Podstawowe odpowiedzi
  - **I'm good, thanks.** – "Mam się dobrze, dzięki."
  - **I'm fine, thanks.** – "Mam się dobrze, dzięki." (grzeczna wersja)
  - **Pretty good.** – "Całkiem dobrze."
  - **Not bad.** – "Nieźle."

  ## Odwzajemnienie pytania
  - **I'm good, thanks. And you?** – odpowiedź + pytanie
  - **And you?** – "A ty?"
  - **How about you?** – "A co u ciebie?"
        `.trim(),
        // Lesson 4 uses flashcards instead of quiz challenges.
        // The flashcards are defined separately and used by the FlashcardLesson component.
        challenges: [],
      },
      // === LESSON 5 (FLASHCARD MODE) ===
      {
        lessonIndex: 5,
        slug: 'pierwsze-spotkanie',
        title: 'Pierwsze spotkanie',
        order: 5,
        isReview: false,
        theoryMarkdown: `
  # Pierwsze spotkanie

  W tej lekcji poznasz zwroty przydatne podczas pierwszego spotkania z nową osobą.

  ## Przedstawianie się
  - **Hi, I'm Anna.** – "Cześć, jestem Anna."
  - **Hello, I'm Anna.** – "Dzień dobry, jestem Anna."

  ## Rozpoznawanie osoby
  - **You must be Tom.** – "Ty pewnie jesteś Tom."

  ## Reakcje na poznanie
  - **Nice to meet you.** – "Miło cię poznać."
  - **Nice to meet you too.** – "Miło mi też cię poznać."
  - **You too.** – "Ciebie też."

  ## Przedstawianie kogoś
  - **This is Anna.** – "To jest Anna."

  ## Powitanie w grupie
  - **Welcome.** – "Witaj."
        `.trim(),
        // Lesson 5 uses flashcards instead of quiz challenges.
        // The flashcards are defined separately and used by the FlashcardLesson component.
        challenges: [],
      },
      // === LESSON 6 (DIALOG MODE – Boss fight) ===
      {
        lessonIndex: 6,
        slug: 'mini-dialogi-koncowe',
        title: 'Mini-dialogi końcowe',
        order: 6,
        isReview: false,
        theoryMarkdown: `
  # Boss fight: Mini-dialogi końcowe

  W tej lekcji sprawdzisz swoje umiejętności w praktyce – prowadząc mini-dialogi po angielsku.

  ## Zasady
  - System pokazuje wypowiedź rozmówcy,
  - Ty wpisujesz odpowiedź po angielsku,
  - Odpowiedź musi pasować do jednej z zaakceptowanych wersji,
  - Możesz skorzystać z podpowiedzi lub pominąć pytanie.

  Powodzenia!
        `.trim(),
        // Lesson 6 uses dialog mode instead of flashcards or quiz challenges.
        // The dialog data is defined separately and used by the DialogLesson component.
        challenges: [],
      },
    ],
  } as const;
