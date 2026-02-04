import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../manager/community_patient/patient_community_cubit.dart';

class ReplyBottomSheet extends StatelessWidget {
  final String postId;
  final String commentId;

  const ReplyBottomSheet({
    super.key,
    required this.postId,
    required this.commentId,
  });

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();

    return Padding(
      padding: MediaQuery.of(context).viewInsets,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const TextApp(
              text: 'Reply',
              weight: AppTextWeight.bold,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                hintText: 'Write a reply...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                if (controller.text.isEmpty) return;

                context.read<PatientCommunityCubit>().addReply(
                      postId,
                      commentId,
                      controller.text,
                    );

                Navigator.pop(context);
              },
              child: const Text('Send'),
            ),
          ],
        ),
      ),
    );
  }
}
