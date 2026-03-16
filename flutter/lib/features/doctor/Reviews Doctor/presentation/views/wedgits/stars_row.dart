import 'package:flutter/material.dart';

class StarsRow extends StatelessWidget {
  final double rating;

  const StarsRow({
    super.key,
    required this.rating,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(5, (index) {
        if (index + 1 <= rating) {
          return const Icon(
            Icons.star,
            color: Colors.amber,
            size: 16,
          );
        } else if (index + 0.5 <= rating) {
          return const Icon(
            Icons.star_half,
            color: Colors.amber,
            size: 16,
          );
        } else {
          return const Icon(
            Icons.star_border,
            color: Colors.amber,
            size: 16,
          );
        }
      }),
    );
  }
}
