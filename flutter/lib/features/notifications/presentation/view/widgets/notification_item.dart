import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/notifications/domain/entities/notification_entity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:intl/intl.dart';

class NotificationItem extends StatelessWidget {
  final NotificationEntity notification;

  const NotificationItem({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context) {
    final formattedDate = DateFormat(
      'dd MMM yyyy • hh:mm a',
    ).format(notification.createdAt);

    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: notification.read
            ? AppColors.white
            : const Color(0xffF5F9FF),
        borderRadius: BorderRadius.circular(18.r),
        border: Border.all(
          color: notification.read
              ? Colors.grey.shade200
              : AppColors.blue.withOpacity(.3),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Container(
            width: 48.w,
            height: 48.w,
            decoration: BoxDecoration(
              color:
                  AppColors.primaryColor.withOpacity(
                .1,
              ),
              borderRadius:
                  BorderRadius.circular(14.r),
            ),
            child: Icon(
              Icons.notifications_active_rounded,
              color: AppColors.primaryColor,
              size: 26.sp,
            ),
          ),

          SizedBox(width: 14.w),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextApp(
                        text: notification.title,
                        fontSize: 15.sp,
                        weight:
                            AppTextWeight.bold,
                        color:
                            AppColors.black,
                      ),
                    ),

                    if (!notification.read)
                      Container(
                        width: 10.w,
                        height: 10.w,
                        decoration:
                            const BoxDecoration(
                          color: Colors.red,
                          shape:
                              BoxShape.circle,
                        ),
                      ),
                  ],
                ),

                SizedBox(height: 8.h),

                TextApp(
                  text: notification.message,
                  fontSize: 13.sp,
                  color: AppColors.grey,
                  maxLines: 3,
                  overflow:
                      TextOverflow.ellipsis,
                ),

                SizedBox(height: 12.h),

                Row(
                  children: [
                    Icon(
                      Icons.schedule,
                      size: 14.sp,
                      color: AppColors.grey,
                    ),
                    SizedBox(width: 5.w),
                    TextApp(
                      text: formattedDate,
                      fontSize: 12.sp,
                      color: AppColors.grey,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}