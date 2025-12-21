import 'package:Axon/features/home/data/models/home_model.dart';

abstract class HomeState {}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeSuccess extends HomeState {
  final HomeModel model;

  HomeSuccess(this.model);
}
