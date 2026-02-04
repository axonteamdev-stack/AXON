import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/frequency_medicine_menu.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AddMedicineBody extends StatelessWidget {
  AddMedicineBody({super.key});

  TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(12.h),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          TextApp(
            text: "Medicine Name",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 6.h),
          CustomTextField(
            controller: nameController,
            hintText: "ex: Vitamin D",
          ),
          SizedBox(height: 20.h),

          TextApp(
            text: "Frequency",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 6.h),
          FrequencyMedicineMenu(),
        ],
      ),
    );
  }
}
