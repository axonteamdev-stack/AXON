import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_dropdown_field.dart';
import 'package:flutter/material.dart';

class FrequencyMedicineMenu extends StatelessWidget {
  FrequencyMedicineMenu({super.key});
  String selectedValue = 'Once Daily';
  final TextEditingController frequencyController = TextEditingController();

  String? get selectedFrequency => null;

  @override
  Widget build(BuildContext context) {
    return CustomDropdownField(
      controller: frequencyController,

      hintText: 'Frequency',
      items: const ['Once Daily', 'Twice Daily', 'Three Time Daily'],
      prefixIcon: Icon(
        Icons.schedule,
        size: 18,
        color: AppColors.primaryColor.withOpacity(0.7),
      ),
    );
  }
}
