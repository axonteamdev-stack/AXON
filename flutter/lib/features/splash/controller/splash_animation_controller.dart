import 'package:flutter/material.dart';

class SplashAnimationController {
  late AnimationController xController;
  late AnimationController lettersController;

  late Animation<double> xFadeAnimation;
  late Animation<double> lettersFadeAnimation;

  void init({
    required TickerProvider vsync,
    required VoidCallback onFinished,
  }) {
    xController = AnimationController(
      vsync: vsync,
      duration: const Duration(milliseconds: 2000),
    );

    lettersController = AnimationController(
      vsync: vsync,
      duration: const Duration(milliseconds: 1200),
    );

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
  }
}
