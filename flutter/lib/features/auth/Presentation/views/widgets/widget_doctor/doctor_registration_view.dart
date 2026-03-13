import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/reusable_dropdown.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/upload_medical_license_box.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorRegistrationView extends StatelessWidget {
  const DoctorRegistrationView({super.key});

  @override
  Widget build(BuildContext context) {
    var cubit = context.watch<DoctorRegistrationCubit>();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 55.h),
            CenterIconHeader(
              imagePath: AppImages.Stethoscope,
              title: context.l10n.doctor_registration,
              subtitle: context.l10n.create_professional_account,
            ),
            SizedBox(height: 30.h),

            FormLabel(text: context.l10n.specialization),
            BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
              builder: (context, state) {
                return ReusableDropdown(
                  hint: context.l10n.select_specialization,
                  value: state.selectedSpecialization,
                  items: [
                    context.l10n.cardiology,
                    context.l10n.neurology,
                    context.l10n.pediatrics,
                    context.l10n.dentistry,
                  ],
                  onChanged: (v) => cubit.changeSpecialization(v!),
                );
              },
            ),

            SizedBox(height: 20.h),
            FormLabel(text: context.l10n.years_experience),
            CustomTextField(
              controller: cubit.experienceCtrl,
              hintText: context.l10n.enter_years_experience,
              keyboardType: TextInputType.number,
            ),

            SizedBox(height: 20.h),
            FormLabel(text: context.l10n.medical_license_number),
            CustomTextField(
              controller: cubit.licenseCtrl,
              hintText: "ML-123456",
            ),

            SizedBox(height: 20.h),
            FormLabel(text: context.l10n.about),
            CustomTextField(
              controller: cubit.aboutCtrl,
              hintText: context.l10n.about_hint,
              maxLines: 4,
            ),

            SizedBox(height: 20.h),
            FormLabel(text: context.l10n.session_price),
            CustomTextField(
              controller: cubit.priceCtrl,
              hintText: context.l10n.enter_session_price,
              keyboardType: TextInputType.number,
            ),

            SizedBox(height: 20.h),
            FormLabel(text: context.l10n.upload_medical_license),
            const UploadMedicalLicenseBox(),

            SizedBox(height: 30.h),
            CustomButton(
              text: context.l10n.create_account,
              height: 50.h,
              onPressed: () {
                cubit.submit();
                Navigator.pushNamed(
                  context,
                  AppRoutes.accountCreatedDoctor,
                );
              },
            ),

            SizedBox(height: 25.h),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextApp(
                  text: context.l10n.already_have_account,
                  color: AppColors.grey,
                ),
                TextApp(
                  text: context.l10n.login,
                  color: AppColors.primaryColor,
                ),
              ],
            ),

            SizedBox(height: 40.h),
          ],
        ),
      ),
    );
  }
}
