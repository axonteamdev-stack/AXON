import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/medicine_list__view_widget.dart';
import 'package:flutter/material.dart';

class ViewAllMedicine extends StatelessWidget {
  const ViewAllMedicine({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Column(
        children: [
          CustomAppBar(
            title: "All Medicine",
            trailing: Row(
              children: [
                IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.search, color: AppColors.white),
                ),
                IconButton(
                  onPressed: () {},
                  icon: Icon(
                    Icons.calendar_month_outlined,
                    color: AppColors.white,
                  ),
                ),
              ],
            ),
          ),
          Expanded(child: MedicineList()),
        ],
      ),
    );
  }
}
