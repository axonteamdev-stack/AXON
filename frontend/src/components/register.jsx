import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as authApi from '../api/auth';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Shield,
  FileText,
  LogIn,
  ArrowLeft,
  Stethoscope,
  Ruler,
  Scale,
  Info,
  Activity,
  FlaskConical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',

    // Step 2: Account Security
    password: '',
    confirmPassword: '',

    // Step 3: Health Profile (Optional)
    bloodType: '',
    height: '',
    weight: '',
    allergiesInput: '', // changed from allergies for clarity
    medicalConditions: '',
    conditions: [],
    currentCondition: '',
    allergies: [],
    currentAllergy: '',
    radiologyTests: [{ id: Date.now(), type: '', file: null, preview: null }],
    labTests: [{ id: Date.now(), type: '', file: null, preview: null }],
    emergencyContact: '',

    // Terms
    acceptTerms: false,
    acceptPrivacy: false,
    subscribeNewsletter: true,

    // Step 2 & 3: Role & Doctor Info
    role: 'patient',
    specialization: '',
    experience: '',
    licenseNumber: '',
    licenseFile: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);




  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateEgyptianPhone = (phone) => {
    if (!phone) return false;
    const cleanedPhone = phone.replace(/[^\d+]/g, '');
    const localPattern = /^(010|011|012|015)\d{8}$/;
    const internationalPattern = /^\+20(10|11|12|15)\d{8}$/;
    return localPattern.test(cleanedPhone) || internationalPattern.test(cleanedPhone);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const formatPhoneToInternational = (phone) => {
    if (!phone) return '';
    const cleanedPhone = phone.replace(/[^\d+]/g, '');

    if (cleanedPhone.startsWith('01') && cleanedPhone.length === 10) {
      return `+20${cleanedPhone.substring(1)}`;
    }

    if (cleanedPhone.startsWith('+20') && cleanedPhone.length === 13) {
      return cleanedPhone;
    }

    return cleanedPhone;
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = t('register.firstNameRequired', 'Full name is required');
        if (!formData.email.trim()) newErrors.email = t('register.emailRequired', 'Email is required');
        else if (!validateEmail(formData.email)) newErrors.email = t('register.emailInvalid', 'Invalid email format');
        if (!formData.phone.trim()) newErrors.phone = t('register.phoneRequired', 'Phone number is required');
        else if (!validateEgyptianPhone(formData.phone)) {
          newErrors.phone = t('register.phoneInvalid', 'Invalid Egyptian phone number');
        }
        if (!formData.gender) newErrors.gender = t('register.genderRequired', 'Gender is required');
        if (!formData.password) newErrors.password = t('register.passwordRequired', 'Password is required');
        else if (!validatePassword(formData.password)) newErrors.password = t('register.passwordInvalid', 'Password must be at least 8 characters with uppercase, lowercase, and a number');
        if (!formData.confirmPassword) newErrors.confirmPassword = t('register.confirmPasswordRequired', 'Please confirm your password');
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('register.passwordsDontMatch', 'Passwords do not match');
        if (!formData.acceptTerms) newErrors.acceptTerms = t('register.termsRequired', 'You must accept the terms to continue');
        break;

      case 2:
        if (!formData.password) newErrors.password = t('register.passwordRequired', 'Password is required');
        else if (!validatePassword(formData.password)) newErrors.password = t('register.passwordInvalid', 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number');
        if (!formData.confirmPassword) newErrors.confirmPassword = t('register.confirmPasswordRequired', 'Please confirm your password');
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('register.passwordsDontMatch', 'Passwords do not match');
        break;

      case 3:
        if (formData.role === 'doctor') {
          if (!formData.specialization) newErrors.specialization = t('register.specializationRequired', 'Specialization is required');
          if (!formData.experience) newErrors.experience = t('register.experienceRequired', 'Years of experience is required');
          if (!formData.licenseNumber) newErrors.licenseNumber = t('register.licenseRequired', 'License number is required');
        } else {
          // Patient Medical Profile validation (already mostly optional)
        }
        break;

      case 4:
        if (formData.role === 'patient') {
          // Health conditions are optional
        }
        break;

      case 5:
        if (formData.role === 'patient') {
          // Allergies are optional
        }
        break;

      case 6:
        if (formData.role === 'patient') {
          // Radiology items are optional
        }
        break;

      case 7:
        if (formData.role === 'patient') {
          // Lab tests are optional
        }
        break;
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate current step
    const stepErrors = validateStep(step);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // If not on last step, go to next step
    if (step === 3 && formData.role === 'patient') {
      setStep(4);
      return;
    }
    
    if (step === 4 && formData.role === 'patient') {
      // Commit pending health condition
      if (formData.currentCondition.trim()) {
        setFormData(prev => ({
          ...prev,
          conditions: [...prev.conditions, prev.currentCondition.trim()],
          currentCondition: ''
        }));
      }
      setStep(5);
      return;
    }

    if (step === 5 && formData.role === 'patient') {
      // Commit pending allergy
      if (formData.currentAllergy.trim()) {
        setFormData(prev => ({
          ...prev,
          allergies: [...prev.allergies, prev.currentAllergy.trim()],
          currentAllergy: ''
        }));
      }
      setStep(6);
      return;
    }

    if (step === 6 && formData.role === 'patient') {
      setStep(7);
      return;
    }

    if (step < 3 || (step < 7 && formData.role === 'patient')) {
      if (step < 3) {
        setStep(step + 1);
      }
      return;
    }

    // Final step - process registration
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formattedPhone = formatPhoneToInternational(formData.phone);
      const gender = formData.gender === 'male' ? 'Male' : 'Female';

      let response;

      if (formData.role === 'doctor') {
        const fd = new FormData();
        fd.append('fullName', formData.firstName);
        fd.append('email', formData.email);
        fd.append('phoneNumber', formattedPhone);
        fd.append('gender', gender);
        fd.append('password', formData.password);
        fd.append('specialization', formData.specialization);
        fd.append('medicalLicenseNumber', formData.licenseNumber);
        fd.append('yearsExperience', formData.experience);
        if (formData.licenseFile) fd.append('licenseImage', formData.licenseFile);
        if (formData.profileImage) fd.append('personalPhoto', formData.profileImage);
        response = await authApi.signupDoctor(fd);
      } else {
        response = await authApi.signupPatient({
          fullName: formData.firstName,
          email: formData.email,
          phoneNumber: formattedPhone,
          gender,
          password: formData.password,
          preferredLanguage: (i18n.language || 'en').startsWith('ar') ? 'ar' : 'en',
        });
      }

      if (response.data?.tokens) {
        const { tokens, user } = response.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('token', tokens.accessToken);

        const userData = {
          id: user.id || user._id,
          name: user.fullName || user.name,
          email: user.email,
          role: user.role,
          avatar: user.personalPhoto || user.avatar || '/assets/default-avatar.png',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new Event('storage'));
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(
        error.response?.data?.message ||
          t('register.registrationError', 'Registration failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let formattedValue = value;

    // Format phone number as user types
    if (name === 'phone') {
      formattedValue = value.replace(/[^\d+]/g, '');

      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 11) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      // Clear general error message
      if (errorMessage) {
        setErrorMessage('');
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear general error message
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const addHealthCondition = () => {
    if (formData.currentCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, prev.currentCondition.trim()],
        currentCondition: ''
      }));
    }
  };

  const removeHealthCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (formData.currentAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, prev.currentAllergy.trim()],
        currentAllergy: ''
      }));
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addRadiologyItem = () => {
    setFormData(prev => ({
      ...prev,
      radiologyTests: [...prev.radiologyTests, { id: Date.now(), type: '', file: null, preview: null }]
    }));
  };

  const removeRadiologyItem = (id) => {
    setFormData(prev => ({
      ...prev,
      radiologyTests: prev.radiologyTests.filter(item => item.id !== id)
    }));
  };

  const handleRadiologyChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      radiologyTests: prev.radiologyTests.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRadiologyFileChange = (id, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(t('register.imageTooLarge', 'Image size should be less than 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          radiologyTests: prev.radiologyTests.map(item =>
            item.id === id ? { ...item, file: file, preview: reader.result } : item
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addLabTestItem = () => {
    setFormData(prev => ({
      ...prev,
      labTests: [...prev.labTests, { id: Date.now(), type: '', file: null, preview: null }]
    }));
  };

  const removeLabTestItem = (id) => {
    setFormData(prev => ({
      ...prev,
      labTests: prev.labTests.filter(item => item.id !== id)
    }));
  };

  const handleLabTestChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      labTests: prev.labTests.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleLabTestFileChange = (id, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(t('register.imageTooLarge', 'Image size should be less than 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          labTests: prev.labTests.map(item =>
            item.id === id ? { ...item, file: file, preview: reader.result } : item
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = [
      t('register.passwordVeryWeak', 'Very Weak'),
      t('register.passwordWeak', 'Weak'),
      t('register.passwordFair', 'Fair'),
      t('register.passwordGood', 'Good'),
      t('register.passwordStrong', 'Strong'),
      t('register.passwordVeryStrong', 'Very Strong')
    ];
    return { score, label: labels[score] || '' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Sample Egyptian numbers for hint
  const sampleNumbers = ['01012345678', '01123456789', '01234567890', '01567891234'];

  const fileInputRef = React.useRef(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(t('register.imageTooLarge', 'Image size should be less than 5MB'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-4 pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Form Card */}
        <div className="bg-white rounded-[3.5rem] shadow-xl p-8 pb-10 border border-slate-100">


          {/* Error/Success Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.fullName', 'Full Name')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.firstName ? 'border-red-500' : 'border-slate-200'
                        } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-slate-600 placeholder-slate-300 text-sm`}
                      placeholder={t('register.fullNamePlaceholder', 'Enter your full name')}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.email', 'Email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'
                        } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-slate-600 placeholder-slate-300 text-sm`}
                      placeholder={t('register.emailPlaceholder', 'Enter your email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.phone', 'Phone Number')}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'
                        } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-slate-600 placeholder-slate-300 text-sm`}
                      placeholder={t('register.phonePlaceholder', 'Enter your phone number')}
                      maxLength={13}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>
                  )}
                </div>

                {/* Gender Section */}
                <div className="space-y-2">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.gender', 'Gender')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}
                      className={`py-3.5 px-4 rounded-xl border transition-all duration-200 text-sm font-medium ${formData.gender === 'male'
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                        }`}
                    >
                      {t('register.male', 'Male')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}
                      className={`py-3.5 px-4 rounded-xl border transition-all duration-200 text-sm font-medium ${formData.gender === 'female'
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                        }`}
                    >
                      {t('register.female', 'Female')}
                    </button>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.gender}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.password', 'Password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'
                        } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-slate-600 placeholder-slate-300 text-sm`}
                      placeholder={t('register.passwordPlaceholder', 'Create a strong password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
                  )}

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="space-y-1.5 px-1 pt-1">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength.score >= level
                                ? passwordStrength.score <= 1 ? 'bg-red-500'
                                  : passwordStrength.score === 2 ? 'bg-orange-400'
                                  : passwordStrength.score === 3 ? 'bg-yellow-400'
                                  : passwordStrength.score === 4 ? 'bg-blue-500'
                                  : 'bg-green-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${
                        passwordStrength.score <= 1 ? 'text-red-500'
                        : passwordStrength.score === 2 ? 'text-orange-400'
                        : passwordStrength.score === 3 ? 'text-yellow-500'
                        : passwordStrength.score === 4 ? 'text-blue-500'
                        : 'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.8rem] font-bold text-slate-700 ml-1">
                    {t('register.confirmPassword', 'Confirm Password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                        } rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-slate-600 placeholder-slate-300 text-sm`}
                      placeholder={t('register.confirmPasswordPlaceholder', 'Re-enter your password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Privacy */}
                <div className="flex items-start gap-4 pt-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="acceptTerms" className="text-[0.7rem] text-slate-600 leading-relaxed cursor-pointer select-none">
                    {t('register.termsAndPrivacyText', 'I agree to the meddiodoc Terms of Service and Privacy Policy')}
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs ml-1">{errors.acceptTerms}</p>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003B73] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {t('register.next', 'Next')}
                      </>
                    )}
                  </button>
                </div>
                


                {/* Footer Link */}
                <div className="text-center pt-2">
                  <p className="text-slate-500 text-sm">
                    {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      {t('register.loginLink', 'Login')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Center Logo */}
                <div className="flex justify-center mb-8">
                  <img src="/assets/logo.png" alt="Axon Logo" className="h-56 w-auto" />
                </div>

                <div className="space-y-4">
                  {/* Patient Option */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                    className={`w-full p-6 bg-white border-2 rounded-[2.5rem] shadow-sm flex items-center justify-between transition-all duration-200 group ${formData.role === 'patient'
                      ? 'border-[#003B73] ring-1 ring-[#003B73]'
                      : 'border-slate-50 hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <User size={30} className="text-slate-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-lg">I'm a Patient</h4>
                        <p className="text-slate-500 text-sm">Find doctors and book appointments</p>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${formData.role === 'patient'
                      ? 'bg-[#003B73] border-[#003B73]'
                      : 'border-slate-300'
                      }`}>
                      {formData.role === 'patient' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                  </button>

                  {/* Doctor Option */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                    className={`w-full p-6 bg-white border-2 rounded-[2.5rem] shadow-sm flex items-center justify-between transition-all duration-200 group ${formData.role === 'doctor'
                      ? 'border-[#003B73] ring-1 ring-[#003B73]'
                      : 'border-slate-50 hover:border-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Stethoscope size={30} className="text-slate-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-lg">I'm a Doctor</h4>
                        <p className="text-slate-500 text-sm">Manage patients and consultations</p>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${formData.role === 'doctor'
                      ? 'bg-[#003B73] border-[#003B73]'
                      : 'border-slate-300'
                      }`}>
                      {formData.role === 'doctor' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                  </button>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={() => formData.role && setStep(3)}
                    disabled={!formData.role}
                    className="w-full bg-[#003B73] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="mt-4 text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-2 w-full"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Registration depending on role */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {formData.role === 'doctor' ? (
                  /* Doctor Registration UI */
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope size={32} className="text-[#003B73]" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Doctor Registration</h3>
                      <p className="text-sm text-slate-500">Create your professional account</p>
                    </div>

                    {/* Specialization */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">Specialization</label>
                      <div className="relative">
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-slate-50 border ${errors.specialization ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-primary appearance-none text-sm text-slate-600`}
                        >
                          <option value="">Select Specialization</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Neurology">Neurology</option>
                          <option value="General">General Practice</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">Years of Experience</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.experience ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm`}
                        placeholder="Enter number years of experience"
                      />
                      {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                    </div>

                    {/* License Number */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">Medical License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.licenseNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm`}
                        placeholder="ML-123456"
                      />
                      {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                    </div>

                    {/* License Upload */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">Upload Medical License</label>
                      <div
                        onClick={() => document.getElementById('licenseUpload').click()}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600">Drag or Click to upload attachment</p>
                        <p className="text-xs text-slate-400">Max File size: 2mb</p>
                        <input
                          id="licenseUpload"
                          type="file"
                          className="hidden"
                          onChange={(e) => setFormData(prev => ({ ...prev, licenseFile: e.target.files[0] }))}
                        />
                        {formData.licenseFile && (
                          <p className="text-xs text-primary mt-2 flex items-center gap-1 font-medium">
                            <CheckCircle size={14} /> {formData.licenseFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#003B73] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          "Submit for Verification"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Patient Registration UI (Medical Profile) */
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center pt-2">
                       <div className="w-20 h-20 bg-[#EBF5FF] rounded-full flex items-center justify-center mb-4">
                          <Activity size={40} className="text-[#003B73]" />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-1">Medical Profile</h3>
                       <p className="text-slate-500 text-sm mb-6 text-center px-4">
                        Help us understand your health better
                       </p>
                    </div>

                    <div className="space-y-4">
                      {/* Blood Type */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-600 ml-1">
                          Blood Type
                        </label>
                        <div className="relative">
                          <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary appearance-none text-slate-600 text-base"
                          >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Height */}
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-600 ml-1">
                            Height (cm)
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <Ruler size={18} />
                            </div>
                            <input
                              type="number"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-base"
                              placeholder="170"
                            />
                          </div>
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-slate-600 ml-1">
                            Weight (kg)
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                              <Scale size={18} />
                            </div>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-base"
                              placeholder="62.5"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="bg-[#EBF5FF] border border-[#BEE3F8] rounded-2xl p-4 flex items-start gap-3 mt-2">
                        <Info size={20} className="text-[#3182CE] shrink-0 mt-0.5" />
                        <p className="text-[#2B6CB0] text-xs leading-relaxed font-medium">
                          Your medical information helps doctors provide better care.
                        </p>
                      </div>
                    </div>

                    <div className="pt-8">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#003B73] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          "Next"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>

                  <p className="text-slate-500 text-sm mt-4">
                    {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Step 4: Health Conditions (Patient only) */}
            {step === 4 && formData.role === 'patient' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-20 h-20 bg-[#EBF5FF] rounded-full flex items-center justify-center mb-4">
                    <Activity size={40} className="text-[#003B73]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {t('register.healthConditionsTitle', 'Health Conditions')}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 text-center px-4">
                    {t('register.healthConditionsSubtitle', 'Add your health conditions')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="currentCondition"
                      value={formData.currentCondition}
                      onChange={handleChange}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHealthCondition())}
                      className={`w-full ${isRtl ? 'pl-14 pr-5' : 'pr-14 pl-5'} py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-base`}
                      placeholder={t('register.enterConditionPlaceholder', 'Enter condition name')}
                    />
                      <button
                        type="button"
                        onClick={addHealthCondition}
                        className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-10 h-10 bg-[#003B73] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#002D58] transition-all`}
                      >
                      <UserPlus size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.conditions.map((condition, index) => (
                      <div
                        key={index}
                        className="bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {condition}
                        <button
                          type="button"
                          onClick={() => removeHealthCondition(index)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003B73] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('register.next', 'Next')
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Allergies (Patient only) */}
            {step === 5 && formData.role === 'patient' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-20 h-20 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={40} className="text-[#E53E3E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {t('register.allergiesTitle', 'Allergies')}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 text-center px-4">
                    {t('register.allergiesSubtitle', 'Add your allergies')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="currentAllergy"
                      value={formData.currentAllergy}
                      onChange={handleChange}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                      className={`w-full ${isRtl ? 'pl-14 pr-5' : 'pr-14 pl-5'} py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-base`}
                      placeholder={t('register.enterAllergyPlaceholder', 'Enter allergy name')}
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-10 h-10 bg-[#003B73] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#002D58] transition-all`}
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(index)}
                          className="hover:text-red-700 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003B73] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('register.next', 'Next')
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Radiology (Patient only) */}
            {step === 6 && formData.role === 'patient' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-20 h-20 bg-[#EBF5FF] rounded-full flex items-center justify-center mb-4">
                    <Activity size={40} className="text-[#003B73]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {t('register.radiologyTitle', 'Radiology')}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 text-center px-4">
                    {t('register.radiologySubtitle', 'Upload your radiology images')}
                  </p>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.radiologyTests.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 relative shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-700">{t('register.description', 'Description')}</span>
                        <button
                          type="button"
                          onClick={() => removeRadiologyItem(item.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-xs font-medium"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                          {t('common.remove', 'Remove')}
                        </button>
                      </div>

                      <div
                        onClick={() => document.getElementById(`radiology-upload-${item.id}`).click()}
                        className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all bg-slate-50/50"
                      >
                        {item.preview ? (
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                            <img src={item.preview} alt="Radiology Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <UserPlus size={24} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-500">{t('register.uploadImage', 'Upload Image')}</p>
                          </>
                        )}
                        <input
                          id={`radiology-upload-${item.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleRadiologyFileChange(item.id, e.target.files[0])}
                        />
                      </div>

                      <input
                        type="text"
                        value={item.type}
                        onChange={(e) => handleRadiologyChange(item.id, 'type', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-sm"
                        placeholder={t('register.scanTypePlaceholder', 'Enter the type of medical scan')}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={addRadiologyItem}
                    className="w-14 h-14 bg-[#003B73] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#002D58] transition-all active:scale-95"
                  >
                    <UserPlus size={28} />
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003B73] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('register.next', 'Next')
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Lab Tests (Patient only) */}
            {step === 7 && formData.role === 'patient' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="w-20 h-20 bg-[#EBF5FF] rounded-full flex items-center justify-center mb-4">
                    <FlaskConical size={40} className="text-[#003B73]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {t('register.labTestsTitle', 'Lab Tests')}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 text-center px-4">
                    {t('register.labTestsSubtitle', 'Upload your medical lab tests')}
                  </p>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.labTests.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 relative shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-700">{t('register.description', 'Description')}</span>
                        <button
                          type="button"
                          onClick={() => removeLabTestItem(item.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-xs font-medium"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                          {t('common.remove', 'Remove')}
                        </button>
                      </div>

                      <div
                        onClick={() => document.getElementById(`labtest-upload-${item.id}`).click()}
                        className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all bg-slate-50/50"
                      >
                        {item.preview ? (
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                            <img src={item.preview} alt="Lab Test Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <UserPlus size={24} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-500">{t('register.uploadImage', 'Upload Image')}</p>
                          </>
                        )}
                        <input
                          id={`labtest-upload-${item.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLabTestFileChange(item.id, e.target.files[0])}
                        />
                      </div>

                      <input
                        type="text"
                        value={item.type}
                        onChange={(e) => handleLabTestChange(item.id, 'type', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-1 focus:ring-primary text-slate-600 text-sm"
                        placeholder={t('register.labTestTypePlaceholder', 'Enter the type of medical lab test')}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={addLabTestItem}
                    className="w-14 h-14 bg-[#003B73] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#002D58] transition-all active:scale-95"
                  >
                    <UserPlus size={28} />
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003B73] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#002D58] transition-all shadow-lg active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      t('register.finish', 'Finish')
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium py-2"
                  >
                    <ArrowLeft size={18} />
                    {t('register.back', 'Back')}
                  </button>
                </div>
              </motion.div>
            )}

          </form>
        </div>
      </motion.div>

      {/* Success Screen Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-[#DCE6F2] rounded-full flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-[#003B73] rounded-full flex items-center justify-center text-white">
                    <CheckCircle size={40} />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {t('register.accountCreatedSuccessfully', 'Account Created Successfully 🥳')}
                </h2>
                <p className="text-slate-500 font-medium">
                  {t('register.redirectingToHome', 'Welcome! Redirecting to home...')}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
