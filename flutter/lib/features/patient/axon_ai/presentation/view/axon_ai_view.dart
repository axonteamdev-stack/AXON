import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/axon_ai/presentation/manager/axon_ai_cubit.dart';
import 'package:Axon/features/patient/axon_ai/presentation/manager/axon_ai_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AxonAiView extends StatefulWidget {
  const AxonAiView({super.key});

  @override
  State<AxonAiView> createState() => _AxonAiViewState();
}

class _AxonAiViewState extends State<AxonAiView> {
  final TextEditingController firstDrugController = TextEditingController();

  final TextEditingController secondDrugController = TextEditingController();

  @override
  void dispose() {
    firstDrugController.dispose();
    secondDrugController.dispose();
    super.dispose();
  }

  void _showResultSheet(BuildContext context, AxonAiSuccess state) {
    final result = state.result;

    Color color;
    IconData icon;
    String title;

    switch (result.riskLevel.toLowerCase()) {
      case 'high':
        color = Colors.red;
        icon = Icons.close_rounded;
        title = 'High Interaction';
        break;

      case 'moderate':
        color = Colors.orange;
        icon = Icons.warning_rounded;
        title = 'Moderate Interaction';
        break;

      case 'low':
        color = Colors.amber;
        icon = Icons.info_outline_rounded;
        title = 'Low Interaction';
        break;

      default:
        color = AppColors.green;
        icon = Icons.check_rounded;
        title = 'No Known Interaction';
    }

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      builder: (_) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 50,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(20),
                ),
              ),

              const SizedBox(height: 30),

              AnimatedContainer(
                duration: const Duration(milliseconds: 400),
                width: 120,
                height: 120,
                decoration: BoxDecoration(shape: BoxShape.circle, color: color),
                child: Icon(icon, color: Colors.white, size: 65),
              ),

              const SizedBox(height: 25),

              Text(
                title,
                style: TextStyle(
                  color: color,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              Text(
                'Risk Level : ${result.riskLevel.toUpperCase()}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 15),

              Text(
                result.recommendation,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.grey, fontSize: 15),
              ),

              const SizedBox(height: 20),

              Text(
                'Confidence : ${(result.confidence * 100).toStringAsFixed(2)} %',
                style: const TextStyle(color: AppColors.grey, fontSize: 15),
              ),

              const SizedBox(height: 30),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Got it',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),

              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AxonAiCubit, AxonAiState>(
      listener: (context, state) {
        if (state is AxonAiSuccess) {
          _showResultSheet(context, state);
        }

        if (state is AxonAiError) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.message)));
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.lightGrey,
        body: Column(
          children: [
            const CustomAppBar(title: "Axon AI"),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 30,
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.psychology_alt_rounded,
                      size: 80,
                      color: AppColors.primaryColor,
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      "Drug Interaction Checker",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    const Text(
                      "Enter two medications and let Axon AI check if they interact.",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.grey),
                    ),

                    const SizedBox(height: 40),

                    TextField(
                      controller: firstDrugController,
                      decoration: InputDecoration(
                        hintText: "First Medication",
                        prefixIcon: const Icon(Icons.medication_outlined),
                        filled: true,
                        fillColor: AppColors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    TextField(
                      controller: secondDrugController,
                      decoration: InputDecoration(
                        hintText: "Second Medication",
                        prefixIcon: const Icon(Icons.medication_outlined),
                        filled: true,
                        fillColor: AppColors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),

                    BlocBuilder<AxonAiCubit, AxonAiState>(
                      builder: (context, state) {
                        return SizedBox(
                          width: double.infinity,
                          height: 55,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            onPressed: state is AxonAiLoading
                                ? null
                                : () {
                                    context
                                        .read<AxonAiCubit>()
                                        .checkInteraction(
                                          firstDrugController.text.trim(),
                                          secondDrugController.text.trim(),
                                        );
                                  },
                            child: state is AxonAiLoading
                                ? const CircularProgressIndicator(
                                    color: Colors.white,
                                  )
                                : const Text(
                                    "Check Interaction",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
