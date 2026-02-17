import 'package:flutter/material.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/localization_ext.dart';


class ArticleHeader extends StatelessWidget {
  const ArticleHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: TextApp(
        text: context.l10n.articles,
        weight: AppTextWeight.bold,
        fontSize: 22,
      ),
    );
  }
}
