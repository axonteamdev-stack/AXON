import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/di/di.dart';
import 'package:Axon/features/auth/Presentation/manager/forgot password/forgot_password_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/forgot password/forgot_password_state.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'forgot_password_otp_view.dart';

class ForgotPasswordEmailView extends StatelessWidget {
  const ForgotPasswordEmailView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<ForgotPasswordCubit>(),
      child: BlocConsumer<ForgotPasswordCubit, ForgotPasswordState>(
        listener: (context, state) {
          if (state is ForgotPasswordSuccess) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => BlocProvider.value(
                  value: context.read<ForgotPasswordCubit>(),
                  child: const ForgotPasswordOtpView(),
                ),
              ),
            );
          }
        },
        builder: (context, state) {
          final cubit = context.read<ForgotPasswordCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            body: Form(
              key: cubit.formKey,
              child: Column(
                children: [
                  const CustomAppBar(title: "Forget Password"),

                  SizedBox(height: 25.h),

                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FormLabel(text: context.l10n.email),

                        CustomTextField(
                          controller: cubit.emailController,
                          hintText: context.l10n.enter_email,
                          prefixIcon: Icon(
                            Icons.email_outlined,
                            color: Colors.grey.shade600,
                          ),
                          validator: ValidationHelper.validateEmail,
                        ),

                        const SizedBox(height: 50),

                        CustomButton(
                          text: context.l10n.send_code,
                          height: 50.h,
                          borderRadius: 10,
                          isLoading: state is ForgotPasswordLoading,
                          onPressed: () => cubit.sendEmail(context),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
