import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';

abstract class HomeState {}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeSuccess extends HomeState {
  final GetAllArticlesEntity? articlesEntity;

  HomeSuccess({this.articlesEntity});
}

class HomeError extends HomeState {
  final Failure failure;

  HomeError({required this.failure});
}