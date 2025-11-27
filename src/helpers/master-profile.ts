type ExperienceFields = {
  yearsExperience?: number | null;
  experienceYears?: number | null;
};

type AnyMaster = ExperienceFields & Record<string, unknown>;

export function normalizeYearsExperience<T extends AnyMaster | null | undefined>(
  master: T,
) {
  if (!master) return master;

  const years = (master.yearsExperience ?? master.experienceYears ?? null) as number | null;

  return {
    ...master,
    yearsExperience: years,
  };
}

export function withExperienceYearsPayload<T extends AnyMaster | null | undefined>(
  master: T,
) {
  if (!master) return master;

  const years = (master.yearsExperience ?? master.experienceYears ?? null) as number | null;

  return {
    ...master,
    yearsExperience: years,
    experienceYears: years,
  };
}

