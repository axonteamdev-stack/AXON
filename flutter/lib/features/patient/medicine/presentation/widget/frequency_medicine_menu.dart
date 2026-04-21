import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_dropdown_field.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine%20cubit/medicine_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FrequencyMedicineMenu extends StatelessWidget {
  FrequencyMedicineMenu({super.key});

  final TextEditingController frequencyController =
      TextEditingController();

  @override
  Widget build(BuildContext context) {
    final medicineCubit =
        context.read<MedicineCubit>();

    return CustomDropdownField(
      controller: frequencyController,

      hintText: context.l10n.frequency,

      items: [
        context.l10n.once_daily,
        context.l10n.twice_daily,
        context.l10n.three_times_daily,
      ],

      onChanged: (value) {
        if (value != null) {
          frequencyController.text = value;

          medicineCubit.changeFrequency(value);
        }
      },

      prefixIcon: Icon(
        Icons.schedule,
        size: 18,
        color: AppColors.primaryColor.withOpacity(0.7),
      ),
    );
  }
}