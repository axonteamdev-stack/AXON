import 'package:Axon/core/errors/mappers/failure_to_message_mapper.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine%20cubit/medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine%20cubit/medicine_state.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/duration_widget.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/frequency_medicine_menu.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/intake_time_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AddMedicineBody extends StatelessWidget {
  const AddMedicineBody({super.key});

  @override
  Widget build(BuildContext context) {
    /// هنا نستخدم نفس الـ instance من BlocProvider
    final medicineCubit = context.read<MedicineCubit>();

    return BlocConsumer<MedicineCubit, MedicineState>(
      listener: (context, state) {
        if (state is MedicineSuccessState) {
          Snackbar.showSuccess(
            context,
            message: context.l10n.medicine_saved_successfully,
          );
        } else if (state is MedicineErrorState) {
          Snackbar.showError(
            context,
            message: mapFailureToMessage(context, state.failure),
          );
        }
      },

      builder: (context, state) {
        return SingleChildScrollView(
          padding: EdgeInsets.all(16.w),

          child: Form(
            key: medicineCubit.formKey,

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
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
                  controller: medicineCubit.medicineNameController,
                  hintText: context.l10n.medicine_example,

                  validator: (value) => ValidationHelper.validateNotEmpty(
                    value,
                    fieldName: "Medicine name",
                  ),
                ),

                SizedBox(height: 24.h),

                TextApp(
                  text: context.l10n.dosage,
                  color: AppColors.primaryColor,
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),

                SizedBox(height: 12.h),

                CustomTextField(
                  controller: medicineCubit.medicineDosageController,
                  hintText: context.l10n.dosage_hint,
                  keyboardType: TextInputType.numberWithOptions(),

                  validator: (value) => ValidationHelper.validateNotEmpty(
                    value,
                    fieldName: "Dosage",
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

                FrequencyMedicineMenu(),

                SizedBox(height: 24.h),

                /// Intake Time
                TextApp(
                  text: context.l10n.intake_time,
                  color: AppColors.primaryColor,
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),

                SizedBox(height: 12.h),

                const IntakeTime(),

                SizedBox(height: 24.h),

                /// Duration
                TextApp(
                  text: context.l10n.duration,
                  color: AppColors.primaryColor,
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),

                SizedBox(height: 12.h),

                const DurationWidget(),

                SizedBox(height: 24.h),

                TextApp(
                  text: context.l10n.instructions__notes,
                  color: AppColors.primaryColor,
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),

                SizedBox(height: 12.h),

                CustomTextField(
                  controller: medicineCubit.medicineNotesController,
                  hintText: context.l10n.instructions_notes,
                  maxLines: 4,
                  validator: (value) => ValidationHelper.validateNotEmpty(
                    value,
                    fieldName: "notes",
                  ),
                ),

                SizedBox(height: 32.h),

                // todo: Save Button
                CustomButton(
                  icon: Icon(Icons.medication_outlined, color: AppColors.white),

                  text: context.l10n.save,

                  isLoading: state is MedicineLoadingState,
                  onPressed: () {
                    medicineCubit.addMedicine(context);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
