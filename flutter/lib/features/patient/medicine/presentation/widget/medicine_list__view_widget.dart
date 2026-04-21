import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/delete_medicine/delete_medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/get_medicine.dart/medicine_list_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/get_medicine.dart/medicine_list_state.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_state.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/update_medicine/update_medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/view/update_medicine_view.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/medicine_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class MedicineList extends StatelessWidget {
  const MedicineList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<MedicineListCubit, MedicineListState>(
      builder: (context, medicineState) {
        /// Loading
        if (medicineState is MedicineListLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        /// Error
        if (medicineState is MedicineListError) {
          return Center(
            child: TextApp(
              text: "Failed to load medicines",
              color: AppColors.grey,
            ),
          );
        }

        /// Success
        if (medicineState is MedicineListSuccess) {
          return BlocBuilder<MedicineFilterCubit, MedicineFilterState>(
            builder: (context, filterState) {
              /// عرض كل الأدوية + البحث فقط
              final filtered =
                  medicineState.medicines.where((medicine) {
                final matchSearch = medicine
                    .medicineName
                    .toLowerCase()
                    .contains(
                      filterState.search.toLowerCase(),
                    );

                return matchSearch;
              }).toList();

              /// ترتيب حسب التاريخ ثم الوقت
              filtered.sort((a, b) {
                final aDate = DateTime.parse(a.startDate);
                final bDate = DateTime.parse(b.startDate);

                final dateCompare =
                    aDate.compareTo(bDate);

                if (dateCompare != 0) {
                  return dateCompare;
                }

                final aTime =
                    a.intakeTime.isNotEmpty
                        ? a.intakeTime.first
                        : "23:59";

                final bTime =
                    b.intakeTime.isNotEmpty
                        ? b.intakeTime.first
                        : "23:59";

                return aTime.compareTo(bTime);
              });

              /// لو لا يوجد أدوية
              if (filtered.isEmpty) {
                return Center(
                  child: TextApp(
                    text: "No medicines found",
                    color: AppColors.grey,
                  ),
                );
              }

              return ListView.separated(
                padding: EdgeInsets.only(top: 8.h),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final item = filtered[index];

                  /// الوقت القادم
                  final nextTime =
                      item.intakeTime.isNotEmpty
                          ? item.intakeTime.first
                          : "08:00";

                  /// عدد المرات
                  final frequency =
                      item.frequency;

                  return MedicineCard(
                    id: item.id,
                    name: item.medicineName,
                    frequency: frequency,
                    nextTime: nextTime,

                    /// UPDATE
                onEdit: () async {
  final result = await Navigator.push(
    context,
    MaterialPageRoute(
      builder: (_) => UpdateMedicineView(
        medicineId: item.id,
        medicineName: item.medicineName,
        frequency: item.frequency,
        intakeTime: item.intakeTime.isNotEmpty
            ? item.intakeTime.first
            : "08:00",
        startDate: item.startDate,
        endDate: item.endDate,
      ),
    ),
  );

  print("UPDATE RESULT => $result");

  if (result == true) {
    print("REFRESH MEDICINES 🔥");

    context
        .read<MedicineListCubit>()
        .getMedicines();
  }
},

                    /// DELETE
                    onDelete: () async {
  await context
      .read<DeleteMedicineCubit>()
      .deleteMedicine(
        item.id,
      );

  context
      .read<MedicineListCubit>()
      .getMedicines();
}
                  );
                },
                separatorBuilder: (_, __) =>
                    SizedBox(height: 12.h),
              );
            },
          );
        }

        return const SizedBox();
      },
    );
  }
}