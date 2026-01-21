import 'package:flutter/material.dart';
import 'package:Axon/core/widgets/text_app.dart';

class ArticleHeader extends StatelessWidget {
  const ArticleHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Align(
      alignment: Alignment.centerLeft,
      child: TextApp(
        text: 'Articles',
        weight: AppTextWeight.bold,
        fontSize: 22,
      ),
    );
  }
}
