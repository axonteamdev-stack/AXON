import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/duration_widget.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/frequency_medicine_menu.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/intake_time_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AddMedicineBody extends StatelessWidget {
  AddMedicineBody({super.key});

  TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 24.h, left: 16.h, right: 16.h, bottom: 24.h),
      child: SingleChildScrollView(
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
            SizedBox(height: 15.h),
            CustomTextField(
              controller: nameController,
              hintText: "ex: Vitamin D",
            ),

            SizedBox(height: 30.h),

            TextApp(
              text: "Frequency",
              color: AppColors.primaryColor,
              fontSize: 14,
              weight: AppTextWeight.semiBold,
            ),
            SizedBox(height: 15.h),
            FrequencyMedicineMenu(),

            SizedBox(height: 30.h),

            TextApp(
              text: "Intake Time",
              color: AppColors.primaryColor,
              fontSize: 14,
              weight: AppTextWeight.semiBold,
            ),
            SizedBox(height: 15.h),
            IntakeTime(),

            SizedBox(height: 30.h),

            TextApp(
              text: "Duration",
              color: AppColors.primaryColor,
              fontSize: 14,
              weight: AppTextWeight.semiBold,
            ),
            SizedBox(height: 15.h),
            DurationWidget(),

            SizedBox(height: 30.h),

            CustomButton(onPressed: (){}, text: "SAVE")
          ],
        ),
      ),
    );
  }
}
