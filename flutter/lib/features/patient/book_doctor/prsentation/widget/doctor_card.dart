import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import '../../data/models/doctor_model.dart';
import '../view/doctor_details_view.dart';

class DoctorCard extends StatelessWidget {
  final DoctorModel doctor;

  const DoctorCard({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: Directionality.of(context),
      child: Container(
        padding: EdgeInsets.all(14.w),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(18.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 16,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 28.r,
              backgroundImage: AssetImage(doctor.image),
            ),

            SizedBox(width: 12.w),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextApp(
                    text: doctor.name,
                    weight: AppTextWeight.semiBold,
                  ),
                  SizedBox(height: 4.h),
                  TextApp(
                    text: doctor.specialty,
                    fontSize: 12,
                    color: AppColors.grey,
                  ),
                  SizedBox(height: 6.h),
                  TextApp(
                    text: '${doctor.price} EGP',
                    fontSize: 12,
                    color: AppColors.primaryColor,
                    weight: AppTextWeight.bold,
                  ),
                ],
              ),
            ),

            CustomButton(
              width: 80.w,
              height: 34.h,
              borderRadius: 12.r,
              text: context.l10n.more,
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        DoctorDetailsView(doctor: doctor),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
