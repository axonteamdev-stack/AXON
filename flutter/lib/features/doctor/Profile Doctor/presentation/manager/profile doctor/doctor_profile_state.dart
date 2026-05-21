class DoctorProfileState {

  final String name;

  final String email;

  final String profession;

  final String phone;

  final String experience;

  final String licenseNumber;

  final String licenseImage;

  final String about;

  final String price;

  final String? image;

  final bool isEdit;

  final bool isLoading;

  final String? errorMessage;

  const DoctorProfileState({

    required this.name,

    required this.email,

    required this.profession,

    required this.phone,

    required this.experience,

    required this.licenseNumber,

    required this.licenseImage,

    required this.about,

    required this.price,

    this.image,

    this.isEdit = false,

    this.isLoading = false,

    this.errorMessage,
  });

  DoctorProfileState copyWith({

    String? name,

    String? email,

    String? profession,

    String? phone,

    String? experience,

    String? licenseNumber,

    String? licenseImage,

    String? about,

    String? price,

    String? image,

    bool? isEdit,

    bool? isLoading,

    String? errorMessage,
  }) {

    return DoctorProfileState(

      name:
          name ?? this.name,

      email:
          email ?? this.email,

      profession:
          profession ??
              this.profession,

      phone:
          phone ?? this.phone,

      experience:
          experience ??
              this.experience,

      licenseNumber:
          licenseNumber ??
              this.licenseNumber,

      licenseImage:
          licenseImage ??
              this.licenseImage,

      about:
          about ?? this.about,

      price:
          price ?? this.price,

      image:
          image ?? this.image,

      isEdit:
          isEdit ?? this.isEdit,

      isLoading:
          isLoading ??
              this.isLoading,

      errorMessage:
          errorMessage ??
              this.errorMessage,
    );
  }
}