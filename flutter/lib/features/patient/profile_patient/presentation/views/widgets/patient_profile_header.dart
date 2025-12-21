import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_cubit.dart';
import 'package:flutter/material.dart';

class PatientProfileHeader extends StatelessWidget {
  final PatientProfileState state;

  const PatientProfileHeader({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(
        top: 28,
        bottom: 16,
        left: 20,
        right: 20,
      ),
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppColors.primaryColor,
        borderRadius: BorderRadius.vertical(
          bottom: Radius.circular(24),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
         
             
          Center(
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundImage: AssetImage(AppImages.medicalProfile),
                ),
                const SizedBox(height: 8),
                Text(
                  state.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  state.email,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
