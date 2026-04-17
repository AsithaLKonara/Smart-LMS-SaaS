import { z } from 'zod';

export const examQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('multiple_choice'),
    prompt: z.string(),
    points: z.number().nonnegative(),
    options: z.array(z.string()).min(2),
    correctIndex: z.number().int().nonnegative(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('multiple_select'),
    prompt: z.string(),
    points: z.number().nonnegative(),
    options: z.array(z.string()).min(2),
    correctIndices: z.array(z.number().int().nonnegative()).min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal('short_answer'),
    prompt: z.string(),
    points: z.number().nonnegative(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('essay'),
    prompt: z.string(),
    points: z.number().nonnegative(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('file_upload'),
    prompt: z.string(),
    points: z.number().nonnegative(),
  }),
]);

export const examQuestionsArraySchema = z.array(examQuestionSchema);

export type ExamQuestion = z.infer<typeof examQuestionSchema>;
