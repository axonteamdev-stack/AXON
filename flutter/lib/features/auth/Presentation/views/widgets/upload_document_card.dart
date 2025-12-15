import 'dart:io';
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
    required this.onLabelChanged, required this.hintText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 16.h),
      padding: EdgeInsets.all(12.r),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Upload Box (نفس شكل Medical License)
          GestureDetector(
            onTap: onPick,
            child: Container(
              height: 120.h,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: file == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.cloud_upload_outlined,
                          size: 32,
                          color: Colors.grey.shade600,
                        ),
                        SizedBox(height: 10.h),
                        Text(
                          "Drag or Click to upload attachment",
                          style: TextStyle(color: Colors.grey.shade600),
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

                        /// ❌ Remove
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
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),

          SizedBox(height: 12.h),

          /// Label input
          Text(
            "Description",
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13.sp,
            ),
          ),

          SizedBox(height: 6.h),

          TextField(
            controller: labelController,
            onChanged: onLabelChanged,
            decoration: InputDecoration(
              hintText: hintText,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              isDense: true,
            ),
          ),
        ],
      ),
    );
  }
}
