import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/empty_state_message.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/upload_document_card.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_documents/patient_edit_documents_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_documents/patient_edit_documents_state.dart';

class PatientEditLabTestsView extends StatelessWidget {
  const PatientEditLabTestsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          PatientEditDocumentsCubit()..loadEditLabTests(),
      child: BlocBuilder<
          PatientEditDocumentsCubit,
          PatientEditDocumentsState>(
        builder: (context, state) {
          final cubit =
              context.read<PatientEditDocumentsCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,

            floatingActionButton: state.isEditMode
                ? FloatingActionButton(
                    backgroundColor: AppColors.primaryColor,
                    onPressed: cubit.addDocument,
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
                onPressed: cubit.toggleEditMode,
              ),
            ),

            body: Column(
              children: [
                SizedBox(height: 55.h),

                const CenterIconHeader(
                  icon: Icons.science_outlined,
                  title: 'Lab Tests',
                  subtitle: 'Medical lab tests',
                ),

                SizedBox(height: 30.h),

                Expanded(
                  child: state.documents.isEmpty
                      ? const EmptyStateMessage(
                          icon: Icons.info_outline,
                          title: 'No lab tests added yet',
                          subtitle: 'Tap Edit to add one',
                        )
                      : SingleChildScrollView(
                          padding: EdgeInsets.symmetric(
                              horizontal: 20.w),
                          child: Column(
                            children: List.generate(
                              state.documents.length,
                              (index) {
                                final document =
                                    state.documents[index];

                                return UploadDocumentCard(
                                  file: document.file,
                                  labelController:
                                      document.labelController,
                                  enabled: state.isEditMode,
                                  onPick: () =>
                                      cubit.pickImage(index),
                                  onRemove: () =>
                                      cubit.removeDocument(index),
                                  onLabelChanged: (value) =>
                                      cubit.updateLabel(
                                          index, value),
                                  hintText: 'Test name',
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
