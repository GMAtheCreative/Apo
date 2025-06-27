
/// Module: datavault
module datavault::datavault {
    use std::string::String;

    public struct Profile has store, drop, copy {
        personal_information: PersonalInformation,
        educational_background: vector<EducationalBackground>,
        professional_summary: String,
        work_experience: vector<WorkExperience>,
        skills: Skills,
    }
  
 public fun new_profile(
    personal_information: PersonalInformation,
    educational_background : vector<EducationalBackground>,
    professional_summary: String,
    work_experience: vector<WorkExperience>,
    skills: Skills,
    ): Profile {
        Profile {
            personal_information,
            educational_background,
            professional_summary,
            work_experience,
            skills,
            }
    }

public struct PersonalInformation has store, drop, copy {
    first_name: String,
    last_name: String,
    dob: String,
    nationality : String,
    contact_address: String,
    phone_number: String,
    email_address: String,
    linkedin_profile: String,

}

public fun new_personal_information (
    first_name: String,
    last_name: String,
    dob: String,
    nationality: String,
    contact_address: String,
    phone_number: String,
    email_address: String,
    linkedin_profile: String
): PersonalInformation {
        PersonalInformation {
            first_name,
            last_name,
            dob,
            nationality,
            contact_address,
            phone_number ,
            email_address ,
            linkedin_profile,
            }
}


public struct EducationalBackground has store, drop, copy {
    degree: String,
    institution_name: String,
    country: String,
    city: String,
    start_date: String,
    end_date: String,
    gpa: String,
    }

public fun new_educational_background (
    degree: String,
    institution_name: String,
    country: String,
    city: String,
    start_date: String,
    end_date: String,
    gpa: String
    ): EducationalBackground {
        EducationalBackground {
            degree,
            institution_name,
            country,
            city,
            start_date,
            end_date,
            gpa,
            }
            }

public struct WorkExperience has store, drop, copy {
    job_title: String,
    company_name: String,
    location: String,
    start_date: String,
    end_date: String,
}

public fun new_work_experience (
    job_title: String,
    company_name: String,
    location: String,
    start_date: String,
    end_date: String
    ): WorkExperience {
        WorkExperience {
            job_title,
            company_name,
            location,
            start_date,
            end_date,
            }
            }

public struct Skills has store, drop, copy {
    technical_skills: vector<String>,
    soft_skills: vector<String>,

}

public fun new_skills (
    technical_skills: vector<String>,
    soft_skills: vector<String>,
    ): Skills {
        Skills {
            technical_skills,
            soft_skills,
            }
            }

public fun get_personal_information(profile: &Profile): PersonalInformation {
    profile.personal_information
}

  
public fun get_educational_background(profile: &Profile): vector<EducationalBackground> {
    profile.educational_background
}

public fun get_professional_summary(profile: &Profile): String {
    profile.professional_summary
    }

public fun get_work_experience(profile: &Profile): vector<WorkExperience> {
    profile.work_experience
    }

public fun get_skills(profile: &Profile): Skills {
    profile.skills
    }



public fun save_profile(
    personal_information: PersonalInformation, 
    educational_background: vector<EducationalBackground>,
    professional_summary: String,
    work_experience: vector<WorkExperience>,
    skills: Skills,
    ctx: &mut TxContext) {
        let mut profile = Profile {
             personal_information,
             educational_background,
             professional_summary,
             work_experience,
             skills,
        };
        profile.personal_information = personal_information;
        profile.educational_background = educational_background;
        profile.work_experience = work_experience;
        profile.skills = skills;
    
}

}



