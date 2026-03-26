import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/doctor_edit_profile_view.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_header.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_header_delegate.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/confirm_delete_account_sheet.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/confirm_logout_sheet.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_menu_item.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class DoctorProfileBody extends StatelessWidget {
  final DoctorProfileState state;

  const DoctorProfileBody({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPersistentHeader(
          pinned: true,
          delegate: DoctorProfileHeaderDelegate(
            child: DoctorProfileHeader(),
          ),
        ),
        SliverList(
          delegate: SliverChildListDelegate(
            [
              // ================= EDIT =================
              PatientProfileMenuItem(
                icon: Icons.edit_outlined,
                title: context.l10n.edit_profile,
                dense: true,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => BlocProvider.value(
                        value: context.read<DoctorProfileCubit>(),
                        child: const DoctorEditProfileView(),
                      ),
                    ),
                  );
                },
              ),

              // ================= PASSWORD =================
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

              // ================= NOTIFICATIONS =================
              PatientProfileMenuItem(
                icon: Icons.notifications_none,
                title: context.l10n.notification_settings,
                dense: true,
                onTap: () {},
              ),

              // ================= LOGOUT =================
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
                    builder: (sheetContext) {
                      return ConfirmLogoutSheet(
                        onConfirm: () async {
                          Navigator.pop(sheetContext);

                          await context
                              .read<DoctorProfileCubit>()
                              .logout();

                          Navigator.pushNamedAndRemoveUntil(
                            context,
                            AppRoutes.login,
                            (route) => false,
                          );
                        },
                      );
                    },
                  );
                },
              ),

              // ================= DELETE =================
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
                    builder: (sheetContext) {
                      return ConfirmDeleteAccountSheet(
                        onConfirm: () async {
                          Navigator.pop(sheetContext);

                          await context
                              .read<DoctorProfileCubit>()
                              .deleteAccount();

                          Navigator.pushNamedAndRemoveUntil(
                            context,
                            AppRoutes.login,
                            (route) => false,
                          );
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