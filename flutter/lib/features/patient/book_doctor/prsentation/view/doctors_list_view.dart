import 'package:Axon/features/patient/book_doctor/prsentation/manager/doctors_cubit.dart';
import 'package:Axon/features/patient/book_doctor/prsentation/manager/doctors_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../data/models/doctor_model.dart';
import 'doctor_details_view.dart';

class DoctorsListView extends StatelessWidget {
  const DoctorsListView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        title: const Text(
          'Doctors',
          style: TextStyle(color: AppColors.black),
        ),
        backgroundColor: AppColors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.black),
      ),
      body: BlocBuilder<DoctorsCubit, DoctorsState>(
        builder: (context, state) {
          if (state is DoctorsLoaded) {
            return ListView.separated(
              padding: EdgeInsets.all(16.w),
              itemCount: state.filteredDoctors.length,
              separatorBuilder: (_, __) => SizedBox(height: 14.h),
              itemBuilder: (_, i) {
                DoctorModel doctor = state.filteredDoctors[i];
                return Container(
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
                              color: AppColors.grey,
                              fontSize: 12,
                            ),
                            SizedBox(height: 6.h),
                            TextApp(
                              text: '${doctor.price} EGP',
                              color: AppColors.primaryColor,
                              fontSize: 12,
                              weight: AppTextWeight.bold,
                            ),
                          ],
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) =>
                                  DoctorDetailsView(doctor: doctor),
                            ),
                          );
                        },
                        child: Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: 18.w,
                            vertical: 8.h,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor,
                            borderRadius: BorderRadius.circular(22.r),
                          ),
                          child: const Text(
                            'More',
                            style: TextStyle(
                              color: AppColors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          }

          return const SizedBox();
        },
      ),
    );
  }
}
