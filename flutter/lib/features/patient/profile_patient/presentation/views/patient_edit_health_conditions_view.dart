import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_edit_profile_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';

class PatientEditHealthConditionsView extends StatelessWidget {
  const PatientEditHealthConditionsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientEditProfileCubit()..addField(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(title: const Text('Health Conditions')),
        floatingActionButton: FloatingActionButton(
          onPressed:
              context.read<PatientEditProfileCubit>().addField,
          child: const Icon(Icons.add),
        ),
        body: BlocBuilder<PatientEditProfileCubit,
            PatientEditProfileState>(
          builder: (context, state) {
            final cubit = context.read<PatientEditProfileCubit>();

            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  ...List.generate(
                    cubit.dynamicControllers.length,
                    (i) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: CustomTextField(
                        hintText: 'Condition name',
                        controller: cubit.dynamicControllers[i],
                      ),
                    ),
                  ),
                  const Spacer(),
                  CustomButton(text: 'Save', onPressed: () {}),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
