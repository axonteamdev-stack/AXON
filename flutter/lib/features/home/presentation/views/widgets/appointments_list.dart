import 'package:Axon/features/home/data/models/appointment.dart';
import 'package:Axon/features/home/presentation/views/widgets/DoctorCard';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorsList extends StatelessWidget {
  final List<AppointmentUiModel> doctors;

  const DoctorsList({
    super.key,
    required this.doctors,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: doctors.take(3).map((item) {
        return Padding(
          padding: EdgeInsets.only(bottom: 12.h),
          child: DoctorCard(
            doctorName: item.doctorName,
            specialty: item.specialty,
          ),
        );
      }).toList(),
    );
  }
}
