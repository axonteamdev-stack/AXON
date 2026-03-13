import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  @override
  List<Object?> get props => [];
}

/// Network
class OfflineFailure extends Failure {}
class TimeoutFailure extends Failure {}

/// Server
class ServerFailure extends Failure {}
class UnauthorizedFailure extends Failure {}
class NotFoundFailure extends Failure {}
class BadRequestFailure extends Failure {}
class TooManyRequestsFailure extends Failure {}

/// App / Business
class WeakPasswordFailure extends Failure {}
class ExistedAccountFailure extends Failure {}
class NoUserFailure extends Failure {}
class WrongPasswordFailure extends Failure {}
class UnmatchedPassFailure extends Failure {}
class NotLoggedInFailure extends Failure {}
class EmailNotVerifiedFailure extends Failure {}