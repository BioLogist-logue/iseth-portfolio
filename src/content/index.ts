import { floors } from "./floors";
import { zones } from "./zones";
import { toPortfolioItem } from "./normalize";
import { portfolioEntries } from "./portfolio";
import { profile, recommendations, updates } from "./site";
import { reportIssues, validateEntries } from "./validate";

const { valid, issues } = validateEntries(portfolioEntries, floors, zones);
reportIssues(issues);

export const content = {
  floors,
  zones,
  items: valid.map(toPortfolioItem),
  profile,
  recommendations,
  updates,
};
