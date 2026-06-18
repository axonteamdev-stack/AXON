import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';
import 'package:Axon/features/patient/book_doctor/presentation/view/doctor_details_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorCard extends StatelessWidget {
  final DoctorEntity doctor;

  const DoctorCard({
    super.key,
    required this.doctor,
  });

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
              child: Text(
                doctor.fullName.isNotEmpty
                    ? doctor.fullName[0]
                    : "D",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            SizedBox(width: 12.w),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  TextApp(
                    text: doctor.fullName,
                    weight:
                        AppTextWeight.semiBold,
                  ),

                  SizedBox(height: 4.h),

                  TextApp(
                    text:
                        doctor.specialization ??
                            "",
                    fontSize: 12,
                    color: AppColors.grey,
                  ),

                  SizedBox(height: 6.h),

                  TextApp(
                    text:
                        "${doctor.price} EGP",
                    fontSize: 12,
                    color: AppColors
                        .primaryColor,
                    weight:
                        AppTextWeight.bold,
                  ),
                ],
              ),
            ),

            CustomButton(
              width: 80.w,
              height: 34.h,
              borderRadius: 12.r,
              text: "More",
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        DoctorDetailsView(
                      doctor: doctor,
                    ),
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