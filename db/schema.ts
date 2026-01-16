import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

// -----------------------------------------------------------------------------
// 1. COURSES (Kursy)
// -----------------------------------------------------------------------------
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(), // np. "angielski-pl-en"
  baseLanguage: text('base_language').notNull(), // np. "pl"
  targetLanguage: text('target_language').notNull(), // np. "en"
  imageUrl: text('image_url'), // Opcjonalny obrazek kursu
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relacje dla kursów
export const coursesRelations = relations(courses, ({ many }) => ({
  units: many(units),
  userProgress: many(userProgress),
}));

// -----------------------------------------------------------------------------
// 2. UNITS (Rozdziały)
// -----------------------------------------------------------------------------
export const units = pgTable(
  'units',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(), // np. "Powitanie"
    slug: text('slug').notNull(), // np. "powitanie"
    description: text('description').notNull().default(''),
    courseId: integer('course_id')
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    order: integer('order').notNull(),
    unitIntroMarkdown: text('unit_intro_markdown'), // Opcjonalny wstęp do rozdziału
  },
  (t) => ({
    // Unikalność sluga i kolejności w obrębie kursu
    courseSlugUnique: unique().on(t.courseId, t.slug),
    courseOrderUnique: unique().on(t.courseId, t.order),
  })
);

// Relacje dla units
export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

// -----------------------------------------------------------------------------
// 3. LESSONS (Lekcje)
// -----------------------------------------------------------------------------
export const lessons = pgTable(
  'lessons',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(), // np. "czesc-i-pa"
    unitId: integer('unit_id')
      .references(() => units.id, { onDelete: 'cascade' })
      .notNull(),
    order: integer('order').notNull(),
    theoryMarkdown: text('theory_markdown').notNull().default(''), // TEORIA (kluczowe dla Twojego projektu)
    isReview: boolean('is_review').notNull().default(false), // Czy to lekcja powtórkowa?
  },
  (t) => ({
    unitSlugUnique: unique().on(t.unitId, t.slug),
    unitOrderUnique: unique().on(t.unitId, t.order),
  })
);

// Relacje dla lekcji
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// -----------------------------------------------------------------------------
// 4. CHALLENGES (Pytania / Wyzwania)
// -----------------------------------------------------------------------------
export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST']); // MVP używa głównie SELECT

export const challenges = pgTable(
  'challenges',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .references(() => lessons.id, { onDelete: 'cascade' })
      .notNull(),
    key: text('key').notNull(), // Stabilny klucz do seedowania, np. "L1_Q01"
    type: challengesEnum('type').notNull(),
    prompt: text('prompt').notNull(), // Pytanie po polsku
    order: integer('order').notNull(),
    audioUrl: text('audio_url'),
    imageUrl: text('image_url'),
  },
  (t) => ({
    lessonKeyUnique: unique().on(t.lessonId, t.key),
    lessonOrderUnique: unique().on(t.lessonId, t.order),
  })
);

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

// -----------------------------------------------------------------------------
// 5. CHALLENGE OPTIONS (Opcje odpowiedzi A/B/C/D)
// -----------------------------------------------------------------------------
export const challengeOptions = pgTable(
  'challenge_options',
  {
    id: serial('id').primaryKey(),
    challengeId: integer('challenge_id')
      .references(() => challenges.id, { onDelete: 'cascade' })
      .notNull(),
    key: text('key').notNull(), // np. "L1_Q01_A"
    text: text('text').notNull(), // Odpowiedź po angielsku
    isCorrect: boolean('is_correct').notNull(), // SECURITY: Nigdy nie wysyłaj tego pola do klienta w API!
    order: integer('order').notNull(),
    audioUrl: text('audio_url'),
    imageUrl: text('image_url'),
  },
  (t) => ({
    challengeKeyUnique: unique().on(t.challengeId, t.key),
    challengeOrderUnique: unique().on(t.challengeId, t.order),
  })
);

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

// -----------------------------------------------------------------------------
// 6. USER PROGRESS (Postępy główne)
// -----------------------------------------------------------------------------
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(), // ID z Clerk
  userName: text('user_name').notNull().default('User'),
  userImage: text('user_image').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  xp: integer('xp').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

// -----------------------------------------------------------------------------
// 7. CHALLENGE PROGRESS (Postęp konkretnych pytań)
// -----------------------------------------------------------------------------
export const challengeProgress = pgTable(
  'challenge_progress',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(), // ID z Clerk (bez FK, bo Clerk to zewnętrzny serwis)
    challengeId: integer('challenge_id')
      .references(() => challenges.id, { onDelete: 'cascade' })
      .notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    correctCount: integer('correct_count').notNull().default(0),
    wrongCount: integer('wrong_count').notNull().default(0),
    lastAttemptAt: timestamp('last_attempt_at').defaultNow(),
  },
  (t) => ({
    userChallengeUnique: unique().on(t.userId, t.challengeId), // Jeden wpis na usera na pytanie
  })
);

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);