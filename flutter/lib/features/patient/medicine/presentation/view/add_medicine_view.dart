import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/add_medicine_body.dart';
import 'package:flutter/material.dart';

class AddMedicineView extends StatelessWidget {
  const AddMedicineView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white ,
      body: Column(
        children: [
          CustomAppBar(title: "Add New Medicine"),
          Expanded(child: AddMedicineBody())
        ],
      ),
      );
  }
}
