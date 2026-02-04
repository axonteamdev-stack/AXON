import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/doctor_edit_profile_view.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_header.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_header_delegate.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';
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
              PatientProfileMenuItem(
                icon: Icons.edit_outlined,
                title: 'Edit Profile',
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
