import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine cubit/medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/duration_widget.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/frequency_medicine_menu.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/intake_time_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AddMedicineBody extends StatelessWidget {
  AddMedicineBody({super.key});

  final TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextApp(
            text: "Medicine Name",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 12.h),
          CustomTextField(
            controller: nameController,
            hintText: "ex: Vitamin D",
          ),
          SizedBox(height: 24.h),
          TextApp(
            text: "Frequency",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 12.h),
          FrequencyMedicineMenu(),
          SizedBox(height: 24.h),
          TextApp(
            text: "Intake Time",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 12.h),
          const IntakeTime(),
          SizedBox(height: 24.h),
          TextApp(
            text: "Duration",
            color: AppColors.primaryColor,
            fontSize: 14,
            weight: AppTextWeight.semiBold,
          ),
          SizedBox(height: 12.h),
          const DurationWidget(),
          SizedBox(height: 32.h),
          CustomButton(
            text: "SAVE",
            onPressed: () {
              context.read<MedicineCubit>().addMedicine({
                'name': nameController.text,
                'date': DateTime.now(),
              });
              Snackbar.showSuccess(
                context,
                message: "Medicine saved successfully",
              );
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
