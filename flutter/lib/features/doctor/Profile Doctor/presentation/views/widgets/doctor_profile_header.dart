import 'dart:io';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class DoctorProfileHeader extends StatelessWidget {
  const DoctorProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DoctorProfileCubit, DoctorProfileState>(
      builder: (context, state) {
        final cubit = context.read<DoctorProfileCubit>();

        return Container(
          padding: EdgeInsets.only(
            top: 28.h,
            bottom: 20.h,
            left: 20.w,
            right: 20.w,
          ),
          width: double.infinity,
          decoration: const BoxDecoration(
            color: AppColors.primaryColor,
            borderRadius: BorderRadius.vertical(
              bottom: Radius.circular(24),
            ),
          ),
          child: Column(
            children: [
             GestureDetector(
  onTap: null,
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
          radius: 48.r,
          backgroundColor:
              AppColors.white.withOpacity(0.25),
          backgroundImage: state.image != null
              ? FileImage(File(state.image!))
              : null,
          child: state.image == null
              ? Icon(
                  Icons.person,
                  size: 42.sp,
                  color: AppColors.primaryColor,
                )
              : null,
        ),
      ),
    ],
  ),
),

              SizedBox(height: 14.h),
              TextApp(
                text: state.name,
                fontSize: 18,
                weight: AppTextWeight.bold,
                color: AppColors.white,
              ),
              SizedBox(height: 4.h),
              TextApp(
                text: state.email,
                fontSize: 13,
                color: AppColors.white,
              ),
              SizedBox(height: 2.h),
              TextApp(
                text: state.profession,
                fontSize: 12,
                color: AppColors.white,
              ),
            ],
          ),
        );
      },
    );
  }
}
