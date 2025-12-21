import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';

class PatientEditRadiologyView extends StatelessWidget {
  const PatientEditRadiologyView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(title: const Text('Radiology')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              height: 140,
              width: double.infinity,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.grey),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text('Upload Radiology Image'),
              ),
            ),
            const Spacer(),
            CustomButton(text: 'Save', onPressed: () {}),
          ],
        ),
      ),
    );
  }
}
