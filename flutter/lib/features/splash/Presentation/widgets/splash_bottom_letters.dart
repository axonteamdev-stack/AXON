import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SplashBottomLetters extends StatelessWidget {
  final Animation<double> animation;
=======

class SplashBottomLetters extends StatelessWidget {
  final Animation<double> animation;

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  const SplashBottomLetters({super.key, required this.animation});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: MediaQuery.of(context).size.height / 2 - 87,
      left: MediaQuery.of(context).size.width / 2 - 73,
<<<<<<< HEAD
      width: 140.w,
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          final start = animation.value - 0.005;
          final end = animation.value - 0.8;

          return ShaderMask(
            shaderCallback: (bounds) {
              return LinearGradient(
                colors: [
                  Colors.white.withAlpha(255),
                  Colors.white.withAlpha(0),
                ],
                stops: [start, end],
=======
      width: 140,
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          return ShaderMask(
            shaderCallback: (Rect bounds) {
              return LinearGradient(
                colors: [
                  if (animation.isAnimating || animation.isCompleted)
                    Colors.white
                  else
                    Colors.transparent,
                  Colors.transparent,
                ],
                stops: [animation.value, animation.value + 0.2],
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ).createShader(bounds);
            },
            blendMode: BlendMode.dstIn,
            child: child,
          );
        },
<<<<<<< HEAD

        child: FittedBox(
          child: SizedBox(
            height: 50.h,
            child: Row(
              children: [
                Image.asset("assets/logo/A.png", width: 44.w),
                 SizedBox(width: 40.w),
                Image.asset("assets/logo/O.png"),
                Image.asset("assets/logo/N.png"),
              ],
=======
        child: RepaintBoundary(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: SizedBox(
              height: 50,
              child: Row(
                children: [
                  Image.asset("assets/logo/A.png", width: 44),
                  const SizedBox(width: 40),
                  Image.asset("assets/logo/O.png"),
                  Image.asset("assets/logo/N.png"),
                ],
              ),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
            ),
          ),
        ),
      ),
    );
  }
}
