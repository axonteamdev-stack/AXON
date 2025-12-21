import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';
import 'package:flutter/material.dart';

class PatientProfileStats extends StatelessWidget {
  final PatientProfileState state;

  const PatientProfileStats({super.key, required this.state});

  @override
  Widget build (BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.shade100,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _PatientProfileStatItem(
            value: '${state.weight} Kg',
            label: 'Weight',
          ),
          _PatientProfileStatItem(
            value: '${state.age}',
            label: 'Years',
          ),
          _PatientProfileStatItem(
            value: '${state.height} Cm',
            label: 'Height',
          ),
        ],
      ),
    );
  }
}

class _PatientProfileStatItem extends StatelessWidget {
  final String value;
  final String label;

  const _PatientProfileStatItem({
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}
