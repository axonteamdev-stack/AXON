import 'package:Axon/core/errors/mappers/failure_to_message_mapper.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/update_medicine/update_medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/update_medicine/update_medicine_state.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/update_duration_widget.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/update_frequency_medicine_menu copy.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/update_intake_time_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class UpdateMedicineBody extends StatefulWidget {
  final String medicineId;
  final String medicineName;
  final String frequency;
  final String intakeTime;
  final String startDate;
  final String endDate;

  const UpdateMedicineBody({
    super.key,
    required this.medicineId,
    required this.medicineName,
    required this.frequency,
    required this.intakeTime,
    required this.startDate,
    required this.endDate,
  });

  @override
  State<UpdateMedicineBody> createState() =>
      _UpdateMedicineBodyState();
}

class _UpdateMedicineBodyState
    extends State<UpdateMedicineBody> {
  late TextEditingController medicineNameController;
  late TextEditingController frequencyController;

  @override
  void initState() {
    super.initState();

    medicineNameController = TextEditingController(
      text: widget.medicineName,
    );

    frequencyController = TextEditingController(
      text: widget.frequency,
    );

    /// أهم جزء 🔥
    /// تحميل بيانات الكارد داخل Cubit
    context.read<UpdateMedicineCubit>().setInitialValues(
      frequency: widget.frequency,
      intakeTime: widget.intakeTime,
      startDate: widget.startDate,
      endDate: widget.endDate,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<
        UpdateMedicineCubit,
        UpdateMedicineState>(
      listener: (context, state) {
    if (state is UpdateMedicineSuccess) {
  Snackbar.showSuccess(
    context,
    message:
        context.l10n.medicine_saved_successfully,
  );

  Navigator.pop(context, true);
}

        if (state is UpdateMedicineError) {
          Snackbar.showError(
            context,
            message: mapFailureToMessage(
              context,
              state.failure,
            ),
          );
        }
      },
      builder: (context, state) {
        return SingleChildScrollView(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [
              /// Medicine Name
              TextApp(
                text: context.l10n.medicine_name,
                color: AppColors.primaryColor,
                fontSize: 14,
                weight: AppTextWeight.semiBold,
              ),

              SizedBox(height: 12.h),

              CustomTextField(
                controller: medicineNameController,
                hintText:
                    context.l10n.medicine_example,
                validator: (value) =>
                    ValidationHelper
                        .validateNotEmpty(
                  value,
                  fieldName: "Medicine name",
                ),
              ),

              SizedBox(height: 24.h),

              /// Frequency
              TextApp(
                text: context.l10n.frequency,
                color: AppColors.primaryColor,
                fontSize: 14,
                weight: AppTextWeight.semiBold,
              ),

              SizedBox(height: 12.h),

              UpdateFrequencyMedicineMenu(
                initialValue: widget.frequency,
              ),

              SizedBox(height: 24.h),

              /// Intake Time
              TextApp(
                text: context.l10n.intake_time,
                color: AppColors.primaryColor,
                fontSize: 14,
                weight: AppTextWeight.semiBold,
              ),

              SizedBox(height: 12.h),

              /// هنا الحل الحقيقي 🔥
              UpdateIntakeTime(
                initialTime: widget.intakeTime,
              ),

              SizedBox(height: 24.h),

              /// Duration
              TextApp(
                text: context.l10n.duration,
                color: AppColors.primaryColor,
                fontSize: 14,
                weight: AppTextWeight.semiBold,
              ),

              SizedBox(height: 12.h),

              /// هنا الحل الحقيقي 🔥
              UpdateDurationWidget(
                initialStartDate: widget.startDate,
                initialEndDate: widget.endDate,
              ),

              SizedBox(height: 32.h),

              /// Save Button
              CustomButton(
                text: context.l10n.save,
                isLoading:
                    state is UpdateMedicineLoading,
                onPressed: () {
                  context
                      .read<UpdateMedicineCubit>()
                      .updateMedicine(
                        medicineId: widget.medicineId,
                        medicineName:
                            medicineNameController
                                .text
                                .trim(),

                        /// دول بقوا fallback فقط
                        frequency: widget.frequency,
                        intakeTime: widget.intakeTime,
                        startDate: widget.startDate,
                        endDate: widget.endDate,
                      );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}