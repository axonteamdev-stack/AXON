import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine_filter/medicine_filter_state.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/medicine_list__view_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
    return BlocProvider(
      create: (_) => MedicineFilterCubit(),
      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,
            body: Column(
              children: [
                CustomAppBar(
                  title: context.l10n.all_medicine,
                  trailing: Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          setState(() {
                            showSearch = !showSearch;
                            if (!showSearch) {
                              searchCtrl.clear();
                              context
                                  .read<MedicineFilterCubit>()
                                  .clearSearch();
                            }
                          });
                        },
                        icon: const Icon(Icons.search,
                            color: AppColors.white),
                      ),
                      IconButton(
                        onPressed: () {
                          showCalendar(context);
                        },
                        icon: const Icon(
                          Icons.calendar_month_outlined,
                          color: AppColors.white,
                        ),
                      ),
                    ],
                  ),
                ),

                if (showSearch)
                  Padding(
                    padding:
                        const EdgeInsets.fromLTRB(16, 12, 16, 8),
                    child: CustomTextField(
                      controller: searchCtrl,
                      hintText: context.l10n.search_medicine,
                      prefixIcon: const Icon(Icons.search),
                      onChanged: (v) {
                        context
                            .read<MedicineFilterCubit>()
                            .updateSearch(v);
                      },
                    ),
                  ),

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
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return BlocProvider.value(
          value: cubit,
          child: BlocBuilder<MedicineFilterCubit,
              MedicineFilterState>(
            builder: (context, state) {
              return CalendarDatePicker(
                initialDate: state.date ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2035),
                onDateChanged: (date) {
                  context
                      .read<MedicineFilterCubit>()
                      .updateDate(date);
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
