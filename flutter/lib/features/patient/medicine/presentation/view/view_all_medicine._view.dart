import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/header_icons.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/delete_medicine/delete_medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/get_medicine.dart/medicine_list_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_state.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/update_medicine/update_medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/medicine_list__view_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ViewAllMedicine extends StatefulWidget {
  const ViewAllMedicine({super.key});

  @override
  State<ViewAllMedicine> createState() => _ViewAllMedicineState();
}

class _ViewAllMedicineState extends State<ViewAllMedicine> {
  final searchCtrl = TextEditingController();

  bool showSearch = false;

  @override
  void dispose() {
    searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => MedicineFilterCubit()),

        BlocProvider(create: (_) => getIt<MedicineListCubit>()..getMedicines()),

        BlocProvider(create: (_) => getIt<DeleteMedicineCubit>()),

        BlocProvider(create: (_) => getIt<UpdateMedicineCubit>()),
      ],

      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,
            body: Column(
              children: [
                CustomAppBar(
                  title: "MY MEDICINE",
                  height: 180,
                  trailing: Container(
                    width: 45.w,
                    height: 45.w,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(.15),
                      borderRadius: BorderRadius.circular(18.r),
                      border: Border.all(color: Colors.white.withOpacity(.2)),
                    ),
                    child: NotificationIcon(count: 5, onTap: () {}),
                  ),
                  bottom: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),

                    child: CustomTextField(
                      controller: searchCtrl,
                      hintText: context.l10n.search_medicine,
                      prefixIcon: const Icon(Icons.search),

                      onChanged: (value) {
                        context.read<MedicineFilterCubit>().updateSearch(value);
                      },
                    ),
                  ),
                ),

                // todo: medicine list
                const Expanded(child: MedicineList()),
              ],
            ),
          );
        },
      ),
    );
  }

  void showCalendar(BuildContext parentContext) {
    final cubit = parentContext.read<MedicineFilterCubit>();

    showModalBottomSheet(
      context: parentContext,

      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),

      builder: (_) {
        return BlocProvider.value(
          value: cubit,

          child: BlocBuilder<MedicineFilterCubit, MedicineFilterState>(
            builder: (context, state) {
              return CalendarDatePicker(
                initialDate: state.date ?? DateTime.now(),

                firstDate: DateTime(2020),
                lastDate: DateTime(2035),

                onDateChanged: (date) {
                  context.read<MedicineFilterCubit>().updateDate(date);

                  Navigator.pop(context);
                },
              );
            },
          ),
        );
      },
    );
  }
}
