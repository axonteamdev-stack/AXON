import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';

import 'package:Axon/features/auth/Presentation/manager/patient%20documents/atient_documents_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient%20documents/patient_documents_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/upload_document_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientRadiologyView extends StatelessWidget {
  const PatientRadiologyView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientDocumentsCubit()..addDocument(),
      child: BlocConsumer<PatientDocumentsCubit, PatientDocumentsState>(
        listener: (context, state) {
          if (state.error != null) {
            Snackbar.showError(context, message: state.error!);
            context.read<PatientDocumentsCubit>().clearError();
          }
        },
        builder: (context, state) {
          final cubit = context.read<PatientDocumentsCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            floatingActionButton: FloatingActionButton(
              backgroundColor: AppColors.primaryColor,
              onPressed: cubit.addDocument,
              child: const Icon(Icons.add, color: AppColors.white),
            ),
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 55.h),
                  const CenterIconHeader(
                    icon: Icons.monitor_heart_outlined,
                    title: 'Radiology',
                    subtitle: 'Upload your radiology images',
                  ),
                  SizedBox(height: 30.h),
                  ...List.generate(
                    state.documents.length,
                    (index) => UploadDocumentCard(
                      file: state.documents[index].file,
                      labelController: state.documents[index].labelController,
                      onPick: () => cubit.pickImage(index),
                      onRemove: () => cubit.removeDocument(index),
                      onLabelChanged: (value) {
                        cubit.updateLabel(index, value);
                      },
                      hintText: 'Enter the type of medical scan',
                    ),
                  ),
                  SizedBox(height: 40.h),
                  CustomButton(
                    text: 'Next',
                    onPressed: () {
                      context.pushName(AppRoutes.patientLabTests);
                    },
                  ),
                  SizedBox(height: 40.h),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
