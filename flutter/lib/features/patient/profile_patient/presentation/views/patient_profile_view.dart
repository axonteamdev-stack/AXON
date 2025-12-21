import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/home_bottom_nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';
import 'widgets/patient_profile_header.dart';
import 'widgets/patient_profile_menu_item.dart';

class PatientProfileView extends StatelessWidget {
  const PatientProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientProfileCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        bottomNavigationBar: const HomeBottomNavBar(),
        body: BlocBuilder<PatientProfileCubit, PatientProfileState>(
          builder: (context, state) {
            return CustomScrollView(
              slivers: [
                SliverPersistentHeader(
                  pinned: true,
                  delegate: _PatientProfileHeaderDelegate(
                    child: PatientProfileHeader(state: state),
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    [
                      const SizedBox(height: 16),

                      PatientProfileMenuItem(
                        icon: Icons.person_outline,
                        title: 'Edit Basic Information',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditBasicInfo,
                            arguments: state,
                          );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.medical_information_outlined,
                        title: 'Edit Medical Profile',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditMedicalProfile,
                            arguments: state,
                          );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.favorite_outline,
                        title: 'Edit Health Conditions',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditHealthConditions,
                            // arguments: state.healthConditions,
                          );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.error_outline,
                        title: 'Edit Allergies',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditAllergies,
                            // arguments: state.allergies,
                          );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.monitor_heart_outlined,
                        title: 'Edit Radiology',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditRadiology,
                            arguments: state,
                          );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.science_outlined,
                        title: 'Edit Lab Tests',
                        dense: true,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.patientEditLabTests,
                            // arguments: state.labTests,
                          );
                        },
                      ),

                      const SizedBox(height: 8),

                      PatientProfileMenuItem(
                        icon: Icons.lock_outline,
                        title: 'Change Password',
                        dense: true,
                        onTap: () {
                          // Navigator.pushNamed(
                          //   context,
                          //   AppRoutes.changePassword,
                          // );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.notifications_none,
                        title: 'Notification Settings',
                        dense: true,
                        onTap: () {
                          // Navigator.pushNamed(
                          //   context,
                          //   AppRoutes.notificationSettings,
                          // );
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.logout,
                        title: 'Logout',
                        dense: true,
                        onTap: () {
                          // context.read<PatientProfileCubit>().logout();
                        },
                      ),

                      PatientProfileMenuItem(
                        icon: Icons.delete_outline,
                        title: 'Delete Account',
                        dense: true,
                        onTap: () {
                          // Navigator.pushNamed(
                          //   context,
                          //   AppRoutes.deleteAccount,
                          // );
                        },
                      ),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _PatientProfileHeaderDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  _PatientProfileHeaderDelegate({required this.child});

  @override
  double get minExtent => 190;

  @override
  double get maxExtent => 190;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return child;
  }

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}
