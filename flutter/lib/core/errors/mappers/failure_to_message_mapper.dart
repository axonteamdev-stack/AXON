import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/strings/failures_strings.dart';

String mapFailureToMessage(Failure failure) {
  switch (failure) {
    case OfflineFailure _:
      return OFFLINE_FAILURE_MESSAGE;

    case TimeoutFailure _:
      return SERVER_FAILURE_MESSAGE;

    case TooManyRequestsFailure _:
      return TOO_MANY_REQUESTS_FAILURE_MESSAGE;

    case WrongPasswordFailure _:
      return WRONG_PASSWORD_FAILURE_MESSAGE;

    case NoUserFailure _:
      return NO_USER_FAILURE_MESSAGE;

    case ExistedAccountFailure _:
      return EXISTED_ACCOUNT_FAILURE_MESSAGE;

    case WeakPasswordFailure _:
      return WEEK_PASS_FAILURE_MESSAGE;

    case UnmatchedPassFailure _:
      return UNMATCHED_PASSWORD_FAILURE_MESSAGE;

    default:
      return SERVER_FAILURE_MESSAGE;
  }
}