import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SplashCenterLogo extends StatelessWidget {
  final Animation<double> fadeAnimation;

  const SplashCenterLogo({super.key, required this.fadeAnimation});
=======

class SplashCenterLogo extends StatelessWidget {
  final Animation<double> animation;

  const SplashCenterLogo({
    super.key,
    required this.animation,
  });
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
<<<<<<< HEAD
        animation: fadeAnimation,
        builder: (context, child) {
          final start = fadeAnimation.value.clamp(0.0, 1.0);
=======
        animation: animation,
        builder: (context, child) {
          final start = animation.value.clamp(0.0, 1.0);
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
          final end = (start + 0.1).clamp(0.0, 1.0);

          return ShaderMask(
            shaderCallback: (bounds) {
              return LinearGradient(
                colors: [
                  Colors.white.withAlpha(255),
                  Colors.white.withAlpha(0),
                ],
                stops: [start, end],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ).createShader(bounds);
            },
            blendMode: BlendMode.dstIn,
            child: child,
          );
        },
<<<<<<< HEAD
        child: Image.asset("assets/logo/X.png" , width: 400.w),
=======
        child: Image.asset('assets/logo/X.png'),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
      ),
    );
  }
}
