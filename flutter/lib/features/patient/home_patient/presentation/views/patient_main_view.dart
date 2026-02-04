import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/patient/chatting_patient/presntation/views/patient_doctor_chats_view.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/views/patient_community_view.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/home_bottom_nav_bar.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/home_view.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/patient_profile_view.dart';

class PatientMainView extends StatefulWidget {
  const PatientMainView({super.key});

  @override
  State<PatientMainView> createState() => _PatientMainViewState();
}

class _PatientMainViewState extends State<PatientMainView> {
  int currentIndex = 0;

  final pages = const [
    HomeView(),
  

   PatientDoctorChatsView(), 
      PatientCommunityView(),
    PatientProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: pages[currentIndex],
      bottomNavigationBar:HomeBottomNavBar(
  currentIndex: currentIndex,
  onTap: (index) {
    setState(() => currentIndex = index);
  },
  items: const [
    NavItem(icon: AppImages.home, label: 'Home'),
    NavItem(icon: AppImages.chat, label: 'Chats'),
    NavItem(icon: AppImages.community, label: 'Community'),
    NavItem(icon: AppImages.profile, label: 'Profile'),
  ],
)

    );
  }
}
