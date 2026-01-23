class DoctorProfileState {
  final String name;          
  final String email;         
  final String profession;    
  final String phone;         
  final String experience;   

  final String licenseNumber; 
  final String licenseImage;  
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
    this.image,
    this.isEdit = false,
  });

  DoctorProfileState copyWith({
    String? email,
    String? phone,
    String? experience,
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
      image: image ?? this.image,
      isEdit: isEdit ?? this.isEdit,
    );
  }
}
