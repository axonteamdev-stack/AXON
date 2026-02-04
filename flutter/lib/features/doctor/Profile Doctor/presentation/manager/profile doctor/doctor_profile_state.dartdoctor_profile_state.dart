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
  });

  DoctorProfileState copyWith({
    String? email,
    String? phone,
    String? experience,
    String? about,
    String? price,
    String? image,
    bool? isEdit,
  }) {
    return DoctorProfileState(
      name: name,
      email: email ?? this.email,
      profession: profession,
      phone: phone ?? this.phone,
      experience: experience ?? this.experience,
      licenseNumber: licenseNumber,
      licenseImage: licenseImage,
      about: about ?? this.about,
      price: price ?? this.price,
      image: image ?? this.image,
      isEdit: isEdit ?? this.isEdit,
    );
  }
}
