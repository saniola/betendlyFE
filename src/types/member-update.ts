export interface MemberUpdatePayload {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  master?: {
    about?: string | null;
    city?: string | null;
    address?: string | null;
    experienceYears?: number | null;
    yearsExperience?: number | null;
    skills?: string[] | null;
  };
}
export interface UserUpdateDto {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface MasterUpdateDto {
  about?: string | null;
  city?: string | null;
  address?: string | null;
  skills?: string[] | null;
  experienceYears?: number | null;
  yearsExperience?: number | null;
}

export interface MemberUpdateRequest {
  user?: UserUpdateDto;
  master?: MasterUpdateDto;
}

