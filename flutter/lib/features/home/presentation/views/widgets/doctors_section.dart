import 'package:Axon/features/home/data/models/appointment.dart';
import 'package:Axon/features/home/presentation/views/widgets/appointments_list.dart';
import 'package:Axon/features/home/presentation/views/widgets/doctors_section_header.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorsSection extends StatelessWidget {
  final List<AppointmentUiModel> doctors;
  final VoidCallback? onViewAll;

  const DoctorsSection({
    super.key,
    required this.doctors,
    this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    if (doctors.isEmpty) return const SizedBox();

    return Padding(
padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          DoctorsSectionHeader(onViewAll: onViewAll),
          SizedBox(height: 16.h),
          DoctorsList(doctors: doctors),
        ],
      ),
    );
  }
}
