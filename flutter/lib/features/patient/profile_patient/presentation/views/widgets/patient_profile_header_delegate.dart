import 'package:flutter/material.dart';

class PatientProfileHeaderDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  PatientProfileHeaderDelegate({
    required this.child,
  });

  @override
  double get minExtent => 190;

  @override
  double get maxExtent => 190;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return child;
  }

  @override
  bool shouldRebuild(SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}
