import 'dart:io';



import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';

class UploadMedicalLicenseBox extends StatelessWidget {
  final XFile? file;
  final VoidCallback onTap;

  const UploadMedicalLicenseBox({
    super.key,
    this.file,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 120.h,
        width: double.infinity,
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.grey),
          borderRadius: BorderRadius.circular(10),
        ),
        child: file != null
            ? Image.file(File(file!.path), fit: BoxFit.cover)
            : const Center(child: Text("Upload Image")),
      ),
    );
  }
}