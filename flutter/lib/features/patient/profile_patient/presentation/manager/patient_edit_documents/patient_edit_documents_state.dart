import 'package:Axon/features/auth/data/models/patient_document_model.dart';

class PatientEditDocumentsState {
  final bool isEditMode;
  final List<PatientDocumentModel> documents;

  const PatientEditDocumentsState({
    required this.isEditMode,
    required this.documents,
  });

  PatientEditDocumentsState copyWith({
    bool? isEditMode,
    List<PatientDocumentModel>? documents,
  }) {
    return PatientEditDocumentsState(
      isEditMode: isEditMode ?? this.isEditMode,
      documents: documents ?? this.documents,
    );
  }
}
