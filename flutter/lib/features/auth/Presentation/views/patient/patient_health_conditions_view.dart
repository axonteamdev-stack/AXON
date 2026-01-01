import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/selectable_item_grid.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientHealthConditionsView extends StatelessWidget {
  PatientHealthConditionsView({super.key});

  final List<String> conditions = const [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Arthritis",
    "Thyroid Disorder",
    "Kidney Disease",
    "Liver Disease",
    "Cancer",
    "Epilepsy",
    "Depression",
    "Anxiety",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 55.h),

            CenterIconHeader(
              icon: Icons.favorite_outline,
              title: "Health Conditions",
              subtitle: "Do you have any chronic conditions?",
            ),

            SizedBox(height: 40.h),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const TextApp(
                  text: "Select all that apply",
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),
                BlocBuilder<PatientRegistrationCubit, PatientRegistrationState>(
                  builder: (context, state) {
                    return TextApp(
                      text: "${state.selectedConditions.length} Selected",
                      fontSize: 10,
                      color: AppColors.grey,
                    );
                  },
                ),
              ],
            ),

            // SizedBox(height: 12.h),
            BlocBuilder<PatientRegistrationCubit, PatientRegistrationState>(
              builder: (context, state) {
                return SelectableItemGrid(
                  items: conditions,
                  selectedItems: state.selectedConditions,
                  selectedColor: AppColors.primaryColor,
                  onSelect: (c) => context
                      .read<PatientRegistrationCubit>()
                      .toggleCondition(c),
                );
              },
            ),

            SizedBox(height: 30.h),

            Padding(
              padding: EdgeInsets.only(bottom: 40.h),
              child: CustomButton(
                text: "Next",
                onPressed: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.patientAllergies,
                    arguments: context.read<PatientRegistrationCubit>(),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
