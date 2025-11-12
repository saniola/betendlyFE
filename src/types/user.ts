interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

interface Master {
  about: string;
  skills: string[];
  yearsExperience: number;
  address: string;
  services: Service[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  isMaster: boolean;
  master?: Master;
}
