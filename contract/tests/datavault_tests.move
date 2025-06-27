
#[test_only]
module datavault::datavault_tests {

    const ENotImplemented: u64 = 0;


use datavault::datavault::{new_profile, new_personal_information, new_educational_background, new_work_experience, new_skills, save_profile};
use std::string;


#[test]
// fun create_profile() {
//     let personal_information = PersonalInformation {
//         first_name: b"John".to_string(), 
//         last_name: b"Doe".to_string(), 
//         dob: b"1990-01-01".to_string(),
//         nationality: b"British".to_string(),
//         contact_address: b"123 Main St".to_string(),
//         phone_number: b"1234567890".to_string(),
//         email_address: b"john.doe@example.com".to_string(),
//         linkedin_profile: b"https://www.linkedin.com/in/johndoe".to_string(),
//     };
//     // let personal_information= vector[personal_info];

//     let mut ctx = tx_context::dummy();
//     let dumy_address = @0x123;
      
//     let professional_summary: String = b"##############".to_string();

//     let edu_info = EducationalBackground {
//         degree: b"Master of Science".to_string(), 
//         institution_name: b"University of London".to_string(),
//         country: b"United Kingdom".to_string(), 
//         city: b"London".to_string(),
//         start_date: b"2010-01-01".to_string(),
//         end_date: b"2012-01-01".to_string(),
//         gpa: b"3.5".to_string(),
//         };
//     let educational_background = vector[edu_info];
    
//     let work_info =  WorkExperience {
//         job_title: b"Software Engineer".to_string(),
//         company_name: b"ABC Corporation".to_string(),
//         location: b"New York".to_string(),
//         start_date: b"2015-01-01".to_string(),
//         end_date: b"2018-01-01".to_string(),
//     };
//     let work_experiences = vector[work_info];

//     let skills = Skills {
//         technical_skills: vector[b"Python".to_string(), b"Java".to_string(), b"C++".to_string()],
//         soft_skills: vector[b"Communication".to_string(), b"Teamwork".to_string(),]
//     };

//     // let skills = vector[skill_set];
//     let profile = Profile {
//         personal_information,
//         professional_summary,
//         educational_background,
//         work_experience,
//         skills,
    
//     };

//     save_profile(
//         personal_information,  
//         educational_background,
//         work_experience,
//         skills, ctx);
    
//     assert!(profile.professional_summary == b"##############".to_string(), 1);

//     transfer::public_transfer
// }


public fun create_profile(ctx: &mut TxContext) {
    let personal_information = new_personal_information (
        string::utf8(b"John"),
        string::utf8(b"Doe"),
        string::utf8(b"1990-01-01"),
        string::utf8(b"British"),
        string::utf8(b"123 Main St"),
        string::utf8(b"1234567890"),
        string::utf8(b"john.doe@example.com"),
        string::utf8(b"https://www.linkedin.com/in/johndoe"),
    );

    let professional_summary = string::utf8(b"##############");

    let edu_info = new_educational_background (
        string::utf8(b"Master of Science"),
        string::utf8(b"University of London"),
        string::utf8(b"United Kingdom"),
        string::utf8(b"London"),
        string::utf8(b"2010-01-01"),
        string::utf8(b"2012-01-01"),
        string::utf8(b"3.5"),
    );
    let educational_background = vector[edu_info];

    let work_info = new_work_experience (
        string::utf8(b"Software Engineer"),
        string::utf8(b"ABC Corporation"),
        string::utf8(b"New York"),
        string::utf8(b"2015-01-01"),
        string::utf8(b"2018-01-01"),
    );
    let work_experience = vector[work_info];

    let  skills = new_skills (
       vector[
            string::utf8(b"Python"),
            string::utf8(b"Java"),
            string::utf8(b"C++")
        ],
        vector[
            string::utf8(b"Communication"),
            string::utf8(b"Teamwork")
        ]
    );

    let profile = new_profile ( 
        personal_information,
        educational_background,
        professional_summary,
        work_experience,
        skills,
    );

    save_profile(
        copy personal_information,
        copy educational_background,
        copy professional_summary,
        copy work_experience,
        copy skills,
        ctx
    );

    assert!(datavault::datavault::get_professional_summary(&profile) == string::utf8(b"##############"), 1);
}


#[test, expected_failure(abort_code = ::datavault::datavault_tests::ENotImplemented)]
fun test_datavault_fail() {
    abort ENotImplemented
}

}

