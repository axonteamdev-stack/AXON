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
            const CenterIconHeader(
              imagePath: AppImages.Stethoscope,
              title: "Doctor Registration",
              subtitle: "Create your professional account",
            ),
            SizedBox(height: 30.h),
            const FormLabel(text: "Specialization"),
            BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
              builder: (context, state) {
                return ReusableDropdown(
                  hint: "Select Specialization",
                  value: state.selectedSpecialization,
                  items: const [
                    "Cardiology",
                    "Neurology",
                    "Pediatrics",
                    "Dentistry",
                  ],
                  onChanged: (v) => cubit.changeSpecialization(v!),
                );
              },
            ),
            SizedBox(height: 20.h),
            const FormLabel(text: "Years of Experience"),
            CustomTextField(
              controller: cubit.experienceCtrl,
              hintText: "Enter number years of experience",
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20.h),
            const FormLabel(text: "Medical License Number"),
            CustomTextField(
              controller: cubit.licenseCtrl,
              hintText: "ML-123456",
            ),
            SizedBox(height: 20.h),
            const FormLabel(text: "About"),
            CustomTextField(
              controller: cubit.aboutCtrl,
              hintText: "Tell us about your experience and background",
              maxLines: 4,
            ),
            SizedBox(height: 20.h),
            const FormLabel(text: "Session Price"),
CustomTextField(
  controller: cubit.priceCtrl,
  hintText: "Enter session price",
  keyboardType: TextInputType.number,
),
SizedBox(height: 20.h),

            const FormLabel(text: "Upload Medical License"),
            const UploadMedicalLicenseBox(),
            SizedBox(height: 30.h),
            CustomButton(
              text: "Create Account",
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
                  text: "Already have an account? ",
                  color: AppColors.grey,
                ),
                TextApp(text: "Login", color: AppColors.primaryColor),
              ],
            ),
            SizedBox(height: 40.h),
          ],
        ),
      ),
    );
  }
}
