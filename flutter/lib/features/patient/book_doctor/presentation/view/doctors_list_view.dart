import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';
import 'package:Axon/features/patient/book_doctor/presentation/manager/doctors_cubit.dart';
import 'package:Axon/features/patient/book_doctor/presentation/manager/doctors_state.dart';
import 'package:Axon/features/patient/book_doctor/presentation/view/doctor_details_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorsListView extends StatelessWidget {
  DoctorsListView({super.key});

  final DoctorsCubit doctorsCubit = getIt<DoctorsCubit>();
  final TextEditingController searchController = TextEditingController();

  final List<String> categories = [
    "All",
    "Cardiology",
    "Heart",
    "Internal",
    "Bones",
    "Psychology",
  ];

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => doctorsCubit..getAllDoctors(),
      child: BlocBuilder<DoctorsCubit, DoctorsState>(
        builder: (context, state) {
          return Scaffold(
            backgroundColor: AppColors.white,
            appBar: AppBar(
              title: const Text(
                "Doctors",
                style: TextStyle(
                  color: AppColors.black,
                ),
              ),
              backgroundColor: AppColors.white,
              elevation: 0,
              iconTheme: const IconThemeData(
                color: AppColors.black,
              ),
            ),
            body: Column(
              children: [
                Padding(
                  padding: EdgeInsets.all(16.w),
                  child: TextField(
                    controller: searchController,
                    onChanged: (value) {
                      if (value.trim().isEmpty) {
                        doctorsCubit.getAllDoctors();
                      } else {
                        doctorsCubit.searchDoctors(
                          keyword: value,
                        );
                      }
                    },
                    decoration: InputDecoration(
                      hintText: "Search doctor name or specialty",
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14.r),
                      ),
                    ),
                  ),
                ),
                if (state is DoctorsLoading)
                  const Expanded(
                    child: Center(
                      child: CircularProgressIndicator(),
                    ),
                  )
                else if (state is DoctorsSuccess)
                  Expanded(
                    child: ListView.separated(
                      padding: EdgeInsets.all(16.w),
                      itemCount: state.filteredDoctors.length,
                      separatorBuilder: (_, __) =>
                          SizedBox(height: 14.h),
                      itemBuilder: (_, i) {
                        final DoctorEntity doctor =
                            state.filteredDoctors[i];

                        return Container(
                          padding: EdgeInsets.all(14.w),
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius:
                                BorderRadius.circular(18.r),
                            boxShadow: [
                              BoxShadow(
                                color:
                                    Colors.black.withOpacity(0.08),
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
                                       text: doctor.specialization ?? "",
                                      color: AppColors.grey,
                                      fontSize: 12,
                                    ),
                                    SizedBox(height: 6.h),
                                    TextApp(
                                      text:
                                          "${doctor.price} EGP",
                                      color: AppColors
                                          .primaryColor,
                                      fontSize: 12,
                                      weight:
                                          AppTextWeight.bold,
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
                                          DoctorDetailsView(
                                        doctor: doctor,
                                      ),
                                    ),
                                  );
                                },
                                child: Container(
                                  padding:
                                      EdgeInsets.symmetric(
                                    horizontal: 18.w,
                                    vertical: 8.h,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors
                                        .primaryColor,
                                    borderRadius:
                                        BorderRadius.circular(
                                      22.r,
                                    ),
                                  ),
                                  child: const Text(
                                    "More",
                                    style: TextStyle(
                                      color:
                                          AppColors.white,
                                      fontWeight:
                                          FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  )
                else
                  const Expanded(
                    child: Center(
                      child: Text("No Doctors Found"),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}