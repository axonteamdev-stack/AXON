import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'patient_profile_stat_item.dart';

class PatientProfileStats extends StatelessWidget {
  final PatientProfileState state;

  const PatientProfileStats({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.blue.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
         PatientProfileStatItem(
  value: '${state.weight} Kg',
  label: context.l10n.weight,
),
PatientProfileStatItem(
  value: '${state.age}',
  label: context.l10n.years,
),
PatientProfileStatItem(
  value: '${state.height} Cm',
  label: context.l10n.height,
),

        ],
      ),
    );
  }
}
