import 'package:flutter/material.dart';

class OnBoardingImage extends StatelessWidget {
  final String image;

  const OnBoardingImage({super.key, required this.image});

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height * 0.40;

    return Container(
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(35),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Image.asset(
          image,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
