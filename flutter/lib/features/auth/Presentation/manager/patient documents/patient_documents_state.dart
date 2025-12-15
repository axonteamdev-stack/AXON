import 'package:Axon/features/auth/data/models/patient_document_model.dart';


class PatientDocumentsState {
  final List<PatientDocumentModel> documents;
  final String? error;

  const PatientDocumentsState({
    required this.documents,
    this.error,
  });

  factory PatientDocumentsState.initial() {
    return const PatientDocumentsState(documents: []);
  }

  PatientDocumentsState copyWith({
    List<PatientDocumentModel>? documents,
    String? error,
  }) {
    return PatientDocumentsState(
      documents: documents ?? this.documents,
      error: error,
    );
  }
}
