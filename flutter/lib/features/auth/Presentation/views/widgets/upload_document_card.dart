import 'dart:io';
import 'package:flutter/material.dart';
import 'package:Axon/core/widgets/text_app.dart';

class UploadDocumentCard extends StatelessWidget {
  final File? file;
  final TextEditingController labelController;
  final bool enabled;
  final VoidCallback onPick;
  final VoidCallback onRemove;
  final ValueChanged<String> onLabelChanged;
  final String hintText;

  const UploadDocumentCard({
    super.key,
    required this.file,
    required this.labelController,
    required this.enabled,
    required this.onPick,
    required this.onRemove,
    required this.onLabelChanged,
    required this.hintText,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: enabled ? onPick : null,
              child: Container(
                height: 120,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: const Center(
                  child: Icon(
                    Icons.cloud_upload_outlined,
                    size: 40,
                    color: Colors.grey,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const TextApp(
                  text: 'Description',
                  fontSize: 14,
                  weight: AppTextWeight.semiBold,
                ),
                if (enabled)
                  InkWell(
                    onTap: onRemove,
                    borderRadius: BorderRadius.circular(8),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 4,
                      ),
                      child: Row(
                        children: const [
                          Icon(
                            Icons.delete_outline,
                            size: 16,
                            color: Colors.grey,
                          ),
                          SizedBox(width: 4),
                          TextApp(
                            text: 'Remove',
                            fontSize: 12,
                            color: Colors.grey,
                            weight: AppTextWeight.semiBold,
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            TextField(
              controller: labelController,
              enabled: enabled,
              onChanged: onLabelChanged,
              decoration: InputDecoration(
                hintText: hintText,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
