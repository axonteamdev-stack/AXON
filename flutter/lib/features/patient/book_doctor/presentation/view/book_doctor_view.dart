import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class BookDoctorView extends StatelessWidget {
  final DoctorEntity doctor;

  const BookDoctorView({
    super.key,
    required this.doctor,
  });

  @override
  Widget build(BuildContext context) {
    final complaintController = TextEditingController();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            CustomAppBar(
              title: context.l10n.book_consultation,
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(16.w),
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 24.h),

                    TextApp(
                      text:
                          context.l10n.describe_complaint,
                      weight:
                          AppTextWeight.semiBold,
                      fontSize: 14,
                    ),

                    SizedBox(height: 15.h),

                    CustomTextField(
                      controller: complaintController,
                      hintText: context
                          .l10n.write_symptoms_hint,
                      maxLines: 10,
                    ),

                    SizedBox(height: 24.h),

                    Container(
                      padding:
                          EdgeInsets.symmetric(
                        horizontal: 16.w,
                        vertical: 20,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors
                            .primaryColor
                            .withOpacity(0.05),
                        borderRadius:
                            BorderRadius.circular(
                          16.r,
                        ),
                        border: Border.all(
                          color: AppColors
                              .primaryColor
                              .withOpacity(
                            0.2,
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment:
                            MainAxisAlignment
                                .spaceBetween,
                        children: [
                          TextApp(
                            text: context.l10n
                                .consultation_price,
                            fontSize: 15,
                            color:
                                AppColors.grey,
                          ),
                          TextApp(
                            text:
                                "${doctor.price} EGP",
                            weight:
                                AppTextWeight
                                    .bold,
                            color: AppColors
                                .primaryColor,
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
                text: context
                    .l10n.proceed_to_payment,
                height: 52.h,
                borderRadius: 12.r,
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}