import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';


Failure mapExceptionToFailure(AppException exception) {
  switch (exception) {
    case OfflineException _:
      return OfflineFailure();

    case TimeoutException _:
      return TimeoutFailure();

    case BadRequestException _:
      return BadRequestFailure();

    case UnauthorizedException _:
      return UnauthorizedFailure();

    case NotFoundException _:
      return NotFoundFailure();

    case ConflictException _:
      return ExistedAccountFailure();

    case TooManyRequestsException _:
      return TooManyRequestsFailure();

    case ValidationException _:
      return WeakPasswordFailure();

    case ServerException _:
    case BadGatewayException _:
    case ServiceUnavailableException _:
    case GatewayTimeoutException _:
      return ServerFailure();

    default:
      return ServerFailure();
  }
}