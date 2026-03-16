import 'package:flutter/material.dart';

class SplashAnimationController {
<<<<<<< HEAD
  late AnimationController fadeController;
  late AnimationController slideController;

  late Animation<double> fadeAnimation;
  late Animation<double> slideAnimation;

  void init(TickerProvider vsync) {
    fadeController = AnimationController(
=======
  late AnimationController xController;
  late AnimationController lettersController;

  late Animation<double> xFadeAnimation;
  late Animation<double> lettersFadeAnimation;

  void init({
    required TickerProvider vsync,
    required VoidCallback onFinished,
  }) {
    xController = AnimationController(
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
      vsync: vsync,
      duration: const Duration(milliseconds: 2000),
    );

<<<<<<< HEAD
    slideController = AnimationController(
=======
    lettersController = AnimationController(
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
      vsync: vsync,
      duration: const Duration(milliseconds: 1200),
    );

<<<<<<< HEAD
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
=======
    xFadeAnimation = CurvedAnimation(
      parent: xController,
      curve: Curves.easeIn,
    );

    lettersFadeAnimation = CurvedAnimation(
      parent: lettersController,
      curve: Curves.easeOut,
    );

    xController.forward();

    xController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        lettersController.forward();
      }
    });

   lettersController.addStatusListener((status) async {
  if (status == AnimationStatus.completed) {
    await Future.delayed(const Duration(milliseconds: 300));
    onFinished();
  }
});
  }

  void dispose() {
    xController.dispose();
    lettersController.dispose();
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  }
}
