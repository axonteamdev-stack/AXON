import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:flutter/material.dart';

class Requstes extends StatelessWidget {
  const Requstes({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.blueAccent,
      child: Center(
        child: Text(context.l10n.requests),

      ),
    );
  }
}