export interface PersonalInformation {
  nationalId: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  contactAddress: string;
  phoneNumber: string;
  emailAddress: string;
  linkedinProfile: string;
}

export interface EducationalBackground {
  degree: string;
  institutionName: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location: string;
}

export interface Skills {
  technicalSkills: string[];
  softSkills: string[];
}

export interface Biodata {
  professionalSummary: string;
  personalInformation: PersonalInformation;
  educationalBackground: EducationalBackground[];
  workExperience: WorkExperience[];
  skills: Skills;
}

export interface User {
  id: string;
  email: string;
  password: string;
  biodata: Biodata;
  createdAt: string;
  updatedAt: string;
}
