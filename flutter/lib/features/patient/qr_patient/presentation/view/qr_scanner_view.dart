import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QrPatientView extends StatelessWidget {
  const QrPatientView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,

      body: Column(
        children: [
          CustomAppBar(title: "MY QR"),
          SizedBox(height: 8.h),
          BlocBuilder<ProfileCubit, ProfileState>(
            builder: (context, state) {
              if (state is ProfileLoading) {
                return const Center(child: CircularProgressIndicator());
              }

              if (state is ProfileError) {
                return const Center(child: Text("Failed to load profile"));
              }

              if (state is ProfileSuccess) {
                return Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.w),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (state.profile.personalPhoto != null &&
                            state.profile.personalPhoto!.isNotEmpty)
                          CircleAvatar(
                            radius: 45.r,
                            backgroundImage: NetworkImage(
                              state.profile.personalPhoto!,
                            ),
                          )
                        else
                          CircleAvatar(
                            radius: 45.r,
                            child: const Icon(Icons.person, size: 40),
                          ),

                        SizedBox(height: 20.h),

                        TextApp(
                          text: state.profile.fullName,
                          fontSize: 22.sp,
                          weight: AppTextWeight.bold,
                          color: AppColors.primaryColor,
                        ),

                        SizedBox(height: 30.h),

                        Container(
                          padding: EdgeInsets.all(16.r),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20.r),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.08),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: QrImageView(
                            data:
                                "ُ${Endpoints.baseUrl}/users/patients/${state.profile.id}",
                            version: QrVersions.auto,
                            size: 200.w,
                          ),
                        ),

                        SizedBox(height: 20.h),

                        TextApp(
                          text:
                              "Show this QR code to the doctor or emergency staff",
                          textAlign: TextAlign.center,
                          fontSize: 14.sp,
                          color: Colors.grey,
                        ),
                      ],
                    ),
                  ),
                );
              }

              return const SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }
}
