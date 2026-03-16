import 'package:Axon/core/extensions/localization_ext.dart';
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
              scrolledUnderElevation: 0,
              surfaceTintColor: Colors.transparent,
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
              title: TextApp(
                text: context.l10n.change_password,
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

                    FormLabel(text: context.l10n.current_password),
                    CustomTextField(
                      controller: cubit.currentCtrl,
                      hintText: context.l10n.enter_current_password,
                      isPassword: true,
                      validator: (v) =>
                          v == null || v.isEmpty
                              ? context.l10n.field_required
                              : null,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: context.l10n.new_password),
                    CustomTextField(
                      controller: cubit.newCtrl,
                      hintText: context.l10n.enter_new_password,
                      isPassword: true,
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return context.l10n.password_required;
                        }
                        if (v.length < 8) {
                          return context.l10n.password_min;
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: context.l10n.confirm_new_password),
                    CustomTextField(
                      controller: cubit.confirmCtrl,
                      hintText: context.l10n.confirm_new_password,
                      isPassword: true,
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return context.l10n.confirm_password_required;
                        }
                        if (v != cubit.newCtrl.text) {
                          return context.l10n.passwords_not_match;
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 35.h),

                    CustomButton(
                      text: context.l10n.update_password,
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
