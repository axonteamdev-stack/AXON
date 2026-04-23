import 'dart:io';

import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/auth/data/models/patient_document_model.dart';
import 'package:Axon/features/patient/profile_patient/domain/usecases/update_profile_patient_use_case.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';

import 'patient_edit_documents_state.dart';
@injectable
class PatientEditDocumentsCubit
    extends Cubit<PatientEditDocumentsState> {
  final UpdateProfilePatientUseCase updateProfilePatientUseCase;

  final bool isRadiology;

  PatientEditDocumentsCubit({
    required this.updateProfilePatientUseCase,
    required this.isRadiology,
  }) : super(
          const PatientEditDocumentsState(
            isEditMode: false,
            documents: [],
          ),
        ) {
    loadData();
  }

  final SharedPref sharedPref = SharedPref();

  /// =========================
  /// Load Existing Data
  /// =========================
  void loadData() {
    final savedText = sharedPref.getString(
          isRadiology
              ? PrefKeys.radiologyDescriptions
              : PrefKeys.labDescriptions,
        ) ??
        "";

    final values = savedText.isEmpty
        ? <String>[]
        : savedText.split(",");

    emit(
      state.copyWith(
        documents: values
            .map(
              (e) => PatientDocumentModel(
                labelController:
                    TextEditingController(text: e),
              ),
            )
            .toList(),
      ),
    );
  }

  /// =========================
  /// Pick Image
  /// =========================
  Future<void> pickImage(int index) async {
    if (!state.isEditMode) return;

    final picker = ImagePicker();

    final XFile? picked = await picker.pickImage(
      source: ImageSource.gallery,
    );

    if (picked == null) return;

    final file = File(picked.path);

    state.documents[index].file = file;

    print("IMAGE PICKED => ${file.path}");

    emit(
      state.copyWith(
        documents: [...state.documents],
      ),
    );
  }

  /// =========================
  /// Toggle Edit
  /// =========================
  void toggleEditMode() {
    emit(
      state.copyWith(
        isEditMode: !state.isEditMode,
      ),
    );
  }

  /// =========================
  /// Add New Document
  /// =========================
  void addDocument() {
    if (!state.isEditMode) return;

    emit(
      state.copyWith(
        documents: [
          ...state.documents,
          PatientDocumentModel(
            labelController:
                TextEditingController(),
          ),
        ],
      ),
    );
  }

  /// =========================
  /// Remove Document
  /// =========================
  void removeDocument(int index) {
    if (!state.isEditMode) return;

    final list = [...state.documents];
    list.removeAt(index);

    emit(
      state.copyWith(
        documents: list,
      ),
    );
  }

  /// =========================
  /// Update Label
  /// =========================
  void updateLabel(
    int index,
    String value,
  ) {
    if (!state.isEditMode) return;

    state.documents[index]
        .labelController
        .text = value;

    emit(
      state.copyWith(
        documents: [...state.documents],
      ),
    );
  }

  /// =========================
  /// Save To API
  /// =========================
  Future<void> saveData() async {
    final descriptions = state.documents
        .map((e) => e.labelController.text.trim())
        .where((e) => e.isNotEmpty)
        .toList();

    final files = state.documents
        .where((e) => e.file != null)
        .map((e) => e.file!)
        .toList();

    print("========== SAVE DOCS ==========");
    print("isRadiology: $isRadiology");
    print("Descriptions: $descriptions");
    print("Files Count: ${files.length}");
    print("================================");

    final result = await updateProfilePatientUseCase.call(
      fullName:
          sharedPref.getString(PrefKeys.fullName) ?? "",
      email:
          sharedPref.getString(PrefKeys.email) ?? "",
      phoneNumber:
          sharedPref.getString(PrefKeys.phoneNumber) ?? "",
      gender:
          sharedPref.getString(PrefKeys.gender) ??
              "Male",
      bloodType:
          sharedPref.getString(PrefKeys.bloodType) ??
              "O+",
      height: double.tryParse(
            sharedPref.getString(PrefKeys.height) ??
                "0",
          ) ??
          0,
      weight: double.tryParse(
            sharedPref.getString(PrefKeys.weight) ??
                "0",
          ) ??
          0,
      conditions: (sharedPref
                  .getString(PrefKeys.conditions) ??
              "")
          .split(",")
          .where((e) => e.isNotEmpty)
          .toList(),
      allergies: (sharedPref
                  .getString(PrefKeys.allergies) ??
              "")
          .split(",")
          .where((e) => e.isNotEmpty)
          .toList(),

      personalPhoto: null,

      radiologyImages:
          isRadiology ? files : [],

      radiologyDescriptions:
          isRadiology ? descriptions : [],

      labImages:
          isRadiology ? [] : files,

      labDescriptions:
          isRadiology ? [] : descriptions,
    );

    result.fold(
      (Failure failure) {
        print("SAVE DOCS ERROR => $failure");
      },
      (success) async {
        print("SAVE DOCS SUCCESS");

        await sharedPref.setString(
          isRadiology
              ? PrefKeys.radiologyDescriptions
              : PrefKeys.labDescriptions,
          descriptions.join(","),
        );

        emit(
          state.copyWith(
            isEditMode: false,
          ),
        );
      },
    );
  }

  @override
  Future<void> close() {
    for (final doc in state.documents) {
      doc.labelController.dispose();
    }

    return super.close();
  }
}