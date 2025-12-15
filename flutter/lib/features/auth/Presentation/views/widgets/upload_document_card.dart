import 'dart:io';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class UploadDocumentCard extends StatelessWidget {
  final File? file;
  final TextEditingController labelController;
  final VoidCallback onPick;
  final VoidCallback onRemove;
  final ValueChanged<String> onLabelChanged;
  final String hintText;

  const UploadDocumentCard({
    super.key,
    required this.file,
    required this.labelController,
    required this.onPick,
    required this.onRemove,
    required this.onLabelChanged,
    required this.hintText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16.h),
      padding: EdgeInsets.all(12.r),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.grey),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: onPick,
            child: Container(
              height: 120.h,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.grey),
              ),
              child: file == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.cloud_upload_outlined,
                          size: 32,
                          color: AppColors.grey,
                        ),
                        SizedBox(height: 10.h),
                        const TextApp(
                          text: 'Drag or Click to upload attachment',
                          color: AppColors.grey,
                          fontSize: 14,
                        ),
                      ],
                    )
                  : Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.file(
                            file!,
                            width: double.infinity,
                            height: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          top: 6,
                          right: 6,
                          child: GestureDetector(
                            onTap: onRemove,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Colors.black54,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.close,
                                size: 16,
                                color: AppColors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          SizedBox(height: 12.h),
          const TextApp(
            text: 'Description',
            weight: AppTextWeight.semiBold,
            fontSize: 13,
            color: AppColors.black,
          ),
          SizedBox(height: 6.h),
          CustomTextField(
            controller: labelController,
            hintText: hintText,
            onChanged: onLabelChanged,
          ),
        ],
      ),
    );
  }
}
