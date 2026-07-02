// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:flutter_screenutil/flutter_screenutil.dart';
// import 'package:flutter_svg/flutter_svg.dart';
// import 'package:Axon/core/extensions/context_extension.dart';
// import 'package:Axon/core/helpers/validation_helper.dart';
// import 'package:Axon/core/routes/app_routes.dart';
// import 'package:Axon/core/style/app_images.dart';
// import 'package:Axon/core/style/colors.dart';
// import 'package:Axon/core/style/app_text_styles.dart';
// import 'package:Axon/core/widgets/custom_button.dart';
// import 'package:Axon/core/widgets/custom_text_field.dart';
// import 'package:Axon/core/widgets/text_app.dart';
// import 'package:Axon/features/auth/Presentation/manager/reset_password/reset_password_cubit.dart';

// class ResetPasswordView extends StatelessWidget {
//   const ResetPasswordView({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (_) => ResetPasswordCubit(),
//       child: BlocBuilder<ResetPasswordCubit, ResetPasswordState>(
//         builder: (context, state) {
//           final cubit = context.read<ResetPasswordCubit>();

//           return Scaffold(
//             body: Stack(
//               children: [
//                 SvgPicture.asset(
//                   AppImages.background,
//                   fit: BoxFit.cover,
//                   width: double.infinity,
//                   height: double.infinity,
//                 ),

//                 SafeArea(
//                   child: Center(
//                     child: SingleChildScrollView(
//                       physics: const BouncingScrollPhysics(),
//                       child: Padding(
//                         padding: EdgeInsets.symmetric(horizontal: 24.w),
//                         child: Column(
//                           mainAxisSize: MainAxisSize.min,
//                           crossAxisAlignment: CrossAxisAlignment.stretch,
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             TextApp(
//                               text: "Reset password",
//                               weight: AppTextWeight.bold,
//                               fontSize: 45.sp,
//                               color: AppColors.black,
//                               textAlign: TextAlign.center,
//                             ),

//                             SizedBox(height: 80.h),

//                             CustomTextField(
//                               controller: cubit.emailController,
//                               hintText: "Email",
//                               suffixIcon: const Icon(
//                                 Icons.email_rounded,
//                                 color: AppColors.primaryColor,
//                                 size: 20,
//                               ),
//                               validator: ValidationHelper.validateEmail,
//                             ),

//                             SizedBox(height: 100.h),

//                             CustomButton(
//                               onPressed: state is ResetPasswordLoading
//                                   ? () {}
//                                   : () => cubit.sendResetLink(context),
//                               text: 'Send Reset Link',
//                               fontWeight: ButtonTextWeight.bold,

//                               width: 308.w,
//                               height: 41.h,
//                               borderRadius: 10.r,
//                               fontSize: 22.sp,
//                               isLoading: state is ResetPasswordLoading,
//                               gradient: const LinearGradient(
//                                 begin: Alignment.topCenter,
//                                 end: Alignment.bottomCenter,
//                                 colors: [
//                                   AppColors.grey,
//                                   AppColors.primaryColor,
//                                 ],
//                                 stops: [0.0, 0.8942],
//                               ),
//                               shadowColor: const Color(0xFF0C2944),
//                             ),

//                             SizedBox(height: 24.h),

//                             GestureDetector(
//                               onTap: () {
//                                 context.pushReplacementNamed(AppRoutes.login);
//                               },
//                               child: TextApp(
//                                 text: "Back to Login",
//                                 color: AppColors.grey,
//                                 fontSize: 21.sp,
//                                 weight: AppTextWeight.bold,
//                                 shadow: const [
//                                   Shadow(
//                                     offset: Offset(0, 1),
//                                     blurRadius: 2,
//                                     color: Color(0x66000000),
//                                   ),
//                                 ],
//                                 textAlign: TextAlign.center,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
