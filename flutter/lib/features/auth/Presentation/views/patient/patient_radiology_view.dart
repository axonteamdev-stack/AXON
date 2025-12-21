import 'package:Axon/core/extensions/context_extension.dart';
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
      child: Builder(
        builder: (blocContext) {
          return Scaffold(
            backgroundColor: AppColors.white,

            body: Stack(
              children: [
                Column(
                  children: [
                    Expanded(
                      child: SingleChildScrollView(
                        padding:
                            EdgeInsets.symmetric(horizontal: 20.w),
                        child: BlocBuilder<PatientDocumentsCubit,
                            PatientDocumentsState>(
                          builder: (context, state) {
                            final cubit = blocContext
                                .read<PatientDocumentsCubit>();

                            return Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                SizedBox(height: 55.h),

                                const CenterIconHeader(
                                  icon: Icons.monitor_heart_outlined,
                                  title: 'Radiology',
                                  subtitle:
                                      'Upload your radiology images',
                                ),

                                SizedBox(height: 30.h),

                                ...List.generate(
                                  state.documents.length,
                                  (index) => UploadDocumentCard(
                                    file:
                                        state.documents[index].file,
                                    labelController: state
                                        .documents[index]
                                        .labelController,
                                    onPick: () =>
                                        cubit.pickImage(index),
                                    onRemove: () =>
                                        cubit.removeDocument(index),
                                    onLabelChanged: (v) =>
                                        cubit.updateLabel(index, v),
                                    hintText:
                                        'Enter the type of medical scan',
                                  ),
                                ),

                                SizedBox(height: 120.h),
                              ],
                            );
                          },
                        ),
                      ),
                    ),

                    Padding(
                      padding: EdgeInsets.fromLTRB(
                          20.w, 0, 20.w, 24.h),
                      child: CustomButton(
                        text: 'Next',
                        onPressed: () {
                          blocContext.pushName(
                              AppRoutes.patientLabTests);
                        },
                      ),
                    ),
                  ],
                ),

                Positioned(
                  right: 20.w,
                  bottom: 90.h,
                  child: FloatingActionButton(
                    backgroundColor: AppColors.primaryColor,
                    onPressed: () => blocContext
                        .read<PatientDocumentsCubit>()
                        .addDocument(),
                    child: const Icon(Icons.add,
                        color: Colors.white),
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
