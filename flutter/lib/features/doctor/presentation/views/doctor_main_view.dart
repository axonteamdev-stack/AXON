import 'package:Axon/features/doctor/presentation/views/doctor_home_view.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/home_bottom_nav_bar.dart';

class DoctorMainView extends StatefulWidget {
  const DoctorMainView({super.key});

  @override
  State<DoctorMainView> createState() => _DoctorMainViewState();
}

class _DoctorMainViewState extends State<DoctorMainView> {
  int currentIndex = 0;

  final pages = const [
    DoctorHomeView(),
    SizedBox(),
    SizedBox(), 
    SizedBox(), 
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
