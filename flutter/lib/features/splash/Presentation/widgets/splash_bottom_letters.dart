import 'package:flutter/material.dart';

class SplashBottomLetters extends StatelessWidget {
  final Animation<double> animation;

  const SplashBottomLetters({super.key, required this.animation});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: MediaQuery.of(context).size.height / 2 - 87,
      left: MediaQuery.of(context).size.width / 2 - 73,
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
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ).createShader(bounds);
            },
            blendMode: BlendMode.dstIn,
            child: child,
          );
        },
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
            ),
          ),
        ),
      ),
    );
  }
}
