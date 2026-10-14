import { archetypeOf, type TemplateStyle } from "@/lib/archetypes";
import type { Floor } from "@/lib/types";

export type { TemplateStyle };

/** Room finish for a floor (now provided by its archetype). */
export function templateStyle(floor: Floor): TemplateStyle {
  return archetypeOf(floor).style;
}
