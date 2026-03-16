import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
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
        ];

        final selectedDate = state.date ?? DateTime.now();

        final filtered = medicines.where((m) {
          final date = m['date'] as DateTime;

          final sameDay =
              date.day == selectedDate.day &&
              date.month == selectedDate.month &&
              date.year == selectedDate.year;

          final matchSearch =
              m['name'].toString().toLowerCase().contains(
                    state.search,
                  );

          return sameDay && matchSearch;
        }).toList();

        if (filtered.isEmpty) {
          return Center(
            child: TextApp(
              text: context.l10n.no_medicine_today,
              color: AppColors.grey,
            ),
          );
        }

        return ListView.separated(
          padding: EdgeInsets.only(top: 8.h),
          itemCount: filtered.length,
          itemBuilder: (context, index) {
            final item = filtered[index];
            return MedicineCard(
              name: item['name'] as String,
              frequency: context.l10n.once_daily,
              nextTime: '09:00 PM',
            );
          },
          separatorBuilder: (_, __) =>
              SizedBox(height: 12.h),
        );
      },
    );
  }
}
