import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/reusable_dropdown.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/upload_medical_license_box.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';

class DoctorRegistrationView extends StatelessWidget {
  DoctorRegistrationView({super.key});

  final DoctorRegistrationCubit doctorRegistrationCubit =
      getIt<DoctorRegistrationCubit>();

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DoctorRegistrationCubit, DoctorRegistrationState>(
      bloc: doctorRegistrationCubit,
      listener: (context, state) {
        if (state is DoctorRegistrationErrorMessage) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }

        if (state is DoctorRegistrationError) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Something went wrong")),
          );
        }

        if (state is DoctorRegistrationSuccess) {
          // 🔥 امسح البيانات بعد النجاح (اختياري)
          SharedPref().clearPreferences();

          Navigator.pushReplacementNamed(context, AppRoutes.home);
        }
      },
      builder: (context, state) {
        String? selected;
        XFile? licenseImage;

        if (state is DoctorRegistrationInitial) {
          selected = state.selectedSpecialization;
          licenseImage = state.licenseFile;
        }

        return Scaffold(
          backgroundColor: AppColors.white,
          body: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            child: Form(
              key: doctorRegistrationCubit.formKey,
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

                  /// specialization
                  FormLabel(text: context.l10n.specialization),
                  ReusableDropdown(
                    hint: context.l10n.select_specialization,
                    value: selected,
                    items: [
                      context.l10n.cardiology,
                      context.l10n.neurology,
                      context.l10n.pediatrics,
                      context.l10n.dentistry,
                    ],
                    onChanged: (v) {
                      if (v != null) {
                        doctorRegistrationCubit.changeSpecialization(v);
                      }
                    },
                  ),

                  SizedBox(height: 20.h),

                  /// experience
                  FormLabel(text: context.l10n.years_experience),
                  CustomTextField(
                    controller: doctorRegistrationCubit.experienceCtrl,
                    hintText: context.l10n.enter_years_experience,
                    keyboardType: TextInputType.number,
                  ),

                  SizedBox(height: 20.h),

                  /// license number
                  FormLabel(text: context.l10n.medical_license_number),
                  CustomTextField(
                    controller: doctorRegistrationCubit.licenseCtrl,
                    hintText: "ML-123456",
                  ),

                  SizedBox(height: 20.h),

                  /// about
                  FormLabel(text: context.l10n.about),
                  CustomTextField(
                    controller: doctorRegistrationCubit.aboutCtrl,
                    hintText: context.l10n.about_hint,
                    maxLines: 4,
                  ),

                  SizedBox(height: 20.h),

                  /// price
                  FormLabel(text: context.l10n.session_price),
                  CustomTextField(
                    controller: doctorRegistrationCubit.priceCtrl,
                    hintText: context.l10n.enter_session_price,
                    keyboardType: TextInputType.number,
                  ),

                  SizedBox(height: 20.h),

                  /// license image
                  FormLabel(text: context.l10n.upload_medical_license),
                  UploadMedicalLicenseBox(
                    file: licenseImage,
                    onTap: () {
                      doctorRegistrationCubit.pickImage(ImageType.license);
                    },
                  ),

                  SizedBox(height: 30.h),

                  /// button
                  CustomButton(
                    text: state is DoctorRegistrationLoading
                        ? "Loading..."
                        : context.l10n.create_account,
                    height: 50.h,
                    onPressed: doctorRegistrationCubit.doctorRegistration,
                  ),

                  SizedBox(height: 40.h),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}