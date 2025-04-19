import { z } from "zod";

const userPlayerSeekNewPositionSchema = z.object({
  newPositionMs: z.number().int().positive(),
});

const userPlayerSeekNewPositionResponseSchema = z.object({
  message: z.string().min(1),
});

type UserPlayerSeekNewPosition = z.infer<
  typeof userPlayerSeekNewPositionSchema
>;

type UserPlayerSeekNewPositionResponseSchema = z.infer<
  typeof userPlayerSeekNewPositionResponseSchema
>;

export {
  userPlayerSeekNewPositionResponseSchema,
  userPlayerSeekNewPositionSchema,
  type UserPlayerSeekNewPosition,
  type UserPlayerSeekNewPositionResponseSchema,
};
