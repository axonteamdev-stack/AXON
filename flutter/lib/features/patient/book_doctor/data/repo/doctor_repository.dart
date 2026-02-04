import '../models/doctor_model.dart';
import '../models/doctor_review_model.dart';
import 'package:Axon/core/style/app_images.dart';

class DoctorRepository {
  List<DoctorModel> getDoctors() {
    return [
      DoctorModel(
        id: '1',
        name: 'Dr Abdallah Hassan',
        specialty: 'Heart',
        image: AppImages.onboarding1,
        price: 300,
        yearsOfExperience: 10,
        about:
            'Cardiology specialist with strong experience in heart diseases, hypertension, and cardiac emergencies.',
        reviews: [
          DoctorReviewModel(
            name: 'Ahmed Hassan',
            image: AppImages.onboarding2,
            rating: 4.5,
            comment: 'Very professional doctor',
          ),
          DoctorReviewModel(
            name: 'Mohamed Ali',
            image: AppImages.onboarding3,
            rating: 5,
            comment: 'Excellent explanation',
          ),
        ],
      ),

      DoctorModel(
        id: '2',
        name: 'Dr Nour El Din',
        specialty: 'Heart',
        image: AppImages.onboarding2,
        price: 420,
        yearsOfExperience: 14,
        about:
            'Senior cardiologist specialized in cardiac diagnostics and long-term heart care.',
        reviews: [
          DoctorReviewModel(
            name: 'Sara Mahmoud',
            image: AppImages.onboarding1,
            rating: 5,
            comment: 'Best cardiologist I met',
          ),
        ],
      ),

      DoctorModel(
        id: '3',
        name: 'Dr Mohamed Ali',
        specialty: 'Bones',
        image: AppImages.onboarding3,
        price: 350,
        yearsOfExperience: 9,
        about:
            'Orthopedic specialist focused on bone fractures, joint pain, and sports injuries.',
        reviews: [
          DoctorReviewModel(
            name: 'Omar Adel',
            image: AppImages.onboarding2,
            rating: 4,
            comment: 'Good treatment and follow-up',
          ),
        ],
      ),

      DoctorModel(
        id: '4',
        name: 'Dr Karim Youssef',
        specialty: 'Bones',
        image: AppImages.onboarding1,
        price: 390,
        yearsOfExperience: 11,
        about:
            'Experienced orthopedic doctor providing advanced care for joint and spine conditions.',
        reviews: [
          DoctorReviewModel(
            name: 'Hany Fathy',
            image: AppImages.onboarding3,
            rating: 5,
            comment: 'Highly recommended',
          ),
        ],
      ),

      DoctorModel(
        id: '5',
        name: 'Dr Sara Mahmoud',
        specialty: 'Psychology',
        image: AppImages.onboarding2,
        price: 400,
        yearsOfExperience: 7,
        about:
            'Clinical psychologist specializing in stress management, anxiety, and emotional wellbeing.',
        reviews: [
          DoctorReviewModel(
            name: 'Lina Samir',
            image: AppImages.onboarding1,
            rating: 5,
            comment: 'Very understanding and calm',
          ),
        ],
      ),

      DoctorModel(
        id: '6',
        name: 'Dr Reem Adel',
        specialty: 'Psychology',
        image: AppImages.onboarding3,
        price: 360,
        yearsOfExperience: 6,
        about:
            'Psychologist focused on personal development and mental health support.',
        reviews: [
          DoctorReviewModel(
            name: 'Nada Hassan',
            image: AppImages.onboarding2,
            rating: 4.5,
            comment: 'Helped me a lot',
          ),
        ],
      ),

      DoctorModel(
        id: '7',
        name: 'Dr Ahmed Salah',
        specialty: 'Neuro',
        image: AppImages.onboarding1,
        price: 450,
        yearsOfExperience: 12,
        about:
            'Neurology specialist treating nervous system disorders and chronic headaches.',
        reviews: [
          DoctorReviewModel(
            name: 'Karim Tarek',
            image: AppImages.onboarding3,
            rating: 4,
            comment: 'Professional and calm',
          ),
        ],
      ),

      DoctorModel(
        id: '8',
        name: 'Dr Tarek Mahmoud',
        specialty: 'Neuro',
        image: AppImages.onboarding2,
        price: 500,
        yearsOfExperience: 15,
        about:
            'Senior neurologist with extensive experience in brain and nerve disorders.',
        reviews: [
          DoctorReviewModel(
            name: 'Mostafa Ali',
            image: AppImages.onboarding1,
            rating: 5,
            comment: 'Excellent diagnosis',
          ),
        ],
      ),

      DoctorModel(
        id: '9',
        name: 'Dr Omar Adel',
        specialty: 'Internal',
        image: AppImages.onboarding3,
        price: 320,
        yearsOfExperience: 8,
        about:
            'Internal medicine doctor providing comprehensive diagnosis and treatment.',
        reviews: [
          DoctorReviewModel(
            name: 'Heba Mohamed',
            image: AppImages.onboarding2,
            rating: 4.5,
            comment: 'Very good follow up',
          ),
        ],
      ),

      DoctorModel(
        id: '10',
        name: 'Dr Hossam Fathy',
        specialty: 'Internal',
        image: AppImages.onboarding1,
        price: 340,
        yearsOfExperience: 10,
        about:
            'Internal medicine consultant focused on chronic disease management.',
        reviews: [
          DoctorReviewModel(
            name: 'Youssef Adel',
            image: AppImages.onboarding3,
            rating: 4,
            comment: 'Clear explanation',
          ),
        ],
      ),

      DoctorModel(
        id: '11',
        name: 'Dr Seif Ragab',
        specialty: 'Kidney',
        image: AppImages.onboarding2,
        price: 360,
        yearsOfExperience: 9,
        about:
            'Nephrology specialist treating kidney diseases and renal conditions.',
        reviews: [
          DoctorReviewModel(
            name: 'Mostafa Samir',
            image: AppImages.onboarding1,
            rating: 5,
            comment: 'Very knowledgeable',
          ),
        ],
      ),

      DoctorModel(
        id: '12',
        name: 'Dr Mahmoud Saeed',
        specialty: 'Kidney',
        image: AppImages.onboarding3,
        price: 380,
        yearsOfExperience: 13,
        about:
            'Kidney specialist experienced in dialysis and chronic kidney care.',
        reviews: [
          DoctorReviewModel(
            name: 'Alaa Ahmed',
            image: AppImages.onboarding2,
            rating: 4.5,
            comment: 'Professional and kind',
          ),
        ],
      ),

      DoctorModel(
        id: '13',
        name: 'Dr Lina Samir',
        specialty: 'Heart',
        image: AppImages.onboarding1,
        price: 410,
        yearsOfExperience: 8,
        about:
            'Cardiology doctor focusing on preventive heart care and lifestyle improvement.',
        reviews: [
          DoctorReviewModel(
            name: 'Mariam Tamer',
            image: AppImages.onboarding3,
            rating: 5,
            comment: 'Excellent care',
          ),
        ],
      ),

      DoctorModel(
        id: '14',
        name: 'Dr Adel Kamal',
        specialty: 'Bones',
        image: AppImages.onboarding2,
        price: 370,
        yearsOfExperience: 10,
        about:
            'Orthopedic doctor with strong background in joint replacement and rehab.',
        reviews: [
          DoctorReviewModel(
            name: 'Amr Saad',
            image: AppImages.onboarding1,
            rating: 4,
            comment: 'Good experience',
          ),
        ],
      ),

      DoctorModel(
        id: '15',
        name: 'Dr Rania Mostafa',
        specialty: 'Psychology',
        image: AppImages.onboarding3,
        price: 390,
        yearsOfExperience: 9,
        about:
            'Mental health specialist helping patients with stress and emotional balance.',
        reviews: [
          DoctorReviewModel(
            name: 'Salma Ahmed',
            image: AppImages.onboarding2,
            rating: 5,
            comment: 'Very supportive',
          ),
        ],
      ),

      DoctorModel(
        id: '16',
        name: 'Dr Islam Farouk',
        specialty: 'Neuro',
        image: AppImages.onboarding1,
        price: 480,
        yearsOfExperience: 14,
        about:
            'Neurology consultant specialized in nerve pain and neurological disorders.',
        reviews: [
          DoctorReviewModel(
            name: 'Nader Ali',
            image: AppImages.onboarding3,
            rating: 4.5,
            comment: 'Accurate diagnosis',
          ),
        ],
      ),

      DoctorModel(
        id: '17',
        name: 'Dr Yara Khaled',
        specialty: 'Internal',
        image: AppImages.onboarding2,
        price: 310,
        yearsOfExperience: 6,
        about:
            'Internal medicine doctor focused on early diagnosis and patient education.',
        reviews: [
          DoctorReviewModel(
            name: 'Rehab Samir',
            image: AppImages.onboarding1,
            rating: 4,
            comment: 'Friendly and clear',
          ),
        ],
      ),

      DoctorModel(
        id: '18',
        name: 'Dr Hassan Nabil',
        specialty: 'Kidney',
        image: AppImages.onboarding3,
        price: 400,
        yearsOfExperience: 12,
        about:
            'Experienced nephrologist treating complex kidney conditions.',
        reviews: [
          DoctorReviewModel(
            name: 'Tamer Adel',
            image: AppImages.onboarding2,
            rating: 5,
            comment: 'Very experienced doctor',
          ),
        ],
      ),

      DoctorModel(
        id: '19',
        name: 'Dr Mona Adel',
        specialty: 'Heart',
        image: AppImages.onboarding1,
        price: 390,
        yearsOfExperience: 9,
        about:
            'Heart specialist focusing on women’s cardiovascular health.',
        reviews: [
          DoctorReviewModel(
            name: 'Rana Hassan',
            image: AppImages.onboarding3,
            rating: 4.5,
            comment: 'Great follow up',
          ),
        ],
      ),

      DoctorModel(
        id: '20',
        name: 'Dr Bassem Tarek',
        specialty: 'Bones',
        image: AppImages.onboarding2,
        price: 360,
        yearsOfExperience: 11,
        about:
            'Orthopedic specialist with focus on bone pain and mobility recovery.',
        reviews: [
          DoctorReviewModel(
            name: 'Khaled Mahmoud',
            image: AppImages.onboarding1,
            rating: 4,
            comment: 'Very helpful',
          ),
        ],
      ),
    ];
  }
}
