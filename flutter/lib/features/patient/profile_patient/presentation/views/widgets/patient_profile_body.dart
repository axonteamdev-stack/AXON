import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart'
    show PatientProfileState;
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
                title: context.l10n.edit_basic_information,
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
                title: context.l10n.edit_health_conditions,
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
                title: context.l10n.edit_allergies,
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
                title: context.l10n.edit_radiology,
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
                title: context.l10n.edit_lab_tests,
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
                title: context.l10n.change_password,
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
                title: context.l10n.notification_settings,
                dense: true,
                onTap: () {},
              ),

              PatientProfileMenuItem(
                icon: Icons.logout,
                title: context.l10n.logout,
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
                title: context.l10n.delete_account,
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
