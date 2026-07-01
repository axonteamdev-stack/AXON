import 'package:Axon/features/patient/axon_ai/presentation/manager/axon_ai_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../data/models/check_interaction_request.dart';
import '../../domain/usecases/check_interaction_use_case.dart';

@injectable
class AxonAiCubit
    extends Cubit<AxonAiState> {
  final CheckInteractionUseCase useCase;

  AxonAiCubit(
    this.useCase,
  ) : super(AxonAiInitial());

  Future<void> checkInteraction(
    String drug1,
    String drug2,
  ) async {
    emit(AxonAiLoading());

    try {
      final result = await useCase(
        CheckInteractionRequest(
          drugs: [
            drug1,
            drug2,
          ],
        ),
      );

      emit(
        AxonAiSuccess(result),
      );
    } catch (e) {
      emit(
        AxonAiError(
          e.toString(),
        ),
      );
    }
  }
}