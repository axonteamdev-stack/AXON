import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_dynamic_list/patient_dynamic_list_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_dynamic_list/patient_dynamic_list_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/patient_dynamic_input_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientHealthConditionsView extends StatelessWidget {
  const PatientHealthConditionsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientDynamicListCubit(),
      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,

            floatingActionButton: FloatingActionButton(
              backgroundColor: AppColors.primaryColor,
              onPressed: () {
                context.read<PatientDynamicListCubit>().addItem();
              },
              child: const Icon(Icons.add, color: Colors.white),
            ),

            bottomNavigationBar: Padding(
              padding: EdgeInsets.fromLTRB(20.w, 12.h, 20.w, 24.h),
              child: CustomButton(
                text: 'Next',
                onPressed: () {
                  context.pushName(AppRoutes.patientAllergies);
                },
              ),
            ),

            body: BlocBuilder<PatientDynamicListCubit, PatientDynamicListState>(
              builder: (context, state) {
                return SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 20.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 55.h),
                      const CenterIconHeader(
                        icon: Icons.favorite_outline,
                        title: 'Health Conditions',
                        subtitle: 'Add your health conditions',
                      ),
                      SizedBox(height: 30.h),
                      ...List.generate(
                        state.items.length,
                        (index) => PatientDynamicInputCard(
                          controller: state.items[index].controller,
                          hint: 'Enter condition name',
                        ),
                      ),
                      SizedBox(height: 120.h),
                    ],
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
