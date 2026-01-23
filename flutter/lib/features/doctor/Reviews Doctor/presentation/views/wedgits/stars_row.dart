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
        return Icon(
          index < rating.floor()
              ? Icons.star
              : Icons.star_border,
          color: Colors.amber,
          size: 16,
        );
      }),
    );
  }
}
