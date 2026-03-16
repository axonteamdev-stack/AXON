import 'dart:io';
import 'package:flutter/material.dart';

class PatientDocumentModel {
  File? file;
  final TextEditingController labelController;

  PatientDocumentModel({
    this.file,
    required this.labelController,
  });
}
