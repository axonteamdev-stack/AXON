import 'package:Axon/features/patient/book_doctor/data/models/doctor_review_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import '../../data/models/doctor_model.dart';
import 'book_doctor_view.dart';
import 'package:Axon/features/doctor/Reviews Doctor/presentation/views/wedgits/patient_review_card.dart';

class DoctorDetailsView extends StatelessWidget {
  final DoctorModel doctor;

  const DoctorDetailsView({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            /// ===== Header (Back + Avatar Centered) =====
            Padding(
              padding: EdgeInsets.fromLTRB(16.w, 12.h, 16.w, 0),
              child: Column(
                children: [
                  SizedBox(
                    height: 80.h,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Align(
                          alignment: Alignment.topLeft,
                          child: IconButton(
                            icon: const Icon(
                              Icons.arrow_back_ios,
                              color: AppColors.black,
                              size: 22,
                            ),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                        Container(
                          padding: EdgeInsets.all(3.r),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color:
                                  AppColors.primaryColor.withOpacity(0.25),
                              width: 2,
                            ),
                          ),
                          child: CircleAvatar(
                            radius: 38.r,
                            backgroundImage:
                                AssetImage(doctor.image),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 10.h),

                  TextApp(
                    text: doctor.name,
                    weight: AppTextWeight.bold,
                    fontSize: 18,
                  ),

                  SizedBox(height: 4.h),

                  TextApp(
                    text: doctor.specialty,
                    fontSize: 13,
                    color: AppColors.grey,
                  ),

                  SizedBox(height: 4.h),

                  TextApp(
                    text:
                        '${doctor.yearsOfExperience} Years Experience',
                    fontSize: 12,
                    color: AppColors.primaryColor,
                    weight: AppTextWeight.semiBold,
                  ),
                ],
              ),
            ),

            SizedBox(height: 20.h),

            /// ===== Content =====
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 16.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    /// ===== About Doctor =====
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.all(6.r),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.medical_information_outlined,
                            size: 18,
                            color: AppColors.primaryColor,
                          ),
                        ),
                        SizedBox(width: 8.w),
                        TextApp(
                          text: 'About Doctor',
                          fontSize: 15,
                          weight: AppTextWeight.bold,
                        ),
                      ],
                    ),

                    SizedBox(height: 12.h),

                    Container(
                      padding: EdgeInsets.all(18.w),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(18.r),
                        border: Border.all(
                          color:
                              AppColors.primaryColor.withOpacity(0.15),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryColor.withOpacity(0.05),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Row(
                          //   children: [
                          //     Icon(
                          //       Icons.check_circle_outline,
                          //       size: 16,
                          //       color: AppColors.primaryColor,
                          //     ),
                          //     SizedBox(width: 6.w),
                          //     TextApp(
                          //       text: 'Professional Summary',
                          //       fontSize: 13,
                          //       weight: AppTextWeight.semiBold,
                          //     ),
                          //   ],
                          // ),

                          // SizedBox(height: 8.h),

                          TextApp(
                            text: doctor.about,
                            fontSize: 13,
                            color: AppColors.grey,
                            height: 1.6,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 28.h),

                    /// ===== Reviews =====
                    TextApp(
                      text: 'Patient Reviews',
                      fontSize: 15,
                      weight: AppTextWeight.bold,
                    ),

                    SizedBox(height: 12.h),

                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: doctor.reviews.length,
                      separatorBuilder: (_, __) =>
                          SizedBox(height: 12.h),
                      itemBuilder: (_, i) {
                        return PatientReviewCard(
                          review:
                              doctor.reviews[i].toPatientReview(),
                        );
                      },
                    ),

                    SizedBox(height: 24.h),
                  ],
                ),
              ),
            ),

            /// ===== Bottom Button =====
            Padding(
              padding: EdgeInsets.all(16.w),
              child: CustomButton(
                text: 'Book Now',
                height: 52.h,
                borderRadius: 12.r,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          BookDoctorView(doctor: doctor),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
