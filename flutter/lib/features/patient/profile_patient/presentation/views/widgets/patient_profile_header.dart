import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_states.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientProfileHeader extends StatelessWidget {
  final ProfileState state;

  const PatientProfileHeader({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    String name = "";
    String email = "";
    String? personalPhoto;

    if (state is ProfileSuccess) {
      final profile = (state as ProfileSuccess).profile;

      name = profile.fullName;
      email = profile.email;
      personalPhoto = profile.personalPhoto;
    }

    final imageUrl = personalPhoto != null && personalPhoto.isNotEmpty
        ? "https://tender-morna-axon-fp-b76b6646.koyeb.app$personalPhoto"
        : null;

    return CustomAppBar(
      height: 220.h,
      showBackButton: false,
      titleAlignment: Alignment.center,
      titleWidget: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 42.r,
            backgroundColor: Colors.white,
            child: ClipOval(
              child: imageUrl != null
                  ? Image.network(
                      imageUrl,
                      width: 78.r,
                      height: 78.r,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) {
                        return Image.asset(
                          AppImages.body,
                          width: 78.r,
                          height: 78.r,
                          fit: BoxFit.cover,
                        );
                      },
                    )
                  : Image.asset(
                      AppImages.body,
                      width: 78.r,
                      height: 78.r,
                      fit: BoxFit.cover,
                    ),
            ),
          ),
          SizedBox(height: 12.h),
          TextApp(
            text: name,
            fontSize: 18.sp,
            weight: AppTextWeight.bold,
            color: AppColors.white,
          ),
          SizedBox(height: 4.h),
          TextApp(text: email, fontSize: 13.sp, color: Colors.white70),
        ],
      ),
    );
  }
}
