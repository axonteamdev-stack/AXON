import 'package:Axon/features/patient/profile_patient/presentation/manager/change_password/change_password_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/change_password/change_password_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';

class ChangePasswordView extends StatelessWidget {
  const ChangePasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ChangePasswordCubit(),
      child: BlocBuilder<ChangePasswordCubit, ChangePasswordState>(
        builder: (context, state) {
          final cubit = context.read<ChangePasswordCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            appBar: AppBar(
              backgroundColor: AppColors.white,
              elevation: 0,
              titleSpacing: 0,
              leading: IconButton(
                icon: const Icon(
                  Icons.arrow_back_ios,
                  color: AppColors.black,
                ),
                onPressed: () => Navigator.pop(context),
              ),
              title: const TextApp(
                text: 'Change Password',
                fontSize: 16,
                weight: AppTextWeight.semiBold,
                color: AppColors.black,
              ),
            ),
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Form(
                key: cubit.formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 24.h),

                    const FormLabel(text: 'Current Password'),
                    CustomTextField(
                      controller: cubit.currentCtrl,
                      hintText: 'Enter current password',
                      isPassword: true,
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Required' : null,
                    ),

                    SizedBox(height: 22.h),

                    const FormLabel(text: 'New Password'),
                    CustomTextField(
                      controller: cubit.newCtrl,
                      hintText: 'Enter new password',
                      isPassword: true,
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Required';
                        }
                        if (v.length < 8) {
                          return 'At least 8 characters';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 22.h),

                    const FormLabel(text: 'Confirm New Password'),
                    CustomTextField(
                      controller: cubit.confirmCtrl,
                      hintText: 'Confirm new password',
                      isPassword: true,
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Required';
                        }
                        if (v != cubit.newCtrl.text) {
                          return 'Passwords do not match';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 35.h),

                    CustomButton(
                      text: 'Update Password',
                      height: 50.h,
                      onPressed: () => cubit.submit(context),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
