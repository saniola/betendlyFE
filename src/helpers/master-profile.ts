type ExperienceFields = {
  yearsExperience?: number | null;
  experienceYears?: number | null;
};

export function normalizeYearsExperience<T extends ExperienceFields | null | undefined>(
  master: T,
): T {
  if (!master) return master;

  const years = (master.yearsExperience ?? master.experienceYears ?? null) as number | null;

  return {
    ...master,
    yearsExperience: years,
  } as T;
}

export function withExperienceYearsPayload<T extends ExperienceFields | null | undefined>(
  master: T,
): T {
  if (!master) return master;

  const years = (master.yearsExperience ?? master.experienceYears ?? null) as number | null;

  return {
    ...master,
    yearsExperience: years,
    experienceYears: years,
  } as T;
}

