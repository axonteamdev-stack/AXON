import 'package:Axon/core/extensions/context_extension.dart';
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

class PatientAllergiesView extends StatelessWidget {
  PatientAllergiesView({super.key});

  final List<String> allergies = const [
    'Penicillin',
    'Aspirin',
    'Ibuprofen',
    'Sulfa Drugs',
    'Latex',
    'Peanuts',
    'Tree Nuts',
    'Shellfish',
    'Eggs',
    'Milk',
    'Soy',
    'Dust',
    'Pollen',
    'Pet Dander',
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
            const CenterIconHeader(
              icon: Icons.error_outline_rounded,
              title: 'Allergies',
              subtitle: 'Do you have any known allergies?',
            ),
            SizedBox(height: 40.h),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const TextApp(
                  text: 'Select all that apply',
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),
                BlocBuilder<PatientRegistrationCubit, PatientRegistrationState>(
                  builder: (context, state) {
                    return TextApp(
                      text: '${state.selectedAllergies.length} Selected',
                      fontSize: 10,
                      color: AppColors.grey,
                    );
                  },
                ),
              ],
            ),
            BlocBuilder<PatientRegistrationCubit, PatientRegistrationState>(
              builder: (context, state) {
                return SelectableItemGrid(
                  items: allergies,
                  selectedItems: state.selectedAllergies,
                  selectedColor: AppColors.primaryColor,
                  onSelect: (a) => context
                      .read<PatientRegistrationCubit>()
                      .toggleAllergy(a),
                );
              },
            ),
            SizedBox(height: 30.h),
            Padding(
              padding: EdgeInsets.only(bottom: 40.h),
              child: CustomButton(
                text: 'Finish',
                onPressed: () {
                  context.pushName(AppRoutes.patientRadiology);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
