import { z } from "zod";
import { seasoningTypeSchema } from "@/types/api/seasoningType/add/schemas";

export const seasoningTypeDetailResponseSchema = z.object({
  data: seasoningTypeSchema,
});
