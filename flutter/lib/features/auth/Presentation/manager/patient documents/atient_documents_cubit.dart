import 'dart:io';
import 'package:Axon/features/auth/data/models/patient_document_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'patient_documents_state.dart';

class PatientDocumentsCubit extends Cubit<PatientDocumentsState> {
  PatientDocumentsCubit() : super(PatientDocumentsState.initial());

  final ImagePicker _picker = ImagePicker();

  void addDocument() {
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

  Future<void> pickImage(int index) async {
    try {
      final picked =
          await _picker.pickImage(source: ImageSource.gallery);

      if (picked == null) return;

      final updated = [...state.documents];
      updated[index].file = File(picked.path);

      emit(state.copyWith(documents: updated));
    } catch (_) {
      emit(state.copyWith(error: 'Failed to pick image'));
    }
  }

  void updateLabel(int index, String value) {
    state.documents[index].labelController.text = value;
    emit(state.copyWith(documents: [...state.documents]));
  }

  void removeDocument(int index) {
    final updated = [...state.documents];
    updated[index].labelController.dispose();
    updated.removeAt(index);

    emit(state.copyWith(documents: updated));
  }

  void clearError() {
    emit(state.copyWith(error: null));
  }

  @override
  Future<void> close() {
    for (final doc in state.documents) {
      doc.labelController.dispose();
    }
    return super.close();
  }
}
