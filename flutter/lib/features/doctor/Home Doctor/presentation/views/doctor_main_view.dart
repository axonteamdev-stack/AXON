import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/doctor_articles_view.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/doctor_home_view.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/doctor_profile_view.dart';
import 'package:Axon/features/doctor/Reviews%20Doctor/presentation/views/doctor_reviews_view.dart';
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
    DoctorReviewsView(),
    DoctorProfileView(),
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
        items: [
          NavItem(
            icon: AppImages.home,
            label: context.l10n.home, // Home
          ),
          NavItem(
            icon: AppImages.book,
            label: context.l10n.articles,
          ),
          NavItem(
            icon: AppImages.review,
            label: context.l10n.patient_reviews,
          ),
          NavItem(
            icon: AppImages.profile,
            label: context.l10n.edit_profile,
          ),
        ],
      ),
    );
  }
}
