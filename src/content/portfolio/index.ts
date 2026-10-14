import type { PortfolioEntry } from "../schema";
import { aiDigitalEntries } from "./aiDigital";
import { appEntries } from "./apps";
import { growthEntries } from "./growth";
import { homeroomEntries } from "./homeroom";
import { lectureEntries } from "./lectures";
import { philosophyEntries } from "./philosophy";
import { reflectionEntries } from "./reflections";
import { rooftopEntries } from "./rooftop";
import { teachingEntries } from "./teaching";
import { workflowEntries } from "./workflows";

/**
 * Every portfolio entry in the tower. A new data file only needs to be added
 * here once; entries inside it are placed by their `floor` / `zone`.
 */
export const portfolioEntries: PortfolioEntry[] = [
  ...appEntries,
  ...teachingEntries,
  ...aiDigitalEntries,
  ...lectureEntries,
  ...growthEntries,
  ...workflowEntries,
  ...reflectionEntries,
  ...philosophyEntries,
  ...homeroomEntries,
  ...rooftopEntries,
];
