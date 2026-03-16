<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor%20registration/doctor_registration_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class UploadMedicalLicenseBox extends StatelessWidget {
  const UploadMedicalLicenseBox({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.read<DoctorRegistrationCubit>().pickLicenseFile();
      },
      child: BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
        builder: (context, state) {
          return Container(
            height: 120.h,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Center(
              child: state?.uploadedFile == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.cloud_upload_outlined,
                          size: 32,
                          color: Colors.grey.shade600,
                        ),
                        SizedBox(height: 10.h),
                        Text(
<<<<<<< HEAD
                          "Drag or Click to upload attachment",
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                        Text(
                          "Max File size : 2mb",
=======
                          context.l10n.drag_upload,
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                        Text(
                          context.l10n.max_file_size,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 32),
                        SizedBox(height: 10.h),
                        Text(
<<<<<<< HEAD
                          "Uploaded: ${state.uploadedFile!.name}",
=======
                          "${context.l10n.upload_medical_license}: ${state.uploadedFile!.name}",
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
            ),
          );
        },
      ),
    );
  }
}
