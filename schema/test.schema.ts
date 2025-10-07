import * as z from "zod";

export const testSchema = z.object({
  path: z
    .string({ required_error: "Path is required" })
    .nonempty({ message: "Path is required" }),

  task: z
    .string({ required_error: "Task is required" })
    .nonempty({ message: "Task is required" }),

  question: z
    .string({ required_error: "Question is required" })
    .nonempty({ message: "Question is required" }),
});
