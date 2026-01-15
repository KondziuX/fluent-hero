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
      title: 'Powitanie',
      order: 1,
      description: 'Podstawowe zwroty na start.',
    },
    lessons: [
      // === LESSON 1 ===
      {
        lessonIndex: 1,
        slug: 'czesc-i-pa',
        title: 'Cześć i pa',
        order: 1,
        isReview: false,
        theoryMarkdown: `
  # Cześć i pa
  
  W tej lekcji poznasz podstawowe **powitania** i **pożegnania**.
  
  ## Powitania
  - **Hello** – neutralne "cześć" (bezpieczne w każdej sytuacji)
  - **Hi** – bardziej nieformalne "cześć"
  
  ## Pożegnania
  - **Goodbye** – bardziej formalne "do widzenia"
  - **Bye** / **Bye-bye** – nieformalne "pa"
  
  > Pro tip: "Good morning / afternoon / evening" poznasz później.
        `.trim(),
        challenges: [
          {
            key: 'L1_Q01',
            type: 'SELECT',
            order: 1,
            prompt: 'Przetłumacz na angielski: „Cześć”.',
            options: [
              { key: 'L1_Q01_A', order: 1, text: 'Hello', isCorrect: true },
              { key: 'L1_Q01_B', order: 2, text: 'Goodbye', isCorrect: false },
              { key: 'L1_Q01_C', order: 3, text: 'Thanks', isCorrect: false },
              { key: 'L1_Q01_D', order: 4, text: 'Sorry', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q02',
            type: 'SELECT',
            order: 2,
            prompt: 'Przetłumacz na angielski: „Cześć” (bardziej nieformalnie).',
            options: [
              { key: 'L1_Q02_A', order: 1, text: 'Hi', isCorrect: true },
              { key: 'L1_Q02_B', order: 2, text: 'Hello', isCorrect: false },
              { key: 'L1_Q02_C', order: 3, text: 'Bye', isCorrect: false },
              { key: 'L1_Q02_D', order: 4, text: 'Please', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q03',
            type: 'SELECT',
            order: 3,
            prompt: 'Przetłumacz na angielski: „Do widzenia” (bardziej formalnie).',
            options: [
              { key: 'L1_Q03_A', order: 1, text: 'Goodbye', isCorrect: true },
              { key: 'L1_Q03_B', order: 2, text: 'Bye', isCorrect: false },
              { key: 'L1_Q03_C', order: 3, text: 'Hello', isCorrect: false },
              { key: 'L1_Q03_D', order: 4, text: 'Good morning', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q04',
            type: 'SELECT',
            order: 4,
            prompt: 'Przetłumacz na angielski: „Pa” (nieformalnie).',
            options: [
              { key: 'L1_Q04_A', order: 1, text: 'Bye', isCorrect: true },
              { key: 'L1_Q04_B', order: 2, text: 'Goodbye', isCorrect: false },
              { key: 'L1_Q04_C', order: 3, text: 'Hi', isCorrect: false },
              { key: 'L1_Q04_D', order: 4, text: 'No', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q05',
            type: 'SELECT',
            order: 5,
            prompt: 'Wybierz bardziej formalne pożegnanie.',
            options: [
              { key: 'L1_Q05_A', order: 1, text: 'Goodbye', isCorrect: true },
              { key: 'L1_Q05_B', order: 2, text: 'Bye', isCorrect: false },
              { key: 'L1_Q05_C', order: 3, text: 'Hi', isCorrect: false },
              { key: 'L1_Q05_D', order: 4, text: 'Great!', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q06',
            type: 'SELECT',
            order: 6,
            prompt: 'Wybierz bardziej nieformalne powitanie.',
            options: [
              { key: 'L1_Q06_A', order: 1, text: 'Hi', isCorrect: true },
              { key: 'L1_Q06_B', order: 2, text: 'Hello', isCorrect: false },
              { key: 'L1_Q06_C', order: 3, text: 'Goodbye', isCorrect: false },
              { key: 'L1_Q06_D', order: 4, text: 'Not bad.', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q07',
            type: 'SELECT',
            order: 7,
            prompt: 'Przetłumacz na angielski: „Hej!”.',
            options: [
              { key: 'L1_Q07_A', order: 1, text: 'Hi', isCorrect: true },
              { key: 'L1_Q07_B', order: 2, text: 'Goodbye', isCorrect: false },
              { key: 'L1_Q07_C', order: 3, text: 'Sorry', isCorrect: false },
              { key: 'L1_Q07_D', order: 4, text: 'Thanks', isCorrect: false },
            ],
          },
          {
            key: 'L1_Q08',
            type: 'SELECT',
            order: 8,
            prompt: 'Przetłumacz na angielski: „Witaj” (neutralnie).',
            options: [
              { key: 'L1_Q08_A', order: 1, text: 'Hello', isCorrect: true },
              { key: 'L1_Q08_B', order: 2, text: 'Bye', isCorrect: false },
              { key: 'L1_Q08_C', order: 3, text: 'Goodbye', isCorrect: false },
              { key: 'L1_Q08_D', order: 4, text: 'Please', isCorrect: false },
            ],
          },
        ],
      },
      // === LESSON 2 ===
      {
        lessonIndex: 2,
        slug: 'jak-sie-masz',
        title: 'Jak się masz?',
        order: 2,
        isReview: false,
        theoryMarkdown: `
  # Jak się masz?
  
  Najważniejsze pytanie to:
  - **How are you?** – "Jak się masz?"
  
  Typowe odpowiedzi:
  - **I'm fine.** – "Dobrze / w porządku."
  - **I'm good.** – "Dobrze."
  - **I'm OK.** – "W porządku."
  - **Great!** – "Świetnie!"
  - **Not bad.** – "Nieźle."
  
  Mini-reguła:
  - **I'm ...** = "Jestem / Mam się..." (w kontekście samopoczucia).
        `.trim(),
        challenges: [
          {
            key: 'L2_Q01',
            type: 'SELECT',
            order: 1,
            prompt: 'Przetłumacz na angielski: „Jak się masz?”.',
            options: [
              { key: 'L2_Q01_A', order: 1, text: 'How are you?', isCorrect: true },
              { key: 'L2_Q01_B', order: 2, text: 'What is your name?', isCorrect: false },
              { key: 'L2_Q01_C', order: 3, text: 'Nice to meet you.', isCorrect: false },
              { key: 'L2_Q01_D', order: 4, text: 'Goodbye.', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q02',
            type: 'SELECT',
            order: 2,
            prompt: 'Wybierz odpowiedź po angielsku: „W porządku.”.',
            options: [
              { key: 'L2_Q02_A', order: 1, text: "I'm OK.", isCorrect: true },
              { key: 'L2_Q02_B', order: 2, text: "I'm Goodbye.", isCorrect: false },
              { key: 'L2_Q02_C', order: 3, text: 'My name is OK.', isCorrect: false },
              { key: 'L2_Q02_D', order: 4, text: 'Hi OK.', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q03',
            type: 'SELECT',
            order: 3,
            prompt: 'Wybierz odpowiedź po angielsku: „Dobrze.”.',
            options: [
              { key: 'L2_Q03_A', order: 1, text: "I'm good.", isCorrect: true },
              { key: 'L2_Q03_B', order: 2, text: "I'm meet.", isCorrect: false },
              { key: 'L2_Q03_C', order: 3, text: "I'm name.", isCorrect: false },
              { key: 'L2_Q03_D', order: 4, text: "I'm bye.", isCorrect: false },
            ],
          },
          {
            key: 'L2_Q04',
            type: 'SELECT',
            order: 4,
            prompt: 'Wybierz odpowiedź po angielsku: „Świetnie!”.',
            options: [
              { key: 'L2_Q04_A', order: 1, text: 'Great!', isCorrect: true },
              { key: 'L2_Q04_B', order: 2, text: 'Not bad.', isCorrect: false },
              { key: 'L2_Q04_C', order: 3, text: 'Goodbye.', isCorrect: false },
              { key: 'L2_Q04_D', order: 4, text: 'Hello.', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q05',
            type: 'SELECT',
            order: 5,
            prompt: 'Wybierz odpowiedź po angielsku: „Nieźle.”.',
            options: [
              { key: 'L2_Q05_A', order: 1, text: 'Not bad.', isCorrect: true },
              { key: 'L2_Q05_B', order: 2, text: 'Nice to meet you.', isCorrect: false },
              { key: 'L2_Q05_C', order: 3, text: 'My name is bad.', isCorrect: false },
              { key: 'L2_Q05_D', order: 4, text: 'How are bad?', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q06',
            type: 'SELECT',
            order: 6,
            prompt: 'Uzupełnij zdanie: „___ fine.”',
            options: [
              { key: 'L2_Q06_A', order: 1, text: "I'm", isCorrect: true },
              { key: 'L2_Q06_B', order: 2, text: 'My', isCorrect: false },
              { key: 'L2_Q06_C', order: 3, text: 'Bye', isCorrect: false },
              { key: 'L2_Q06_D', order: 4, text: 'Nice', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q07',
            type: 'SELECT',
            order: 7,
            prompt: 'Przetłumacz na angielski: „Jestem w porządku.”.',
            options: [
              { key: 'L2_Q07_A', order: 1, text: "I'm OK.", isCorrect: true },
              { key: 'L2_Q07_B', order: 2, text: "I'm name.", isCorrect: false },
              { key: 'L2_Q07_C', order: 3, text: 'How are you?', isCorrect: false },
              { key: 'L2_Q07_D', order: 4, text: 'Nice to meet you.', isCorrect: false },
            ],
          },
          {
            key: 'L2_Q08',
            type: 'SELECT',
            order: 8,
            prompt: 'Przetłumacz na angielski: „Mam się dobrze.”.',
            options: [
              { key: 'L2_Q08_A', order: 1, text: "I'm fine.", isCorrect: true },
              { key: 'L2_Q08_B', order: 2, text: "I'm bye.", isCorrect: false },
              { key: 'L2_Q08_C', order: 3, text: "I'm meet.", isCorrect: false },
              { key: 'L2_Q08_D', order: 4, text: "I'm name.", isCorrect: false },
            ],
          },
        ],
      },
      // === LESSON 3 ===
      {
        lessonIndex: 3,
        slug: 'przedstawianie-sie',
        title: 'Przedstawianie się',
        order: 3,
        isReview: false,
        theoryMarkdown: `
  # Przedstawianie się
  
  Najprostsze zwroty:
  - **My name is ...** – "Mam na imię / Nazywam się..."
  - **I'm ...** – "Jestem ..."
  - **Nice to meet you.** – "Miło mi Cię poznać."
  - **Nice to meet you too.** – "Miło mi Cię poznać też."
  
  Uwaga:
  - **My name is** + imię
  - **I'm** + imię (krócej, bardziej potocznie)
        `.trim(),
        challenges: [
          {
            key: 'L3_Q01',
            type: 'SELECT',
            order: 1,
            prompt: 'Przetłumacz na angielski: „Mam na imię Ania.”.',
            options: [
              { key: 'L3_Q01_A', order: 1, text: 'My name is Ania.', isCorrect: true },
              { key: 'L3_Q01_B', order: 2, text: 'I name is Ania.', isCorrect: false },
              { key: 'L3_Q01_C', order: 3, text: 'My Ania is name.', isCorrect: false },
              { key: 'L3_Q01_D', order: 4, text: 'How are you Ania?', isCorrect: false },
            ],
          },
          {
            key: 'L3_Q02',
            type: 'SELECT',
            order: 2,
            prompt: 'Przetłumacz na angielski: „Jestem Marek.”.',
            options: [
              { key: 'L3_Q02_A', order: 1, text: "I'm Marek.", isCorrect: true },
              { key: 'L3_Q02_B', order: 2, text: 'My Marek.', isCorrect: false },
              { key: 'L3_Q02_C', order: 3, text: "I'm fine Marek.", isCorrect: false },
              { key: 'L3_Q02_D', order: 4, text: "Name I'm Marek.", isCorrect: false },
            ],
          },
          {
            key: 'L3_Q03',
            type: 'SELECT',
            order: 3,
            prompt: 'Przetłumacz na angielski: „Miło mi Cię poznać.”.',
            options: [
              { key: 'L3_Q03_A', order: 1, text: 'Nice to meet you.', isCorrect: true },
              { key: 'L3_Q03_B', order: 2, text: 'Nice to name you.', isCorrect: false },
              { key: 'L3_Q03_C', order: 3, text: 'Meet to nice you.', isCorrect: false },
              { key: 'L3_Q03_D', order: 4, text: 'How are you?', isCorrect: false },
            ],
          },
          {
            key: 'L3_Q04',
            type: 'SELECT',
            order: 4,
            prompt: 'Przetłumacz na angielski: „Miło mi Cię poznać też.”.',
            options: [
              { key: 'L3_Q04_A', order: 1, text: 'Nice to meet you too.', isCorrect: true },
              { key: 'L3_Q04_B', order: 2, text: 'Nice meet you too.', isCorrect: false },
              { key: 'L3_Q04_C', order: 3, text: 'Nice to you meet too.', isCorrect: false },
              { key: 'L3_Q04_D', order: 4, text: 'Nice to meet you two.', isCorrect: false },
            ],
          },
          {
            key: 'L3_Q05',
            type: 'SELECT',
            order: 5,
            prompt: 'Uzupełnij zdanie: „My ___ is John.”',
            options: [
              { key: 'L3_Q05_A', order: 1, text: 'name', isCorrect: true },
              { key: 'L3_Q05_B', order: 2, text: 'fine', isCorrect: false },
              { key: 'L3_Q05_C', order: 3, text: 'meet', isCorrect: false },
              { key: 'L3_Q05_D', order: 4, text: 'bye', isCorrect: false },
            ],
          },
          {
            key: 'L3_Q06',
            type: 'SELECT',
            order: 6,
            prompt: 'Uzupełnij zdanie: „Nice to ___ you.”',
            options: [
              { key: 'L3_Q06_A', order: 1, text: 'meet', isCorrect: true },
              { key: 'L3_Q06_B', order: 2, text: 'name', isCorrect: false },
              { key: 'L3_Q06_C', order: 3, text: 'goodbye', isCorrect: false },
              { key: 'L3_Q06_D', order: 4, text: 'hello', isCorrect: false },
            ],
          },
          {
            key: 'L3_Q07',
            type: 'SELECT',
            order: 7,
            prompt: 'Wybierz zdanie, które służy do przedstawienia się.',
            options: [
              { key: 'L3_Q07_A', order: 1, text: 'My name is Tom.', isCorrect: true },
              { key: 'L3_Q07_B', order: 2, text: 'How are you?', isCorrect: false },
              { key: 'L3_Q07_C', order: 3, text: 'Goodbye!', isCorrect: false },
              { key: 'L3_Q07_D', order: 4, text: 'Not bad.', isCorrect: false },
            ],
          },
        ],
      },
      // === LESSON 4 (REVIEW) ===
      {
        lessonIndex: 4,
        slug: 'powitanie-review',
        title: 'Powitanie mix',
        order: 4,
        isReview: true,
        theoryMarkdown: `
  # Powitanie mix (podsumowanie)
  
  Szybka ściąga:
  - **Hello / Hi** – "Cześć"
  - **How are you?** – "Jak się masz?"
  - **I'm fine / I'm good / I'm OK / Great! / Not bad.** – odpowiedzi
  - **My name is ... / I'm ...** – przedstawianie się
  - **Nice to meet you / Nice to meet you too** – miło mi / miło mi też
  - **Goodbye / Bye** – "Do widzenia / Pa"
  
  Cel: łączyć zwroty w krótkie dialogi.
        `.trim(),
        challenges: [
          {
            key: 'L4_Q01',
            type: 'SELECT',
            order: 1,
            prompt: 'Przetłumacz na angielski: „Cześć! Jak się masz?”.',
            options: [
              { key: 'L4_Q01_A', order: 1, text: 'Hi! How are you?', isCorrect: true },
              { key: 'L4_Q01_B', order: 2, text: 'Goodbye! What is your name?', isCorrect: false },
              { key: 'L4_Q01_C', order: 3, text: 'Hello! Nice to meet you.', isCorrect: false },
              { key: 'L4_Q01_D', order: 4, text: "Bye! I'm fine.", isCorrect: false },
            ],
          },
          {
            key: 'L4_Q02',
            type: 'SELECT',
            order: 2,
            prompt: 'Przetłumacz na angielski: „Mam na imię Ania. Miło mi Cię poznać.”.',
            options: [
              { key: 'L4_Q02_A', order: 1, text: 'My name is Ania. Nice to meet you.', isCorrect: true },
              { key: 'L4_Q02_B', order: 2, text: "I'm Ania. How are you goodbye?", isCorrect: false },
              { key: 'L4_Q02_C', order: 3, text: 'Nice to meet you. My fine is Ania.', isCorrect: false },
              { key: 'L4_Q02_D', order: 4, text: 'My name Ania is. Meet nice you.', isCorrect: false },
            ],
          },
          {
            key: 'L4_Q03',
            type: 'SELECT',
            order: 3,
            prompt: 'Wybierz poprawną odpowiedź na pytanie: „How are you?” (odpowiedź: „Nieźle.”).',
            options: [
              { key: 'L4_Q03_A', order: 1, text: 'Not bad.', isCorrect: true },
              { key: 'L4_Q03_B', order: 2, text: 'Nice to meet you.', isCorrect: false },
              { key: 'L4_Q03_C', order: 3, text: 'My name is Tom.', isCorrect: false },
              { key: 'L4_Q03_D', order: 4, text: 'Goodbye!', isCorrect: false },
            ],
          },
          {
            key: 'L4_Q04',
            type: 'SELECT',
            order: 4,
            prompt: 'Przetłumacz na angielski: „Pa!”.',
            options: [
              { key: 'L4_Q04_A', order: 1, text: 'Bye!', isCorrect: true },
              { key: 'L4_Q04_B', order: 2, text: 'Hello!', isCorrect: false },
              { key: 'L4_Q04_C', order: 3, text: 'Great!', isCorrect: false },
              { key: 'L4_Q04_D', order: 4, text: "I'm OK.", isCorrect: false },
            ],
          },
          {
            key: 'L4_Q05',
            type: 'SELECT',
            order: 5,
            prompt: 'Wybierz bardziej formalne powitanie.',
            options: [
              { key: 'L4_Q05_A', order: 1, text: 'Hello', isCorrect: true },
              { key: 'L4_Q05_B', order: 2, text: 'Hi', isCorrect: false },
              { key: 'L4_Q05_C', order: 3, text: 'Bye', isCorrect: false },
              { key: 'L4_Q05_D', order: 4, text: 'Not bad.', isCorrect: false },
            ],
          },
          {
            key: 'L4_Q06',
            type: 'SELECT',
            order: 6,
            prompt: 'Przetłumacz na angielski: „Do widzenia!”.',
            options: [
              { key: 'L4_Q06_A', order: 1, text: 'Goodbye!', isCorrect: true },
              { key: 'L4_Q06_B', order: 2, text: 'Hi!', isCorrect: false },
              { key: 'L4_Q06_C', order: 3, text: 'Great!', isCorrect: false },
              { key: 'L4_Q06_D', order: 4, text: 'My name is Goodbye.', isCorrect: false },
            ],
          },
          {
            key: 'L4_Q07',
            type: 'SELECT',
            order: 7,
            prompt: 'Uzupełnij: „Nice to meet you ___”.',
            options: [
              { key: 'L4_Q07_A', order: 1, text: 'too', isCorrect: true },
              { key: 'L4_Q07_B', order: 2, text: 'two', isCorrect: false },
              { key: 'L4_Q07_C', order: 3, text: 'to', isCorrect: false },
              { key: 'L4_Q07_D', order: 4, text: 'do', isCorrect: false },
            ],
          },
          {
            key: 'L4_Q08',
            type: 'SELECT',
            order: 8,
            prompt: 'Przetłumacz na angielski: „Jestem OK.”.',
            options: [
              { key: 'L4_Q08_A', order: 1, text: "I'm OK.", isCorrect: true },
              { key: 'L4_Q08_B', order: 2, text: 'My OK is.', isCorrect: false },
              { key: 'L4_Q08_C', order: 3, text: "I'm name OK.", isCorrect: false },
              { key: 'L4_Q08_D', order: 4, text: 'OK are you?', isCorrect: false },
            ],
          },
        ],
      },
    ],
  } as const;