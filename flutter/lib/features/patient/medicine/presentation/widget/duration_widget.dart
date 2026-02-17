import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/duration_cubit/duration_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/duration_cubit/duration_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

class DurationWidget extends StatelessWidget {
  const DurationWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DurationCubit(),
      child: BlocBuilder<DurationCubit, DurationState>(
        builder: (context, state) {
          final cubit = context.read<DurationCubit>();
          final formatter = DateFormat('dd MMM yyyy');

          Future<void> pickStartDate() async {
            final date = await showDatePicker(
              context: context,
              initialDate: state.startDate,
              firstDate: DateTime(2000),
              lastDate: state.endDate ?? DateTime(2100),
            );

            if (date != null) {
              cubit.setStartDate(date);
            }
          }

          Future<void> pickEndDate() async {
            final safeInitialDate =
                state.endDate != null &&
                        state.endDate!.isAfter(state.startDate)
                    ? state.endDate!
                    : state.startDate;

            final date = await showDatePicker(
              context: context,
              initialDate: safeInitialDate,
              firstDate: state.startDate,
              lastDate: DateTime(2100),
            );

            if (date != null) {
              cubit.setEndDate(date);
            }
          }

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  /// START DATE
                  Expanded(
                    child: GestureDetector(
                      onTap: pickStartDate,
                      child: _dateBox(
                        title: context.l10n.start_date,
                        value:
                            formatter.format(state.startDate),
                        hasError: state.error != null,
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  /// END DATE
                  Expanded(
                    child: GestureDetector(
                      onTap: pickEndDate,
                      child: _dateBox(
                        title: context.l10n.end_date,
                        value: state.endDate != null
                            ? formatter
                                .format(state.endDate!)
                            : context.l10n.tap_to_select,
                        hasError: state.error != null,
                      ),
                    ),
                  ),
                ],
              ),

              /// ERROR
              if (state.error != null) ...[
                const SizedBox(height: 8),
                Text(
                  state.error!,
                  style: const TextStyle(
                    color: Colors.red,
                    fontSize: 12,
                  ),
                ),
              ],
            ],
          );
        },
      ),
    );
  }

  Widget _dateBox({
    required String title,
    required String value,
    required bool hasError,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: hasError ? Colors.red : Colors.grey.shade300,
        ),
      ),
      child: Column(
        children: [
          TextApp(
            text: title,
            color: AppColors.primaryColor,
            fontSize: 12,
            weight: AppTextWeight.bold,
          ),
          const SizedBox(height: 8),
          TextApp(
            text: value,
            color: AppColors.black,
            fontSize: 13,
            weight: AppTextWeight.bold,
          ),
        ],
      ),
    );
  }
}
