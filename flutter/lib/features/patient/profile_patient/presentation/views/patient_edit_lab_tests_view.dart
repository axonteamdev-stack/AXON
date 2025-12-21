import 'package:Axon/features/auth/Presentation/manager/patient%20documents/atient_documents_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient%20documents/patient_documents_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/upload_document_card.dart';

class PatientEditLabTestsView extends StatelessWidget {
  const PatientEditLabTestsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientDocumentsCubit()..addDocument(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(
          title: const Text('Lab Tests'),
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: AppColors.primaryColor,
          onPressed:
              context.read<PatientDocumentsCubit>().addDocument,
          child: const Icon(Icons.add, color: Colors.white),
        ),
        body: BlocBuilder<PatientDocumentsCubit,
            PatientDocumentsState>(
          builder: (context, state) {
            final cubit =
                context.read<PatientDocumentsCubit>();

            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          ...List.generate(
                            state.documents.length,
                            (index) => UploadDocumentCard(
                              file:
                                  state.documents[index].file,
                              labelController:
                                  state.documents[index]
                                      .labelController,
                              onPick: () =>
                                  cubit.pickImage(index),
                              onRemove: () =>
                                  cubit.removeDocument(index),
                              onLabelChanged: (v) =>
                                  cubit.updateLabel(index, v),
                              hintText:
                                  'Lab test description',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  CustomButton(
                    text: 'Save',
                    onPressed: () {
                     
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
