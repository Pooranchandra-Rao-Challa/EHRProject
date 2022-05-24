import {CategoryProvider, Category} from "typescript-logging-category-style";

const provider = CategoryProvider.createProvider("EHRLoggerProvider");

export function getLogger(name: string): Category {
  return provider.getCategory(name);
}
