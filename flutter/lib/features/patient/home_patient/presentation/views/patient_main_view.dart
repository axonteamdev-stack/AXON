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
    SizedBox(),
    SizedBox(), 
    PatientProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: pages[currentIndex],
      bottomNavigationBar: HomeBottomNavBar(
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() => currentIndex = index);
        },
      ),
    );
  }
}
