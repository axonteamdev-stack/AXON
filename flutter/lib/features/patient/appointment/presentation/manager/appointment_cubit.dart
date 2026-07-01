import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/create_appointment_usecase.dart';
import '../../domain/usecases/create_setup_intent_usecase.dart';
import 'appointment_state.dart';

@injectable
class AppointmentCubit
    extends Cubit<AppointmentState> {
  AppointmentCubit(
    this.createAppointmentUseCase,
    this.createSetupIntentUseCase,
  ) : super(
          AppointmentInitial(),
        );

  final CreateAppointmentUseCase
      createAppointmentUseCase;

  final CreateSetupIntentUseCase
      createSetupIntentUseCase;

  Future<void> bookAppointment({
  required String doctorId,
  required String notes,
  required DateTime scheduledAt,
}) async {
  try {
    emit(AppointmentLoading());

    final appointment =
        await createAppointmentUseCase(
      doctorId: doctorId,
      notes: notes,
      scheduledAt: scheduledAt,
    );

    final setupIntent =
        await createSetupIntentUseCase(
      appointment.appointmentId,
    );

    await Stripe.instance
        .initPaymentSheet(
      paymentSheetParameters:
          SetupPaymentSheetParameters(
        merchantDisplayName: 'Axon',
        setupIntentClientSecret:
            setupIntent.clientSecret,
      ),
    );

    await Stripe.instance
        .presentPaymentSheet();

    emit(AppointmentSuccess());
  } catch (e) {
    emit(
      AppointmentError(
        e.toString(),
      ),
    );
  }
}
}