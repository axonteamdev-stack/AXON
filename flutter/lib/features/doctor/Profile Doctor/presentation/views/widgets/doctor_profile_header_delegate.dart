import 'package:flutter/material.dart';

class DoctorProfileHeaderDelegate
    extends SliverPersistentHeaderDelegate {
  final Widget child;

  DoctorProfileHeaderDelegate({required this.child});

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return child;
  }

  @override
  double get maxExtent => 200;

  @override
  double get minExtent => 200;

  @override
  bool shouldRebuild(_) => false;
}
