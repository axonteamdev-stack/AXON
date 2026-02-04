import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../data/models/doctor_model.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/style/colors.dart';

class BookDoctorView extends StatelessWidget {
  final DoctorModel doctor;

  const BookDoctorView({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    final complaintController = TextEditingController();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
           CustomAppBar(
  title: 'Book Consultation',
),


            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(16.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // /// Doctor info
                    // Container(
                    //   padding: EdgeInsets.all(14.w),
                    //   decoration: BoxDecoration(
                    //     color: AppColors.white,
                    //     borderRadius: BorderRadius.circular(16.r),
                    //     border: Border.all(
                    //       color: AppColors.primaryColor.withOpacity(0.15),
                    //     ),
                    //   ),
                    //   child: Row(
                    //     children: [
                    //       CircleAvatar(
                    //         radius: 26.r,
                    //         backgroundImage: AssetImage(doctor.image),
                    //       ),
                    //       SizedBox(width: 12.w),
                    //       Column(
                    //         crossAxisAlignment: CrossAxisAlignment.start,
                    //         children: [
                    //           TextApp(
                    //             text: doctor.name,
                    //             weight: AppTextWeight.semiBold,
                    //           ),
                    //           SizedBox(height: 4.h),
                    //           TextApp(
                    //             text: doctor.specialty,
                    //             fontSize: 12,
                    //             color: AppColors.grey,
                    //           ),
                    //         ],
                    //       ),
                    //     ],
                    //   ),
                    // ),

                    SizedBox(height: 24.h),

                    /// Complaint
                    TextApp(
                      text: 'Describe your complaint',
                      weight: AppTextWeight.semiBold,
                      fontSize: 14,
                    ),
                    SizedBox(height: 15.h),

                    CustomTextField(
                      controller: complaintController,
                      hintText: 'Write your symptoms or problem here...',
                      maxLines: 10,
                    ),

                    SizedBox(height: 24.h),

                    /// Price card
                    Container(
                      padding: EdgeInsets.symmetric(horizontal:   16.w , vertical: 20),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(16.r),
                        border: Border.all(
                          color: AppColors.primaryColor.withOpacity(0.2),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextApp(
                            text: 'Consultation Price',
                            fontSize: 15,
                            color: AppColors.grey,
                          ),
                          TextApp(
                            text: '${doctor.price} EGP',
                            weight: AppTextWeight.bold,
                            color: AppColors.primaryColor,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: EdgeInsets.all(16.w),
              child: CustomButton(
                text: 'Proceed to Payment',
                height: 52.h,
                borderRadius: 12.r,
                onPressed: () {
                  // TODO: connect payment API
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
