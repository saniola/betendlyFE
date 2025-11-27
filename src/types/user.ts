export interface ProfileService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ProfileMaster {
  about?: string;
  skills?: string[];
  yearsExperience?: number | null;
  address?: string;
  services?: ProfileService[];
  city?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  isMaster: boolean;
  master?: ProfileMaster;
}
