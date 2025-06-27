import { ObjectId } from "mongodb";

export interface PersonalInformation {
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  nationality?: string;
  contactAddress?: string;
  phoneNumber?: string;
  emailAddress?: string;
  linkedinProfile?: string;
}

export interface EducationalBackground {
  degree?: string;
  institutionName?: string;
  country?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

export interface WorkExperience {
  jobTitle?: string;
  companyName?: string;
  location?: string;
}

export interface Skills {
  technicalSkills?: string[];
  softSkills?: string[];
}

export interface Biodata {
  professionalSummary?: string;
  personalInformation?: Partial<PersonalInformation>;
  educationalBackground?: Partial<EducationalBackground>[];
  workExperience?: Partial<WorkExperience>[];
  skills?: Partial<Skills>;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  biodata: Biodata;
  encryptionKey: string;
  createdAt: string;
  updatedAt: string;
}
