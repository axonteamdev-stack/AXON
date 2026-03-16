<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/manager/select_role/select_role_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/select_role_option_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SelectRoleView extends StatelessWidget {
  const SelectRoleView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => SelectRoleCubit(),
      child: BlocBuilder<SelectRoleCubit, SelectRoleState>(
        builder: (context, state) {
          final cubit = context.read<SelectRoleCubit>();

          return Scaffold(
            backgroundColor: Colors.white,
            body: Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Column(
                children: [
                  SizedBox(height: 32.h),

                  Center(child: Image.asset(AppImages.logoApp, width: 240.w)),

                  SelectRoleOptionCard(
<<<<<<< HEAD
                    title: "I’m a Patient",
                    subtitle: "Find doctors and book appointments",
=======
                    title: context.l10n.im_patient,
                    subtitle: context.l10n.patient_desc,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                    imagePath: AppImages.person,
                    isSelected: cubit.selectedIndex == 0,
                    onTap: () => cubit.select(0),
                  ),

                  SizedBox(height: 20.h),

                  SelectRoleOptionCard(
<<<<<<< HEAD
                    title: "I’m a Doctor",
                    subtitle: "Manage patients and consultations",
=======
                    title: context.l10n.im_doctor,
                    subtitle: context.l10n.doctor_desc,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                    imagePath: AppImages.Stethoscope,
                    isSelected: cubit.selectedIndex == 1,
                    onTap: () => cubit.select(1),
                  ),

                  const Spacer(),

                  CustomButton(
<<<<<<< HEAD
                    text: "Next",
=======
                    text: context.l10n.next,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                    fontSize: 18.sp,
                    height: 52.h,
                    borderRadius: 12,
                    onPressed: () {
                      if (cubit.selectedIndex == -1) {
                        ScaffoldMessenger.of(context).showSnackBar(
<<<<<<< HEAD
                          const SnackBar(
                            content: Text("Please select an option"),
=======
                          SnackBar(
                            content: Text(context.l10n.field_required),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                          ),
                        );
                        return;
                      }

                      if (cubit.selectedIndex == 0) {
                        Navigator.pushNamed(
                          context,
                          AppRoutes.patientMedicalProfile,
                        );
                      } else {
                        Navigator.pushNamed(
                          context,
                          AppRoutes.registrationDoctor,
                        );
                      }
                    },
                  ),

                  SizedBox(height: 40.h),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
