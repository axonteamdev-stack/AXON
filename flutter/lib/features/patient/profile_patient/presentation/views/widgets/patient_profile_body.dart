import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart' show PatientProfileState;
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_header.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_menu_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/confirm_delete_account_sheet.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/confirm_logout_sheet.dart';

import 'patient_profile_header_delegate.dart';

class PatientProfileBody extends StatelessWidget {
  final PatientProfileState state;

  const PatientProfileBody({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPersistentHeader(
          pinned: true,
          delegate: PatientProfileHeaderDelegate(
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
                icon: Icons.favorite_outline,
                title: 'Edit Health Conditions',
                dense: true,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.patientEditHealthConditions,
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
                  );
                },
              ),

              const SizedBox(height: 8),

              PatientProfileMenuItem(
                icon: Icons.lock_outline,
                title: 'Change Password',
                dense: true,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.changePassword,
                  );
                },
              ),

              PatientProfileMenuItem(
                icon: Icons.notifications_none,
                title: 'Notification Settings',
                dense: true,
                onTap: () {},
              ),

              PatientProfileMenuItem(
                icon: Icons.logout,
                title: 'Logout',
                dense: true,
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    shape: const RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.vertical(top: Radius.circular(16)),
                    ),
                    builder: (context) {
                      return ConfirmLogoutSheet(
                        onConfirm: () {
                          Navigator.pop(context);
                          context.read<PatientProfileCubit>().logout();
                        },
                      );
                    },
                  );
                },
              ),

              PatientProfileMenuItem(
                icon: Icons.delete_outline,
                title: 'Delete Account',
                dense: true,
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    shape: const RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.vertical(top: Radius.circular(16)),
                    ),
                    builder: (context) {
                      return ConfirmDeleteAccountSheet(
                        onConfirm: () {
                          Navigator.pop(context);
                          context
                              .read<PatientProfileCubit>()
                              .deleteAccount();
                        },
                      );
                    },
                  );
                },
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ],
    );
  }
}
