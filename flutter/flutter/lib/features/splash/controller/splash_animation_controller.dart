import 'package:flutter/material.dart';

class SplashAnimationController {
  late AnimationController fadeController;
  late AnimationController slideController;

  late Animation<double> fadeAnimation;
  late Animation<double> slideAnimation;

  void init(TickerProvider vsync) {
    fadeController = AnimationController(
      vsync: vsync,
      duration: const Duration(milliseconds: 2000),
    );

    slideController = AnimationController(
      vsync: vsync,
      duration: const Duration(milliseconds: 1200),
    );

    fadeAnimation = CurvedAnimation(
      parent: fadeController,
      curve: Curves.easeIn,
    );

    slideAnimation = CurvedAnimation(
      parent: slideController,
      curve: Curves.easeOut,
    );

    fadeController.forward();
  }

  void dispose() {
    fadeController.dispose();
    slideController.dispose();
  }
}
