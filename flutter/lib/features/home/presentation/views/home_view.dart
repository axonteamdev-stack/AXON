import 'package:Axon/core/widgets/home_bottom_nav_bar.dart';
import 'package:Axon/features/home/data/models/appointment.dart';
import 'package:Axon/features/home/presentation/manager/home/home_cubit.dart';
import 'package:Axon/features/home/presentation/manager/home/home_state.dart';
import 'package:Axon/features/home/presentation/views/widgets/DoctorCard';
import 'package:Axon/features/home/presentation/views/widgets/appointments_list.dart';
import 'package:Axon/features/home/presentation/views/widgets/doctors_section.dart';
import 'package:Axon/features/home/presentation/views/widgets/home_header.dart';
import 'package:Axon/features/home/presentation/views/widgets/quick_actions_section.dart';
import 'package:Axon/features/home/presentation/views/widgets/today_medication_card.dart';
import 'package:Axon/features/home/presentation/views/widgets/doctors_section_header.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
class HomeView extends StatelessWidget {
  const HomeView({super.key});
  

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => HomeCubit()..loadHome(),
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F6FB),
        bottomNavigationBar: const HomeBottomNavBar(),
        body: SafeArea(
          child: BlocBuilder<HomeCubit, HomeState>(
            builder: (context, state) {
              if (state is HomeLoading || state is HomeInitial) {
                return const Center(child: CircularProgressIndicator());
              }

              final data = (state as HomeSuccess).model;

              return SingleChildScrollView(
                // padding: EdgeInsets.symmetric(horizontal: 20.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                   
                    HomeHeader(name: data.userName),
                    SizedBox(height: 24.h),
                    TodayMedicationCard(
                      taken: data.taken,
                      total: data.total,
                      medicineName: data.nextMedicine,
                    ),
                    SizedBox(height: 24.h),

    const QuickActionsSection(),

    SizedBox(height: 24.h),

  DoctorsSection(
  doctors: [
    AppointmentUiModel(
      doctorName: "Dr. Sarah Ahmed",
      specialty: "Cardiologist",
    ),
    AppointmentUiModel(
      doctorName: "Dr. Mohamed Ali",
      specialty: "General Practitioner",
    ),
    AppointmentUiModel(
      doctorName: "Dr. Ahmed Hassan",
      specialty: "Dentist",
    ),
  ],
  onViewAll: () {},
),

                    SizedBox(height: 24.h),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}