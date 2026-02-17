import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_dropdown_field.dart';
import 'package:flutter/material.dart';

class FrequencyMedicineMenu extends StatelessWidget {
  FrequencyMedicineMenu({super.key});

  final TextEditingController frequencyController =
      TextEditingController();

  @override
  Widget build(BuildContext context) {
    return CustomDropdownField(
      
      controller: frequencyController,
      hintText: context.l10n.frequency,
      items: [
        context.l10n.once_daily,
        context.l10n.twice_daily,
        context.l10n.three_times_daily,
      ],
      prefixIcon: Icon(
        Icons.schedule,
        size: 18,
        color: AppColors.primaryColor.withOpacity(0.7),
      ),
    );
  }
}

