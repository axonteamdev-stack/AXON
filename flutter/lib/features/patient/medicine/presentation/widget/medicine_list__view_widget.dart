import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_state.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/medicine_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class MedicineList extends StatelessWidget {
  const MedicineList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<MedicineFilterCubit, MedicineFilterState>(
      builder: (context, state) {
        final medicines = [
          {'name': 'Vitamin D3', 'date': DateTime.now()},
          {'name': 'Panadol', 'date': DateTime.now()},
          {'name': 'Aspirin', 'date': DateTime.now()},
          {'name': 'Omega 3', 'date': DateTime.now()},
          {'name': 'Cataflam', 'date': DateTime.now()},
          {'name': 'Brufen', 'date': DateTime.now()},
          {'name': 'Augmentin', 'date': DateTime.now()},
          {'name': 'Amoxicillin', 'date': DateTime.now()},
          {'name': 'Zyrtec', 'date': DateTime.now()},
          {'name': 'Claritin', 'date': DateTime.now()},
          {'name': 'Ventolin', 'date': DateTime.now()},
          {'name': 'Neuroton', 'date': DateTime.now()},
          {'name': 'Calcium D', 'date': DateTime.now()},
          {'name': 'Fucidin', 'date': DateTime.now()},
          {'name': 'Flagyl', 'date': DateTime.now()},
          {'name': 'Otrivin', 'date': DateTime.now()},
          {'name': 'Eucarbon', 'date': DateTime.now()},
          {'name': 'Spasfon', 'date': DateTime.now()},
          {'name': 'Congestal', 'date': DateTime.now()},
          {'name': 'Antinal', 'date': DateTime.now()},
        ];

        final selectedDate = state.date ?? DateTime.now();

        final filtered = medicines.where((m) {
          final date = m['date'] as DateTime;

          final sameDay =
              date.day == selectedDate.day &&
              date.month == selectedDate.month &&
              date.year == selectedDate.year;

          final matchSearch =
              m['name'].toString().toLowerCase().contains(state.search);

          return sameDay && matchSearch;
        }).toList();

        return ListView.separated(
          padding: EdgeInsets.only(top: 8.h),
          itemCount: filtered.length,
          itemBuilder: (context, index) {
            final item = filtered[index];
            return MedicineCard(
              name: item['name'] as String,
              frequency: 'Once Daily',
              nextTime: '09:00 PM',
            );
          },
          separatorBuilder: (context, index) =>
              SizedBox(height: 12.h),
        );
      },
    );
  }
}
