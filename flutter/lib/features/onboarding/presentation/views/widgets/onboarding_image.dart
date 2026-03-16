<<<<<<< HEAD
=======
import 'package:Axon/core/style/colors.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:flutter/material.dart';

class OnBoardingImage extends StatelessWidget {
  final String image;

<<<<<<< HEAD
  const OnBoardingImage({super.key, required this.image});
=======
  const OnBoardingImage({
    super.key,
    required this.image,
  });
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height * 0.40;

    return Container(
      height: height,
      decoration: BoxDecoration(
<<<<<<< HEAD
        color: const Color(0xFFF5F5F5),
=======
        color: AppColors.grey.withOpacity(0.15),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
