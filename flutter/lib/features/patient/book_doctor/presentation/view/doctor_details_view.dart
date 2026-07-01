import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/appointment/presentation/manager/appointment_cubit.dart';
import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';
import 'package:Axon/features/patient/book_doctor/presentation/view/book_doctor_view.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorDetailsView extends StatelessWidget {
  final DoctorEntity doctor;

  const DoctorDetailsView({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
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
                          alignment: AlignmentDirectional.centerStart,
                          child: CupertinoNavigationBarBackButton(
                            color: AppColors.black,
                            onPressed: () => Navigator.pop(context),
                          ),
                        ),
                        Container(
                          padding: EdgeInsets.all(3.r),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.primaryColor.withOpacity(0.25),
                              width: 2,
                            ),
                          ),
                          child: CircleAvatar(
                            radius: 38.r,
                            child: Text(
                              doctor.fullName.isNotEmpty
                                  ? doctor.fullName[0]
                                  : "D",
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 10.h),

                  TextApp(
                    text: doctor.fullName,
                    weight: AppTextWeight.bold,
                    fontSize: 18,
                    textAlign: TextAlign.center,
                  ),

                  SizedBox(height: 4.h),

                  TextApp(
                    text: doctor.specialization ?? "",
                    fontSize: 13,
                    color: AppColors.grey,
                  ),

                  SizedBox(height: 4.h),

                  TextApp(
                    text: "${doctor.yearsExperience} Years Experience",
                    fontSize: 12,
                    color: AppColors.primaryColor,
                    weight: AppTextWeight.semiBold,
                  ),
                ],
              ),
            ),

            SizedBox(height: 20.h),

            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 16.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
                          text: "About Doctor",
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
                          color: AppColors.primaryColor.withOpacity(0.15),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryColor.withOpacity(0.05),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: TextApp(
                        text: (doctor.about ?? "").isNotEmpty
                            ? doctor.about!
                            : "No description available",
                        fontSize: 13,
                        color: AppColors.grey,
                        height: 1.7,
                        textAlign: TextAlign.start,
                      ),
                    ),

                    SizedBox(height: 24.h),

                    Container(
                      padding: EdgeInsets.all(18.w),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(18.r),
                        border: Border.all(
                          color: AppColors.primaryColor.withOpacity(0.15),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextApp(
                            text: "Consultation Price",
                            fontSize: 14,
                            color: AppColors.grey,
                          ),
                          TextApp(
                            text: "${doctor.price} EGP",
                            fontSize: 15,
                            color: AppColors.primaryColor,
                            weight: AppTextWeight.bold,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 24.h),
                  ],
                ),
              ),
            ),

            Padding(
              padding: EdgeInsets.all(16.w),
              child: CustomButton(
                text: "Book Now",
                height: 52.h,
                borderRadius: 12.r,
                onPressed: () {
                  print("DOCTOR ID => ${doctor.id}");
                  print("DOCTOR NAME => ${doctor.fullName}");

                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => BlocProvider(
                        create: (_) => getIt<AppointmentCubit>(),
                        child: BookDoctorView(doctor: doctor),
                      ),
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
