import 'dart:io';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/doctor/Profile Doctor/presentation/manager/profile doctor/doctor_profile_cubit.dart';

class DoctorEditProfileView extends StatelessWidget {
  const DoctorEditProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DoctorProfileCubit, DoctorProfileState>(
      builder: (context, state) {
        final cubit = context.read<DoctorProfileCubit>();

        return Scaffold(
          backgroundColor: AppColors.white,
          appBar: AppBar(
            
            scrolledUnderElevation: 0, 
  surfaceTintColor: Colors.transparent, 
            backgroundColor: AppColors.white,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(
                Icons.arrow_back_ios,
                color: AppColors.black,
              ),
              onPressed: () => Navigator.pop(context),
            ),
            title: const Text(
              'Edit Profile',
              style: TextStyle(color: AppColors.black),
            ),
          ),
          body: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 24.h),

                Center(
                  child: GestureDetector(
                    onTap: state.isEdit ? cubit.pickImage : null,
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          padding: EdgeInsets.all(3.w),
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.white,
                          ),
                          child: CircleAvatar(
                            radius: 52.r,
                            backgroundColor:
                                AppColors.primaryColor.withOpacity(0.15),
                            backgroundImage: state.image != null
                                ? FileImage(File(state.image!))
                                : const AssetImage(
                                    AppImages.onboarding3,
                                  ) as ImageProvider,
                          ),
                        ),

                        if (state.isEdit)
                          Container(
                            width: 30.w,
                            height: 30.w,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.primaryColor,
                              border: Border.all(
                                color: AppColors.white,
                                width: 2,
                              ),
                            ),
                            child: Icon(
                              Icons.add,
                              size: 18.sp,
                              color: AppColors.white,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 32.h),

                const FormLabel(text: 'Full Name'),
                CustomTextField(
                  enabled: false,
                  controller: TextEditingController(text: state.name),
                ),

                SizedBox(height: 20.h),

                const FormLabel(text: 'Email'),
                CustomTextField(
                  controller: cubit.emailCtrl,
                  enabled: state.isEdit,
                ),

                SizedBox(height: 20.h),

                const FormLabel(text: 'Phone Number'),
                CustomTextField(
                  controller: cubit.phoneCtrl,
                  enabled: state.isEdit,
                ),

                SizedBox(height: 20.h),

                const FormLabel(text: 'Years of Experience'),
                CustomTextField(
                  controller: cubit.expCtrl,
                  enabled: state.isEdit,
                  keyboardType: TextInputType.number,
                ),

                SizedBox(height: 20.h),

                const FormLabel(text: 'Specialization'),
                CustomTextField(
                  enabled: false,
                  controller:
                      TextEditingController(text: state.profession),
                ),

                SizedBox(height: 20.h),

                const FormLabel(text: 'License Number'),
                CustomTextField(
                  enabled: false,
                  controller: TextEditingController(
                    text: state.licenseNumber,
                  ),
                ),

                SizedBox(height: 12.h),

const FormLabel(text: 'Medical License'),

SizedBox(height: 8.h),

Container(
  width: double.infinity, 
  height: 150,
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(12),
    border: Border.all(
      color: Colors.grey.shade300,
    ),
  ),
  child: ClipRRect(
    borderRadius: BorderRadius.circular(12),
    child: Image.asset(
      state.licenseImage,
      fit: BoxFit.cover,
    ),
  ),
),



                SizedBox(height: 40.h),

                CustomButton(
                  text: state.isEdit ? 'Save' : 'Edit',
                  onPressed: () {
                    state.isEdit
                        ? cubit.updateProfile()
                        : cubit.toggleEdit();
                  },
                ),
                SizedBox(height: 40.h),
              ],
            ),
          ),
        );
      },
    );
  }
}
