import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  /// No description provided for @en.
  ///
  /// In en, this message translates to:
  /// **'En'**
  String get en;

  /// No description provided for @ar.
  ///
  /// In en, this message translates to:
  /// **'AR'**
  String get ar;

  /// No description provided for @englis.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get englis;

  /// No description provided for @arabic.
  ///
  /// In en, this message translates to:
  /// **'Arabic'**
  String get arabic;

  /// No description provided for @app_name.
  ///
  /// In en, this message translates to:
  /// **'Axon'**
  String get app_name;

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// No description provided for @radiology_images.
  ///
  /// In en, this message translates to:
  /// **'Radiology images'**
  String get radiology_images;

  /// No description provided for @no_radiology.
  ///
  /// In en, this message translates to:
  /// **'No radiology images added yet'**
  String get no_radiology;

  /// No description provided for @scan_type.
  ///
  /// In en, this message translates to:
  /// **'Scan type'**
  String get scan_type;

  /// No description provided for @no_lab_tests.
  ///
  /// In en, this message translates to:
  /// **'No lab tests added yet'**
  String get no_lab_tests;

  /// No description provided for @test_name.
  ///
  /// In en, this message translates to:
  /// **'Test name'**
  String get test_name;

  /// No description provided for @no_allergies.
  ///
  /// In en, this message translates to:
  /// **'No allergies added yet'**
  String get no_allergies;

  /// No description provided for @edit_basic_information.
  ///
  /// In en, this message translates to:
  /// **'Edit Basic Information'**
  String get edit_basic_information;

  /// No description provided for @condition_name.
  ///
  /// In en, this message translates to:
  /// **'Condition name'**
  String get condition_name;

  /// No description provided for @allergy_name.
  ///
  /// In en, this message translates to:
  /// **'Allergy name'**
  String get allergy_name;

  /// No description provided for @years.
  ///
  /// In en, this message translates to:
  /// **'Years'**
  String get years;

  /// No description provided for @comments.
  ///
  /// In en, this message translates to:
  /// **'Comments'**
  String get comments;

  /// No description provided for @write_comment.
  ///
  /// In en, this message translates to:
  /// **'Write a comment...'**
  String get write_comment;

  /// No description provided for @read_more.
  ///
  /// In en, this message translates to:
  /// **'Read more'**
  String get read_more;

  /// No description provided for @show_less.
  ///
  /// In en, this message translates to:
  /// **'Show less'**
  String get show_less;

  /// No description provided for @search_medicine.
  ///
  /// In en, this message translates to:
  /// **'Search medicine'**
  String get search_medicine;

  /// No description provided for @medicine_example.
  ///
  /// In en, this message translates to:
  /// **'e.g. Vitamin D'**
  String get medicine_example;

  /// No description provided for @twice_daily.
  ///
  /// In en, this message translates to:
  /// **'Twice Daily'**
  String get twice_daily;

  /// No description provided for @three_times_daily.
  ///
  /// In en, this message translates to:
  /// **'Three Times Daily'**
  String get three_times_daily;

  /// No description provided for @medicine_saved_successfully.
  ///
  /// In en, this message translates to:
  /// **'Medicine saved successfully'**
  String get medicine_saved_successfully;

  /// No description provided for @no_medicine_today.
  ///
  /// In en, this message translates to:
  /// **'No medicine for today'**
  String get no_medicine_today;

  /// No description provided for @minute.
  ///
  /// In en, this message translates to:
  /// **'MIN'**
  String get minute;

  /// No description provided for @what_is_your_complaint.
  ///
  /// In en, this message translates to:
  /// **'What is your complaint?'**
  String get what_is_your_complaint;

  /// No description provided for @greeting.
  ///
  /// In en, this message translates to:
  /// **'Good Evening, {name}'**
  String greeting(Object name);

  /// No description provided for @health_matters.
  ///
  /// In en, this message translates to:
  /// **'Your health matters'**
  String get health_matters;

  /// No description provided for @reply.
  ///
  /// In en, this message translates to:
  /// **'Reply'**
  String get reply;

  /// No description provided for @write_reply.
  ///
  /// In en, this message translates to:
  /// **'Write a reply...'**
  String get write_reply;

  /// No description provided for @send.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get send;

  /// No description provided for @chat_bot_title.
  ///
  /// In en, this message translates to:
  /// **'As\'alny'**
  String get chat_bot_title;

  /// No description provided for @type_your_message.
  ///
  /// In en, this message translates to:
  /// **'Type your message...'**
  String get type_your_message;

  /// No description provided for @ai_typing.
  ///
  /// In en, this message translates to:
  /// **'AI is typing...'**
  String get ai_typing;

  /// No description provided for @search_doctor_specialty.
  ///
  /// In en, this message translates to:
  /// **'Search doctor or specialty'**
  String get search_doctor_specialty;

  /// No description provided for @about_doctor.
  ///
  /// In en, this message translates to:
  /// **'About Doctor'**
  String get about_doctor;

  /// No description provided for @book_now.
  ///
  /// In en, this message translates to:
  /// **'Book Now'**
  String get book_now;

  /// No description provided for @book_consultation.
  ///
  /// In en, this message translates to:
  /// **'Book Consultation'**
  String get book_consultation;

  /// No description provided for @describe_complaint.
  ///
  /// In en, this message translates to:
  /// **'Describe your complaint'**
  String get describe_complaint;

  /// No description provided for @write_complaint_hint.
  ///
  /// In en, this message translates to:
  /// **'Write your symptoms or problem here...'**
  String get write_complaint_hint;

  /// No description provided for @consultation_price.
  ///
  /// In en, this message translates to:
  /// **'Consultation Price'**
  String get consultation_price;

  /// No description provided for @proceed_payment.
  ///
  /// In en, this message translates to:
  /// **'Proceed to Payment'**
  String get proceed_payment;

  /// No description provided for @choose_language.
  ///
  /// In en, this message translates to:
  /// **'Choose language'**
  String get choose_language;

  /// No description provided for @condition.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get condition;

  /// No description provided for @diabetes.
  ///
  /// In en, this message translates to:
  /// **'Diabetes'**
  String get diabetes;

  /// No description provided for @high_blood_pressure.
  ///
  /// In en, this message translates to:
  /// **'High blood pressure'**
  String get high_blood_pressure;

  /// No description provided for @chronic_back_pain.
  ///
  /// In en, this message translates to:
  /// **'Chronic back pain'**
  String get chronic_back_pain;

  /// No description provided for @blood_test.
  ///
  /// In en, this message translates to:
  /// **'Blood Test'**
  String get blood_test;

  /// No description provided for @sugar_analysis.
  ///
  /// In en, this message translates to:
  /// **'Sugar Analysis'**
  String get sugar_analysis;

  /// No description provided for @cholesterol_test.
  ///
  /// In en, this message translates to:
  /// **'Cholesterol Test'**
  String get cholesterol_test;

  /// No description provided for @chest_xray.
  ///
  /// In en, this message translates to:
  /// **'Chest X-Ray'**
  String get chest_xray;

  /// No description provided for @mri_scan.
  ///
  /// In en, this message translates to:
  /// **'MRI Scan'**
  String get mri_scan;

  /// No description provided for @write_symptoms_hint.
  ///
  /// In en, this message translates to:
  /// **'Write your symptoms or problem here...'**
  String get write_symptoms_hint;

  /// No description provided for @proceed_to_payment.
  ///
  /// In en, this message translates to:
  /// **'Proceed to Payment'**
  String get proceed_to_payment;

  /// No description provided for @intro_title.
  ///
  /// In en, this message translates to:
  /// **'Your health in one app'**
  String get intro_title;

  /// No description provided for @intro_description.
  ///
  /// In en, this message translates to:
  /// **'Axon helps you manage your health with ease. Book doctors, track your medications, connect with specialists, and stay reassured.'**
  String get intro_description;

  /// No description provided for @article_medication_tips.
  ///
  /// In en, this message translates to:
  /// **'5 Tips to Take Your Medication on Time'**
  String get article_medication_tips;

  /// No description provided for @article_vitamins_importance.
  ///
  /// In en, this message translates to:
  /// **'Why Daily Vitamins Matter for Your Health'**
  String get article_vitamins_importance;

  /// No description provided for @article_healthy_habits.
  ///
  /// In en, this message translates to:
  /// **'Simple Habits for a Healthier Life'**
  String get article_healthy_habits;

  /// No description provided for @article_dummy_content.
  ///
  /// In en, this message translates to:
  /// **'Taking care of your health is not just about visiting the doctor when you feel sick, but also about maintaining healthy daily habits that support your body and mind.\n\nOne of the most important habits is taking your medication on time. Missing doses or taking them incorrectly can reduce the effectiveness of treatment and may cause unexpected side effects.\n\nHere are a few simple tips to help you stay on track:\n• Set daily reminders on your phone.\n• Use a pill organizer to manage your doses.\n• Try to associate your medication with a daily routine, such as meals or bedtime.\n• Always follow your doctor’s instructions carefully.\n\nIn addition, maintaining a balanced diet, staying hydrated, and getting enough sleep play a crucial role in improving your overall health.\n\nRemember, consistency is key. By sticking to healthy habits every day, you give your body the best chance to heal and stay strong.'**
  String get article_dummy_content;

  /// No description provided for @onboarding_title_1.
  ///
  /// In en, this message translates to:
  /// **'Connect with the best Doctors'**
  String get onboarding_title_1;

  /// No description provided for @onboarding_desc_1.
  ///
  /// In en, this message translates to:
  /// **'Find a doctor in any specialty and book an appointment easily from home'**
  String get onboarding_desc_1;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @onboarding_title_2.
  ///
  /// In en, this message translates to:
  /// **'Online Medical Consultations'**
  String get onboarding_title_2;

  /// No description provided for @onboarding_desc_2.
  ///
  /// In en, this message translates to:
  /// **'Video sessions with the doctor while you are in your place, with an electronic prescription'**
  String get onboarding_desc_2;

  /// No description provided for @onboarding_title_3.
  ///
  /// In en, this message translates to:
  /// **'Track Your Health Smartly'**
  String get onboarding_title_3;

  /// No description provided for @onboarding_desc_3.
  ///
  /// In en, this message translates to:
  /// **'Complete medical history, medication reminders, and follow-up with your doctor'**
  String get onboarding_desc_3;

  /// No description provided for @get_started.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get get_started;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @enter_email.
  ///
  /// In en, this message translates to:
  /// **'Enter your email'**
  String get enter_email;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @enter_password.
  ///
  /// In en, this message translates to:
  /// **'Enter your password'**
  String get enter_password;

  /// No description provided for @forgot_password.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgot_password;

  /// No description provided for @sign_in.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get sign_in;

  /// No description provided for @dont_have_account.
  ///
  /// In en, this message translates to:
  /// **'Don’t have an account?'**
  String get dont_have_account;

  /// No description provided for @sign_up.
  ///
  /// In en, this message translates to:
  /// **'Sign Up'**
  String get sign_up;

  /// No description provided for @or.
  ///
  /// In en, this message translates to:
  /// **'OR'**
  String get or;

  /// No description provided for @sign_in_google.
  ///
  /// In en, this message translates to:
  /// **'Sign in with Google'**
  String get sign_in_google;

  /// No description provided for @full_name.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get full_name;

  /// No description provided for @enter_full_name.
  ///
  /// In en, this message translates to:
  /// **'Enter your full name'**
  String get enter_full_name;

  /// No description provided for @phone_number.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phone_number;

  /// No description provided for @enter_phone.
  ///
  /// In en, this message translates to:
  /// **'Enter your phone number'**
  String get enter_phone;

  /// No description provided for @gender.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get gender;

  /// No description provided for @male.
  ///
  /// In en, this message translates to:
  /// **'Male'**
  String get male;

  /// No description provided for @female.
  ///
  /// In en, this message translates to:
  /// **'Female'**
  String get female;

  /// No description provided for @create_password.
  ///
  /// In en, this message translates to:
  /// **'Create a strong password'**
  String get create_password;

  /// No description provided for @agree_terms.
  ///
  /// In en, this message translates to:
  /// **'I agree to the meddidoc Terms of Service and Privacy Policy'**
  String get agree_terms;

  /// No description provided for @im_patient.
  ///
  /// In en, this message translates to:
  /// **'I’m a Patient'**
  String get im_patient;

  /// No description provided for @patient_desc.
  ///
  /// In en, this message translates to:
  /// **'Find doctors and book appointments'**
  String get patient_desc;

  /// No description provided for @im_doctor.
  ///
  /// In en, this message translates to:
  /// **'I’m a Doctor'**
  String get im_doctor;

  /// No description provided for @doctor_desc.
  ///
  /// In en, this message translates to:
  /// **'Manage patients and consultations'**
  String get doctor_desc;

  /// No description provided for @doctor_registration.
  ///
  /// In en, this message translates to:
  /// **'Doctor Registration'**
  String get doctor_registration;

  /// No description provided for @create_professional_account.
  ///
  /// In en, this message translates to:
  /// **'Create your professional account'**
  String get create_professional_account;

  /// No description provided for @specialization.
  ///
  /// In en, this message translates to:
  /// **'Specialization'**
  String get specialization;

  /// No description provided for @select_specialization.
  ///
  /// In en, this message translates to:
  /// **'Select Specialization'**
  String get select_specialization;

  /// No description provided for @cardiology.
  ///
  /// In en, this message translates to:
  /// **'Cardiology'**
  String get cardiology;

  /// No description provided for @neurology.
  ///
  /// In en, this message translates to:
  /// **'Neurology'**
  String get neurology;

  /// No description provided for @pediatrics.
  ///
  /// In en, this message translates to:
  /// **'Pediatrics'**
  String get pediatrics;

  /// No description provided for @dentistry.
  ///
  /// In en, this message translates to:
  /// **'Dentistry'**
  String get dentistry;

  /// No description provided for @years_experience.
  ///
  /// In en, this message translates to:
  /// **'Years of Experience'**
  String get years_experience;

  /// No description provided for @enter_years_experience.
  ///
  /// In en, this message translates to:
  /// **'Enter number years of experience'**
  String get enter_years_experience;

  /// No description provided for @medical_license_number.
  ///
  /// In en, this message translates to:
  /// **'Medical License Number'**
  String get medical_license_number;

  /// No description provided for @about.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get about;

  /// No description provided for @about_hint.
  ///
  /// In en, this message translates to:
  /// **'Tell us about your experience and background'**
  String get about_hint;

  /// No description provided for @session_price.
  ///
  /// In en, this message translates to:
  /// **'Session Price'**
  String get session_price;

  /// No description provided for @enter_session_price.
  ///
  /// In en, this message translates to:
  /// **'Enter session price'**
  String get enter_session_price;

  /// No description provided for @upload_medical_license.
  ///
  /// In en, this message translates to:
  /// **'Upload Medical License'**
  String get upload_medical_license;

  /// No description provided for @drag_upload.
  ///
  /// In en, this message translates to:
  /// **'Drag or Click to upload attachment'**
  String get drag_upload;

  /// No description provided for @max_file_size.
  ///
  /// In en, this message translates to:
  /// **'Max File size : 2mb'**
  String get max_file_size;

  /// No description provided for @create_account.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get create_account;

  /// No description provided for @already_have_account.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get already_have_account;

  /// No description provided for @login.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get login;

  /// No description provided for @medical_profile.
  ///
  /// In en, this message translates to:
  /// **'Medical Profile'**
  String get medical_profile;

  /// No description provided for @medical_profile_desc.
  ///
  /// In en, this message translates to:
  /// **'Help us understand your health better'**
  String get medical_profile_desc;

  /// No description provided for @blood_type.
  ///
  /// In en, this message translates to:
  /// **'Blood Type'**
  String get blood_type;

  /// No description provided for @select_blood_type.
  ///
  /// In en, this message translates to:
  /// **'Select Blood Type'**
  String get select_blood_type;

  /// No description provided for @height.
  ///
  /// In en, this message translates to:
  /// **'Height (cm)'**
  String get height;

  /// No description provided for @weight.
  ///
  /// In en, this message translates to:
  /// **'Weight (kg)'**
  String get weight;

  /// No description provided for @medical_info_hint.
  ///
  /// In en, this message translates to:
  /// **'Your medical information helps doctors provide better care.'**
  String get medical_info_hint;

  /// No description provided for @health_conditions.
  ///
  /// In en, this message translates to:
  /// **'Health Conditions'**
  String get health_conditions;

  /// No description provided for @add_health_conditions.
  ///
  /// In en, this message translates to:
  /// **'Add your health conditions'**
  String get add_health_conditions;

  /// No description provided for @enter_condition.
  ///
  /// In en, this message translates to:
  /// **'Enter condition name'**
  String get enter_condition;

  /// No description provided for @allergies.
  ///
  /// In en, this message translates to:
  /// **'Allergies'**
  String get allergies;

  /// No description provided for @add_allergies.
  ///
  /// In en, this message translates to:
  /// **'Add your allergies'**
  String get add_allergies;

  /// No description provided for @enter_allergy.
  ///
  /// In en, this message translates to:
  /// **'Enter allergy name'**
  String get enter_allergy;

  /// No description provided for @radiology.
  ///
  /// In en, this message translates to:
  /// **'Radiology'**
  String get radiology;

  /// No description provided for @upload_radiology.
  ///
  /// In en, this message translates to:
  /// **'Upload your radiology images'**
  String get upload_radiology;

  /// No description provided for @description.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get description;

  /// No description provided for @enter_scan_type.
  ///
  /// In en, this message translates to:
  /// **'Enter the type of medical scan'**
  String get enter_scan_type;

  /// No description provided for @remove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get remove;

  /// No description provided for @lab_tests.
  ///
  /// In en, this message translates to:
  /// **'Lab Tests'**
  String get lab_tests;

  /// No description provided for @upload_lab_tests.
  ///
  /// In en, this message translates to:
  /// **'Upload your medical lab tests'**
  String get upload_lab_tests;

  /// No description provided for @finish.
  ///
  /// In en, this message translates to:
  /// **'Finish'**
  String get finish;

  /// No description provided for @account_created.
  ///
  /// In en, this message translates to:
  /// **'Account Created Successfully 🎉'**
  String get account_created;

  /// No description provided for @redirecting_home.
  ///
  /// In en, this message translates to:
  /// **'Welcome! Redirecting to home...'**
  String get redirecting_home;

  /// No description provided for @good_evening.
  ///
  /// In en, this message translates to:
  /// **'Good Evening'**
  String get good_evening;

  /// No description provided for @your_health_matters.
  ///
  /// In en, this message translates to:
  /// **'Your health matters'**
  String get your_health_matters;

  /// No description provided for @todays_medications.
  ///
  /// In en, this message translates to:
  /// **'Today’s Medications'**
  String get todays_medications;

  /// No description provided for @next_dose_in.
  ///
  /// In en, this message translates to:
  /// **'Next dose in {minutes} minutes'**
  String next_dose_in(Object minutes);

  /// No description provided for @next_dose.
  ///
  /// In en, this message translates to:
  /// **'Next dose'**
  String get next_dose;

  /// No description provided for @taken_today.
  ///
  /// In en, this message translates to:
  /// **'taken today'**
  String get taken_today;

  /// No description provided for @time.
  ///
  /// In en, this message translates to:
  /// **'Time'**
  String get time;

  /// No description provided for @taken.
  ///
  /// In en, this message translates to:
  /// **'Taken'**
  String get taken;

  /// No description provided for @view_all.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get view_all;

  /// No description provided for @quick_actions.
  ///
  /// In en, this message translates to:
  /// **'Quick Actions'**
  String get quick_actions;

  /// No description provided for @doctors.
  ///
  /// In en, this message translates to:
  /// **'Doctors'**
  String get doctors;

  /// No description provided for @hospitals.
  ///
  /// In en, this message translates to:
  /// **'Hospitals'**
  String get hospitals;

  /// No description provided for @medicine.
  ///
  /// In en, this message translates to:
  /// **'Medicine'**
  String get medicine;

  /// No description provided for @asaly.
  ///
  /// In en, this message translates to:
  /// **'As\'aly'**
  String get asaly;

  /// No description provided for @articles_tips.
  ///
  /// In en, this message translates to:
  /// **'Articles & Tips'**
  String get articles_tips;

  /// No description provided for @my_doctors.
  ///
  /// In en, this message translates to:
  /// **'My Doctors'**
  String get my_doctors;

  /// No description provided for @cardiology_specialist.
  ///
  /// In en, this message translates to:
  /// **'Cardiology Specialist'**
  String get cardiology_specialist;

  /// No description provided for @neurology_consultant.
  ///
  /// In en, this message translates to:
  /// **'Neurology Consultant'**
  String get neurology_consultant;

  /// No description provided for @internal_medicine.
  ///
  /// In en, this message translates to:
  /// **'Internal Medicine'**
  String get internal_medicine;

  /// No description provided for @chat.
  ///
  /// In en, this message translates to:
  /// **'Chat'**
  String get chat;

  /// No description provided for @community.
  ///
  /// In en, this message translates to:
  /// **'Community'**
  String get community;

  /// No description provided for @no_posts.
  ///
  /// In en, this message translates to:
  /// **'No posts yet'**
  String get no_posts;

  /// No description provided for @be_first_post.
  ///
  /// In en, this message translates to:
  /// **'Be the first to share something'**
  String get be_first_post;

  /// No description provided for @create_post.
  ///
  /// In en, this message translates to:
  /// **'Create Post'**
  String get create_post;

  /// No description provided for @post_title.
  ///
  /// In en, this message translates to:
  /// **'Post title'**
  String get post_title;

  /// No description provided for @write_something.
  ///
  /// In en, this message translates to:
  /// **'Write something...'**
  String get write_something;

  /// No description provided for @add_image.
  ///
  /// In en, this message translates to:
  /// **'Add Image'**
  String get add_image;

  /// No description provided for @share.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get share;

  /// No description provided for @edit_basic_info.
  ///
  /// In en, this message translates to:
  /// **'Edit Basic Information'**
  String get edit_basic_info;

  /// No description provided for @edit_health_conditions.
  ///
  /// In en, this message translates to:
  /// **'Edit Health Conditions'**
  String get edit_health_conditions;

  /// No description provided for @edit_allergies.
  ///
  /// In en, this message translates to:
  /// **'Edit Allergies'**
  String get edit_allergies;

  /// No description provided for @edit_radiology.
  ///
  /// In en, this message translates to:
  /// **'Edit Radiology'**
  String get edit_radiology;

  /// No description provided for @edit_lab_tests.
  ///
  /// In en, this message translates to:
  /// **'Edit Lab Tests'**
  String get edit_lab_tests;

  /// No description provided for @change_password.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get change_password;

  /// No description provided for @notification_settings.
  ///
  /// In en, this message translates to:
  /// **'Notification Settings'**
  String get notification_settings;

  /// No description provided for @logout.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get logout;

  /// No description provided for @delete_account.
  ///
  /// In en, this message translates to:
  /// **'Delete Account'**
  String get delete_account;

  /// No description provided for @basic_information.
  ///
  /// In en, this message translates to:
  /// **'Basic Information'**
  String get basic_information;

  /// No description provided for @personal_medical_info.
  ///
  /// In en, this message translates to:
  /// **'Personal & medical info'**
  String get personal_medical_info;

  /// No description provided for @phone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phone;

  /// No description provided for @edit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get edit;

  /// No description provided for @your_health_conditions.
  ///
  /// In en, this message translates to:
  /// **'Your health conditions'**
  String get your_health_conditions;

  /// No description provided for @no_health_conditions.
  ///
  /// In en, this message translates to:
  /// **'No health conditions added yet'**
  String get no_health_conditions;

  /// No description provided for @tap_edit_add.
  ///
  /// In en, this message translates to:
  /// **'Tap Edit to add one'**
  String get tap_edit_add;

  /// No description provided for @your_allergies.
  ///
  /// In en, this message translates to:
  /// **'Your allergies'**
  String get your_allergies;

  /// No description provided for @medical_lab_tests.
  ///
  /// In en, this message translates to:
  /// **'Medical lab tests'**
  String get medical_lab_tests;

  /// No description provided for @current_password.
  ///
  /// In en, this message translates to:
  /// **'Current Password'**
  String get current_password;

  /// No description provided for @enter_current_password.
  ///
  /// In en, this message translates to:
  /// **'Enter current password'**
  String get enter_current_password;

  /// No description provided for @new_password.
  ///
  /// In en, this message translates to:
  /// **'New Password'**
  String get new_password;

  /// No description provided for @enter_new_password.
  ///
  /// In en, this message translates to:
  /// **'Enter new password'**
  String get enter_new_password;

  /// No description provided for @confirm_new_password.
  ///
  /// In en, this message translates to:
  /// **'Confirm New Password'**
  String get confirm_new_password;

  /// No description provided for @update_password.
  ///
  /// In en, this message translates to:
  /// **'Update Password'**
  String get update_password;

  /// No description provided for @logout_confirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to logout?'**
  String get logout_confirm;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @delete_account_confirm.
  ///
  /// In en, this message translates to:
  /// **'This action is permanent and cannot be undone.'**
  String get delete_account_confirm;

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// No description provided for @all_medicine.
  ///
  /// In en, this message translates to:
  /// **'All Medicine'**
  String get all_medicine;

  /// No description provided for @once_daily.
  ///
  /// In en, this message translates to:
  /// **'Once Daily'**
  String get once_daily;

  /// No description provided for @next_at.
  ///
  /// In en, this message translates to:
  /// **'Next: {time}'**
  String next_at(Object time);

  /// No description provided for @all.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get all;

  /// No description provided for @heart.
  ///
  /// In en, this message translates to:
  /// **'Heart'**
  String get heart;

  /// No description provided for @internal.
  ///
  /// In en, this message translates to:
  /// **'Internal'**
  String get internal;

  /// No description provided for @kidney.
  ///
  /// In en, this message translates to:
  /// **'Kidney'**
  String get kidney;

  /// No description provided for @bones.
  ///
  /// In en, this message translates to:
  /// **'Bones'**
  String get bones;

  /// No description provided for @neuro.
  ///
  /// In en, this message translates to:
  /// **'Neuro'**
  String get neuro;

  /// No description provided for @psychology.
  ///
  /// In en, this message translates to:
  /// **'Psychology'**
  String get psychology;

  /// No description provided for @more.
  ///
  /// In en, this message translates to:
  /// **'More'**
  String get more;

  /// No description provided for @price_egp.
  ///
  /// In en, this message translates to:
  /// **'{price} EGP'**
  String price_egp(Object price);

  /// No description provided for @add_new_medicine.
  ///
  /// In en, this message translates to:
  /// **'Add New Medicine'**
  String get add_new_medicine;

  /// No description provided for @medicine_name.
  ///
  /// In en, this message translates to:
  /// **'Medicine Name'**
  String get medicine_name;

  /// No description provided for @medicine_name_hint.
  ///
  /// In en, this message translates to:
  /// **'ex: Vitamin D'**
  String get medicine_name_hint;

  /// No description provided for @frequency.
  ///
  /// In en, this message translates to:
  /// **'Frequency'**
  String get frequency;

  /// No description provided for @intake_time.
  ///
  /// In en, this message translates to:
  /// **'Intake Time'**
  String get intake_time;

  /// No description provided for @hour.
  ///
  /// In en, this message translates to:
  /// **'HOUR'**
  String get hour;

  /// No description provided for @min.
  ///
  /// In en, this message translates to:
  /// **'MIN'**
  String get min;

  /// No description provided for @am.
  ///
  /// In en, this message translates to:
  /// **'AM'**
  String get am;

  /// No description provided for @pm.
  ///
  /// In en, this message translates to:
  /// **'PM'**
  String get pm;

  /// No description provided for @duration.
  ///
  /// In en, this message translates to:
  /// **'Duration'**
  String get duration;

  /// No description provided for @start_date.
  ///
  /// In en, this message translates to:
  /// **'Start Date'**
  String get start_date;

  /// No description provided for @end_date.
  ///
  /// In en, this message translates to:
  /// **'End Date'**
  String get end_date;

  /// No description provided for @tap_to_select.
  ///
  /// In en, this message translates to:
  /// **'Tap to select'**
  String get tap_to_select;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'SAVE'**
  String get save;

  /// No description provided for @ai_intro.
  ///
  /// In en, this message translates to:
  /// **'Hi, I’m your AI medical assistant.\nAsk me anything about your health.'**
  String get ai_intro;

  /// No description provided for @assistant_unavailable.
  ///
  /// In en, this message translates to:
  /// **'The assistant is temporarily unavailable. Please try again in a moment.'**
  String get assistant_unavailable;

  /// No description provided for @type_message.
  ///
  /// In en, this message translates to:
  /// **'Type your message...'**
  String get type_message;

  /// No description provided for @hi_doctor.
  ///
  /// In en, this message translates to:
  /// **'Hi, Dr {name}'**
  String hi_doctor(Object name);

  /// No description provided for @manage_patients.
  ///
  /// In en, this message translates to:
  /// **'Manage your patients easily'**
  String get manage_patients;

  /// No description provided for @chats.
  ///
  /// In en, this message translates to:
  /// **'Chats'**
  String get chats;

  /// No description provided for @requests.
  ///
  /// In en, this message translates to:
  /// **'Requests'**
  String get requests;

  /// No description provided for @forgot_password_title.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password'**
  String get forgot_password_title;

  /// No description provided for @forgot_password_desc.
  ///
  /// In en, this message translates to:
  /// **'Enter your email to receive a verification code'**
  String get forgot_password_desc;

  /// No description provided for @send_code.
  ///
  /// In en, this message translates to:
  /// **'Send Code'**
  String get send_code;

  /// No description provided for @verification_code.
  ///
  /// In en, this message translates to:
  /// **'Verification Code'**
  String get verification_code;

  /// No description provided for @verification_code_desc.
  ///
  /// In en, this message translates to:
  /// **'Enter the 4-digit code sent to your email address'**
  String get verification_code_desc;

  /// No description provided for @otp_code.
  ///
  /// In en, this message translates to:
  /// **'OTP Code'**
  String get otp_code;

  /// No description provided for @verify.
  ///
  /// In en, this message translates to:
  /// **'Verify'**
  String get verify;

  /// No description provided for @resend_code.
  ///
  /// In en, this message translates to:
  /// **'Resend Code'**
  String get resend_code;

  /// No description provided for @create_new_password.
  ///
  /// In en, this message translates to:
  /// **'Create New Password'**
  String get create_new_password;

  /// No description provided for @reset_password.
  ///
  /// In en, this message translates to:
  /// **'Reset Password'**
  String get reset_password;

  /// No description provided for @back_pain_spinal.
  ///
  /// In en, this message translates to:
  /// **'Back pain and spinal'**
  String get back_pain_spinal;

  /// No description provided for @chronic_neck_pain.
  ///
  /// In en, this message translates to:
  /// **'Chronic neck pain'**
  String get chronic_neck_pain;

  /// No description provided for @lower_back_stiffness.
  ///
  /// In en, this message translates to:
  /// **'Lower back stiffness'**
  String get lower_back_stiffness;

  /// No description provided for @shoulder_pain_injury.
  ///
  /// In en, this message translates to:
  /// **'Shoulder pain after injury'**
  String get shoulder_pain_injury;

  /// No description provided for @spinal_nerve_irritation.
  ///
  /// In en, this message translates to:
  /// **'Spinal nerve irritation'**
  String get spinal_nerve_irritation;

  /// No description provided for @chest_pain_short_breath.
  ///
  /// In en, this message translates to:
  /// **'Chest pain and short breath'**
  String get chest_pain_short_breath;

  /// No description provided for @reject.
  ///
  /// In en, this message translates to:
  /// **'Reject'**
  String get reject;

  /// No description provided for @accept.
  ///
  /// In en, this message translates to:
  /// **'Accept'**
  String get accept;

  /// No description provided for @articles.
  ///
  /// In en, this message translates to:
  /// **'Articles'**
  String get articles;

  /// No description provided for @create_article.
  ///
  /// In en, this message translates to:
  /// **'Create Article'**
  String get create_article;

  /// No description provided for @enter_title.
  ///
  /// In en, this message translates to:
  /// **'Enter title'**
  String get enter_title;

  /// No description provided for @enter_content.
  ///
  /// In en, this message translates to:
  /// **'Enter content'**
  String get enter_content;

  /// No description provided for @no_articles.
  ///
  /// In en, this message translates to:
  /// **'No articles yet'**
  String get no_articles;

  /// No description provided for @patient_reviews.
  ///
  /// In en, this message translates to:
  /// **'Patient Reviews'**
  String get patient_reviews;

  /// No description provided for @review_professional.
  ///
  /// In en, this message translates to:
  /// **'Doctor was very professional and helpful.'**
  String get review_professional;

  /// No description provided for @review_excellent.
  ///
  /// In en, this message translates to:
  /// **'Excellent experience, highly recommended.'**
  String get review_excellent;

  /// No description provided for @review_good_wait.
  ///
  /// In en, this message translates to:
  /// **'Good doctor but waiting time was long.'**
  String get review_good_wait;

  /// No description provided for @edit_profile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get edit_profile;

  /// No description provided for @neurologist.
  ///
  /// In en, this message translates to:
  /// **'Neurologist'**
  String get neurologist;

  /// No description provided for @license_number.
  ///
  /// In en, this message translates to:
  /// **'License Number'**
  String get license_number;

  /// No description provided for @medical_license.
  ///
  /// In en, this message translates to:
  /// **'Medical License'**
  String get medical_license;

  /// No description provided for @experienced_neurologist.
  ///
  /// In en, this message translates to:
  /// **'Experienced neurologist with a strong background in patient care'**
  String get experienced_neurologist;

  /// No description provided for @price.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get price;

  /// No description provided for @hello_doctor.
  ///
  /// In en, this message translates to:
  /// **'Hello doctor'**
  String get hello_doctor;

  /// No description provided for @how_can_help.
  ///
  /// In en, this message translates to:
  /// **'How can I help you?'**
  String get how_can_help;

  /// No description provided for @field_required.
  ///
  /// In en, this message translates to:
  /// **'This field is required'**
  String get field_required;

  /// No description provided for @email_required.
  ///
  /// In en, this message translates to:
  /// **'Email is required'**
  String get email_required;

  /// No description provided for @invalid_email.
  ///
  /// In en, this message translates to:
  /// **'Invalid email address'**
  String get invalid_email;

  /// No description provided for @password_required.
  ///
  /// In en, this message translates to:
  /// **'Password is required'**
  String get password_required;

  /// No description provided for @password_min.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 6 characters'**
  String get password_min;

  /// No description provided for @confirm_password_required.
  ///
  /// In en, this message translates to:
  /// **'Confirm password is required'**
  String get confirm_password_required;

  /// No description provided for @passwords_not_match.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get passwords_not_match;

  /// No description provided for @title_required.
  ///
  /// In en, this message translates to:
  /// **'Title is required'**
  String get title_required;

  /// No description provided for @title_min.
  ///
  /// In en, this message translates to:
  /// **'Title must be at least 3 characters'**
  String get title_min;

  /// No description provided for @description_required.
  ///
  /// In en, this message translates to:
  /// **'Description is required'**
  String get description_required;

  /// No description provided for @description_min.
  ///
  /// In en, this message translates to:
  /// **'Description must be at least 10 characters'**
  String get description_min;

  /// No description provided for @description_max.
  ///
  /// In en, this message translates to:
  /// **'Description must not exceed 300 characters'**
  String get description_max;

  /// No description provided for @date_required.
  ///
  /// In en, this message translates to:
  /// **'Event date is required'**
  String get date_required;

  /// No description provided for @date_past.
  ///
  /// In en, this message translates to:
  /// **'Date cannot be in the past'**
  String get date_past;

  /// No description provided for @time_required.
  ///
  /// In en, this message translates to:
  /// **'Event time is required'**
  String get time_required;

  /// No description provided for @date_time_required.
  ///
  /// In en, this message translates to:
  /// **'Date & Time Event are required'**
  String get date_time_required;

  /// No description provided for @no_events_found.
  ///
  /// In en, this message translates to:
  /// **'No Events Found'**
  String get no_events_found;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
