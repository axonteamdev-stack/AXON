import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/doctor_articles_view.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/doctor_home_view.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/doctor_profile_view.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_body.dart';
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
    DoctorArticlesView(),
    DoctorProfileView(), 
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
    NavItem(icon: AppImages.book, label: 'Articles'),
    NavItem(icon: AppImages.profile, label: 'Profile'),
  ],
)


    );
  }
}
