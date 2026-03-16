import 'dart:io';
import 'package:flutter/material.dart';

class PatientDocumentModel {
  File? file;
  final TextEditingController labelController;

  PatientDocumentModel({this.file, String? label})
      : labelController =
            TextEditingController(text: label ?? '');
}
