import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/doctor/Home Doctor/presentation/views/widgets/header_icons.dart';
import 'package:Axon/features/notifications/presentation/manager/notification_cubit.dart';
import 'package:Axon/features/notifications/presentation/view/notification_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorHomeHeader extends StatefulWidget {
  const DoctorHomeHeader({super.key});

  @override
  State<DoctorHomeHeader> createState() => _DoctorHomeHeaderState();
}

class _DoctorHomeHeaderState extends State<DoctorHomeHeader> {
  String doctorName = '';
  String doctorImage = '';

  @override
  void initState() {
    super.initState();
    loadDoctorData();
  }

  Future<void> loadDoctorData() async {
    final pref = SharedPref();

    doctorName = pref.getString(PrefKeys.fullName) ?? '';

    doctorImage = pref.getString(PrefKeys.personalPhoto) ?? '';

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final notificationCount = context.select<NotificationCubit, int>(
      (cubit) => cubit.unreadCount,
    );

    print('HEADER COUNT => $notificationCount');

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
                color: AppColors.primaryColor.withOpacity(.12),
              ),
              child: ClipOval(
                child: doctorImage.isNotEmpty
                    ? Image.network(
                        doctorImage,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Image.asset(
                            AppImages.boda,
                            fit: BoxFit.contain,
                          );
                        },
                      )
                    : Image.asset(AppImages.boda, fit: BoxFit.contain),
              ),
            ),

            SizedBox(width: 12.w),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextApp(
                  text: context.l10n.hi_doctor(doctorName),
                  weight: AppTextWeight.bold,
                  fontSize: 20,
                ),

                const SizedBox(height: 6),

                TextApp(
                  text: context.l10n.manage_patients,
                  color: AppColors.grey,
                  fontSize: 13,
                  maxLines: 2,
                ),
              ],
            ),
          ],
        ),

        NotificationIcon(
          count: notificationCount,
          onTap: () async {
            final cubit = context.read<NotificationCubit>();

            await cubit.getNotifications();

            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => BlocProvider.value(
                  value: cubit,
                  child: const NotificationScreen(),
                ),
              ),
            );

            if (context.mounted) {
              await context.read<NotificationCubit>().getUnreadCount();
            }
          },
        ),
      ],
    );
  }
}
