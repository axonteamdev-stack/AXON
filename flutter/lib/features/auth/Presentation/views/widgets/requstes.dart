<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:flutter/material.dart';

class Requstes extends StatelessWidget {
  const Requstes({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.blueAccent,
      child: Center(
<<<<<<< HEAD
        child: Text('Requstes View'),
=======
        child: Text(context.l10n.requests),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

      ),
    );
  }
}