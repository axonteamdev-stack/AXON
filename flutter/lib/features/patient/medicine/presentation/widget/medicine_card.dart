import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MedicineCard extends StatelessWidget {
  final String id;
  final String name;
  final String frequency;
  final String nextTime;

  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const MedicineCard({
    super.key,
    required this.id,
    required this.name,
    required this.frequency,
    required this.nextTime,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(
        left: 12.h,
        right: 12.h,
      ),
      height: 230.h,
      width: double.infinity,
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(
          color: AppColors.primaryColor.withOpacity(0.5),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 24,
            spreadRadius: 2,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          /// TOP ROW (EDIT + DELETE)
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                onPressed: onEdit,
                icon: Icon(
                  Icons.edit,
                  color: AppColors.primaryColor,
                  size: 22.sp,
                ),
              ),
              IconButton(
                onPressed: onDelete,
                icon: Icon(
                  Icons.delete,
                  color: Colors.red,
                  size: 22.sp,
                ),
              ),
            ],
          ),

          SizedBox(height: 8.h),

          SizedBox(
            height: 80.h,
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    mainAxisAlignment:
                        MainAxisAlignment.center,
                    children: [
                      TextApp(
                        text: name,
                        color: AppColors.primaryColor,
                        fontSize: 16,
                        weight: AppTextWeight.bold,
                      ),

                      SizedBox(height: 8.h),

                      TextApp(
                        text: frequency,
                        color: AppColors.grey,
                        fontSize: 12,
                        weight:
                            AppTextWeight.semiBold,
                      ),

                      SizedBox(height: 8.h),

                      Row(
                        children: [
                          Icon(
                            Icons.timelapse_outlined,
                            size: 16,
                            color: AppColors.grey,
                          ),

                          SizedBox(width: 4.w),

                          TextApp(
                            text:
                                "${context.l10n.next}: $nextTime",
                            color: AppColors.grey,
                            fontSize: 12,
                            weight:
                                AppTextWeight.semiBold,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 16.h),

          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: Icon(
                      FontAwesomeIcons.check,
                      size: 16,
                      color: AppColors.white,
                    ),
                    label: TextApp(
                      text: context.l10n.taken,
                      color: AppColors.white,
                      fontSize: 16,
                      weight:
                          AppTextWeight.semiBold,
                    ),
                    style: OutlinedButton.styleFrom(
                      backgroundColor:
                          AppColors.primaryColor,
                      side: BorderSide(
                        color:
                            AppColors.primaryColor,
                      ),
                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(
                          12.r,
                        ),
                      ),
                    ),
                  ),
                ),

                SizedBox(width: 12.w),

                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: Icon(
                      FontAwesomeIcons.xmark,
                      size: 16,
                      color: Colors.red,
                    ),
                    label: TextApp(
                      text: context.l10n.skip,
                      fontSize: 16,
                      weight:
                          AppTextWeight.semiBold,
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(
                        color: Colors.red,
                      ),
                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(
                          12.r,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}