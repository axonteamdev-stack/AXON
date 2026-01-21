class DoctorProfileState {
  final String name;
  final String email;
  final String profession;
  final String phone;
  final String experience;
  final String? image;
  final bool isEdit;

  const DoctorProfileState({
    required this.name,
    required this.email,
    required this.profession,
    required this.phone,
    required this.experience,
    this.image,
    this.isEdit = false,
  });

  DoctorProfileState copyWith({
    String? phone,
    String? experience,
    String? image,
    bool? isEdit,
  }) {
    return DoctorProfileState(
      name: name,
      email: email,
      profession: profession,
      phone: phone ?? this.phone,
      experience: experience ?? this.experience,
      image: image ?? this.image,
      isEdit: isEdit ?? this.isEdit,
    );
  }
}
