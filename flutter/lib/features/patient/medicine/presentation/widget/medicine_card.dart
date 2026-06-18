import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:intl/intl.dart';

class MedicineCard extends StatelessWidget {
  final String id;
  final String name;
  final String frequency;
  final num dosage;
  final String unit;
  final String nextTime;
  final String startDate;
  final String endDate;
  final String notes;

  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const MedicineCard({
    super.key,
    required this.id,
    required this.name,
    required this.frequency,
    required this.dosage,
    required this.nextTime,
    required this.startDate,
    required this.endDate,
    required this.onEdit,
    required this.onDelete,
    required this.unit,
    required this.notes,
  });

  int getFrequencyCount(String frequency) {
    switch (frequency.toLowerCase()) {
      case "once daily":
        return 1;
      case "twice daily":
        return 2;
      case "three times daily":
        return 3;
      case "four times daily":
        return 4;
      default:
        return 1;
    }
  }

  @override
  Widget build(BuildContext context) {
    final formattedStartDate = DateFormat(
      "dd MMM yyyy",
    ).format(DateTime.parse(startDate));

    final formattedEndDate = DateFormat(
      "dd MMM yyyy",
    ).format(DateTime.parse(endDate));

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 14.w, vertical: 8.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18.r),
        border: Border.all(
          color: AppColors.primaryColor.withOpacity(.35),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.08),
            blurRadius: 18,
            spreadRadius: 1,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          // todo : Name & dosage
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(8.h),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14.r),
                  color: AppColors.blue,
                ),
                child: Icon(
                  Icons.medication_outlined,
                  color: AppColors.lightGrey,
                ),
              ),
              SizedBox(width: 10.w),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextApp(
                      text: name,
                      color: AppColors.primaryColor,
                      fontSize: 16,
                      weight: AppTextWeight.bold,
                    ),

                    SizedBox(height: 6.h),
                    Row(
                      children: [
                        TextApp(
                          text: dosage.toString(),
                          color: AppColors.blue.withOpacity(0.7),
                          fontSize: 13,
                          weight: AppTextWeight.semiBold,
                        ),
                        SizedBox(width: 2.w),
                        TextApp(
                          text: unit,
                          color: AppColors.blue.withOpacity(0.7),
                          fontSize: 13,
                          weight: AppTextWeight.semiBold,
                        ),
                        SizedBox(width: 8.w),
                        TextApp(
                          text: frequency,
                          color: AppColors.grey,
                          fontSize: 13,
                          weight: AppTextWeight.semiBold,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          SizedBox(height: 14.h),

          Row(
            children: [
              // todo : Next time
              _infoRow(
                icon: Icons.timelapse_outlined,
                title: context.l10n.next,
                value: nextTime,
              ),

              const Spacer(),

              // todo : Start Date
              _infoRow(
                icon: Icons.calendar_today_outlined,
                title: "",
                value: formattedStartDate,
              ),

              SizedBox(width: 2.w),

              Icon(
                Icons.arrow_right_alt_outlined,
                size: 18.sp,
                color: AppColors.grey,
              ),

              // todo : End Date
              _infoRow(title: "", value: formattedEndDate),
            ],
          ),

          SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: _contaners(
                  icon: Icons.timelapse_outlined,
                  title: context.l10n.next,
                  value: nextTime,
                ),
              ),
              SizedBox(width: 6.w),
              Expanded(
                child: _contaners(
                  icon: Icons.calendar_today_outlined,
                  title: context.l10n.start_date,
                  value: formattedStartDate,
                ),
              ),
              SizedBox(width: 6.w),

              Expanded(
                child: _contaners(
                  icon: Icons.event_available_outlined,
                  title: context.l10n.end_date,
                  value: formattedEndDate,
                ),
              ),
            ],
          ),

          SizedBox(height: 12),

          // todo : frequency card
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(
              color: AppColors.lightGrey,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.notifications,
                  size: 18,
                  color: AppColors.primaryColor,
                ),

                SizedBox(width: 4.w),

                TextApp(
                  text:
                      "Reminders set for x${getFrequencyCount(frequency).toString()} daily",
                  weight: AppTextWeight.semiBold,
                  color: AppColors.primaryColor,
                ),

                SizedBox(width: 8.w),

                ...List.generate(
                  getFrequencyCount(frequency),
                  (_) => Padding(
                    padding: EdgeInsets.only(right: 4.w),
                    child: _dots(),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 12),

          // todo Notes Card
          Container(
            padding: EdgeInsets.all(12.h),
            decoration: BoxDecoration(
              color: AppColors.lightGrey,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.note_outlined,
                      size: 18,
                      color: AppColors.primaryColor,
                    ),
                    SizedBox(width: 8.w),
                    TextApp(
                      text: "NOTES",
                      color: AppColors.primaryColor,
                      weight: AppTextWeight.semiBold,
                      fontSize: 12,
                    ),
                  ],
                ),
                SizedBox(height: 12.h),
                TextApp(text: notes, weight: AppTextWeight.semiBold),
              ],
            ),
          ),

          SizedBox(height: 12),

          /// ACTION BUTTONS
          Row(
            children: [
              SizedBox(
                width: 120.w,
                child: ElevatedButton.icon(
                  onPressed: onDelete,
                  icon: Icon(Icons.delete, size: 18.sp, color: AppColors.red),
                  label: TextApp(
                    text: context.l10n.delete,
                    color: AppColors.red,
                    fontSize: 14,
                    weight: AppTextWeight.semiBold,
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.redAccent.withOpacity(0.5),
                    elevation: 0,
                    padding: EdgeInsets.symmetric(vertical: 14.h),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                  ),
                ),
              ),

              SizedBox(width: 12.w),

              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onEdit,
                  icon: Icon(
                    Icons.edit_outlined,
                    size: 14.sp,
                    color: AppColors.white,
                  ),
                  label: TextApp(
                    text: context.l10n.edit_medicine,
                    fontSize: 14,
                    weight: AppTextWeight.semiBold,
                    color: AppColors.white,
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 14.h),
                    backgroundColor: AppColors.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoRow({
    IconData? icon,
    required String title,
    required String value,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Visibility(
          visible: icon != null,
          child: Icon(icon, size: 16, color: AppColors.grey),
        ),
        SizedBox(width: icon == null ? 0 : 2.w),
        TextApp(
          text: title,
          fontSize: 12,
          color: AppColors.grey,
          weight: AppTextWeight.semiBold,
        ),
        SizedBox(width: title == "" ? 0.w : 4.w),
        TextApp(
          text: value,
          fontSize: 12,
          color: AppColors.black,
          weight: AppTextWeight.semiBold,
        ),
      ],
    );
  }

  Widget _contaners({
    IconData? icon,
    required String title,
    required String value,
  }) {
    return Container(
      padding: EdgeInsets.all(8.h),
      decoration: BoxDecoration(
        color: AppColors.blue.withOpacity(0.4),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Visibility(
                visible: icon != null,
                child: Icon(icon, size: 16, color: AppColors.primaryColor),
              ),
              SizedBox(width: icon == null ? 0 : 2.w),
              TextApp(
                text: title,
                fontSize: 12,
                color: AppColors.primaryColor,
                weight: AppTextWeight.semiBold,
              ),
            ],
          ),
          SizedBox(height: 8.h),
          TextApp(
            text: value,
            fontSize: 12,
            color: AppColors.black,
            weight: AppTextWeight.semiBold,
          ),
        ],
      ),
    );
  }

  Widget _dots() {
    return Container(
      width: 8.h,
      height: 8.h,
      decoration: BoxDecoration(
        color: AppColors.primaryColor,
        borderRadius: BorderRadius.circular(90),
      ),
    );
  }
}
