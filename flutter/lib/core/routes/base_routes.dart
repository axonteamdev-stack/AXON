import 'package:flutter/material.dart';

class BaseRoute extends PageRouteBuilder<dynamic> {
  final Widget page;

  BaseRoute({required this.page})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) =>
              Stack(children: [page]),
          transitionsBuilder: (context, animation, secondaryAnimation, widget) {
            final tween = Tween(begin: 0.0, end: 1.0);
            final curve = CurvedAnimation(
              parent: animation,
              curve: Curves.linearToEaseOut,
            );

            return ScaleTransition(
              scale: tween.animate(curve),
              child: widget,
            );
          },
        );
}
