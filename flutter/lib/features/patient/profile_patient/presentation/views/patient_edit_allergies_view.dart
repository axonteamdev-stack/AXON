import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/empty_state_message.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/patient_dynamic_input_card.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/Patient%20Dynamic%20List/patient_edit_dynamic_list_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/Patient%20Dynamic%20List/patient_edit_dynamic_list_state.dart';

class PatientEditAllergiesView extends StatelessWidget {
  const PatientEditAllergiesView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => PatientEditDynamicListCubit()
        ..loadEditMockData(['Penicillin', 'Peanuts']),
      child: BlocBuilder<
          PatientEditDynamicListCubit,
          PatientEditDynamicListState>(
        builder: (context, state) {
          final cubit =
              context.read<PatientEditDynamicListCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,

            floatingActionButton: state.isEditMode
                ? FloatingActionButton(
                    backgroundColor: AppColors.primaryColor,
                    onPressed: cubit.addItem,
                    child: const Icon(
                      Icons.add,
                      color: Colors.white,
                    ),
                  )
                : null,

            bottomNavigationBar: Padding(
              padding:
                  EdgeInsets.fromLTRB(20.w, 12.h, 20.w, 24.h),
              child: CustomButton(
                text: state.isEditMode ? 'Save' : 'Edit',
                onPressed: cubit.toggleEdit,
              ),
            ),

            body: Column(
              children: [
                SizedBox(height: 55.h),

                const CenterIconHeader(
                  icon: Icons.error_outline,
                  title: 'Allergies',
                  subtitle: 'Your allergies',
                ),

                SizedBox(height: 30.h),

                Expanded(
                  child: state.items.isEmpty
                      ? const EmptyStateMessage(
                          icon: Icons.info_outline,
                          title: 'No allergies added yet',
                          subtitle: 'Tap Edit to add one',
                        )
                      : SingleChildScrollView(
                          padding: EdgeInsets.symmetric(
                              horizontal: 20.w),
                          child: Column(
                            children: List.generate(
                              state.items.length,
                              (index) {
                                final item =
                                    state.items[index];

                                return PatientDynamicInputCard(
                                  controller: item.controller,
                                  hint: 'Allergy name',
                                  enabled: state.isEditMode,
                                  onRemove: () =>
                                      cubit.removeItem(index),
                                );
                              },
                            ),
                          ),
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
