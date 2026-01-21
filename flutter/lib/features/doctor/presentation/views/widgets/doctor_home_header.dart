import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/doctor/presentation/manager/home/doctor_home_cubit.dart';
import 'package:Axon/features/doctor/presentation/views/widgets/header_icons.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/notification_icon.dart'
    as patient_notification;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorHomeHeader extends StatelessWidget {
  const DoctorHomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final requestsCount =
        context.select<DoctorHomeCubit, int>((cubit) => cubit.requestsCount);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 56.w,
              height: 56.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primaryColor.withOpacity(0.12),
              ),
              child: ClipOval(
                child: Image.asset(
                  AppImages.onboarding3,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            SizedBox(width: 12.w),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextApp(
                  text: 'Hi, Dr Abdallah',
                  weight: AppTextWeight.bold,
                  fontSize: 20,
                ),
                SizedBox(height: 6),
                TextApp(
                  maxLines: 2,
                  text: 'Manage your patients easily',
                  color: AppColors.grey,
                  fontSize: 13,
                ),
              ],
            ),
          ],
        ),
        Row(
          children: [
            HeaderIcon(
              icon: Icons.search,
              onTap: () {},
            ),
            SizedBox(width: 10.w),
            NotificationIcon(count: requestsCount, onTap: () {},)
           
          ],
        ),
      ],
    );
  }
}
