import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'patient_edit_documents_state.dart';
import 'package:Axon/features/auth/data/models/patient_document_model.dart';

class PatientEditDocumentsCubit
    extends Cubit<PatientEditDocumentsState> {
  PatientEditDocumentsCubit()
      : super(
          const PatientEditDocumentsState(
            isEditMode: false,
            documents: [],
          ),
        );


  void loadEditRadiology() {
    emit(
      state.copyWith(
        documents: [
          PatientDocumentModel(
            labelController:
                TextEditingController(text: 'Chest X-Ray'),
          ),
          PatientDocumentModel(
            labelController:
                TextEditingController(text: 'MRI Brain'),
          ),
        ],
      ),
    );
  }

  void loadEditLabTests() {
    emit(
      state.copyWith(
        documents: [
          PatientDocumentModel(
            labelController: TextEditingController(text: 'CBC'),
          ),
          PatientDocumentModel(
            labelController:
                TextEditingController(text: 'Blood Sugar'),
          ),
        ],
      ),
    );
  }






  Future<void> pickImage(int index) async {
  if (!state.isEditMode) return;

  final picker = ImagePicker();
  final XFile? picked =
      await picker.pickImage(source: ImageSource.gallery);

  if (picked == null) return;

  final file = File(picked.path);

  state.documents[index].file = file;

  emit(state.copyWith(documents: [...state.documents]));
}



  void toggleEditMode() {
    emit(state.copyWith(isEditMode: !state.isEditMode));
  }

  void addDocument() {
    if (!state.isEditMode) return;

    emit(
      state.copyWith(
        documents: [
          ...state.documents,
          PatientDocumentModel(
            labelController: TextEditingController(),
          ),
        ],
      ),
    );
  }

  void removeDocument(int index) {
    if (!state.isEditMode) return;

    final list = [...state.documents]..removeAt(index);
    emit(state.copyWith(documents: list));
  }

  void updateLabel(int index, String value) {
    if (!state.isEditMode) return;

    state.documents[index].labelController.text = value;
    emit(state);
  }

  @override
  Future<void> close() {
    for (final doc in state.documents) {
      doc.labelController.dispose();
    }
    return super.close();
  }
}
