import 'dart:io';

import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';

class UploadMedicalLicenseBox extends StatelessWidget {
  const UploadMedicalLicenseBox({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // ✅ هنا الحل
        context
            .read<DoctorRegistrationCubit>()
            .pickImage(ImageType.license);
      },
      child: BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
        builder: (context, state) {
          File? file;

          // ✅ نجيب الملف من state
          if (state is DoctorRegistrationInitial) {
            file = state.licenseFile as File?;
          }

          return Container(
            height: 120.h,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Center(
              child: file == null
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
                          context.l10n.drag_upload,
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      ],
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.check_circle,
                          color: Colors.green,
                          size: 32,
                        ),
                        SizedBox(height: 10.h),
                        Text(
                          file.path,
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