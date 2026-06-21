import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Key,
  Smartphone,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as authApi from '../api/auth';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);


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

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      if (!formData.email.trim()) newErrors.email = t('login.emailRequired');
      else if (!validateEmail(formData.email)) newErrors.email = t('login.emailInvalid');
    } else {
      if (!formData.phone.trim()) newErrors.phone = t('login.phoneRequired');
      else if (!validateEgyptianPhone(formData.phone)) {
        newErrors.phone = t('login.phoneInvalid');
      }
    }

    if (!formData.password) {
      newErrors.password = t('login.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.passwordLength');
    }

    return newErrors;
  };

  const formatPhoneToInternational = (phone) => {
    if (!phone) return '';
    const cleanedPhone = phone.replace(/[^\d+]/g, '');

    if (cleanedPhone.startsWith('01') && cleanedPhone.length === 11) {
      return `+20${cleanedPhone.substring(1)}`;
    }

    if (cleanedPhone.startsWith('+20') && cleanedPhone.length === 13) {
      return cleanedPhone;
    }

    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authApi.login(formData.email, formData.password);
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
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        t('login.invalidCredentials', 'Invalid email or password');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = value.replace(/[^\d+]/g, '');

      if (formattedValue.startsWith('01') && formattedValue.length <= 11) {
        formattedValue = formattedValue.substring(0, 11);
      } else if (formattedValue.startsWith('+201') && formattedValue.length <= 13) {
        formattedValue = formattedValue.substring(0, 13);
      } else if (formattedValue.startsWith('+20') && formattedValue.length > 3) {
        formattedValue = `+20${formattedValue.substring(3).replace(/\D/g, '').substring(0, 10)}`;
      } else if (!formattedValue.startsWith('+') && formattedValue.length > 0) {
        if (formattedValue.startsWith('0')) {
          formattedValue = formattedValue.substring(0, 11);
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      setErrors({ email: t('login.emailRequired', 'Email is required') });
      return;
    }

    if (!validateEmail(resetEmail)) {
      setErrors({ email: t('login.emailInvalid', 'Invalid email format') });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(resetEmail);
      setResetSuccess(true);
      setResetEmail('');

      setTimeout(() => {
        setResetSuccess(false);
        setShowForgotPassword(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || t('login.resetError', 'Failed to send reset link')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-0"
      >
        {/* Logo */}
        <div className="text-center pt-2 relative top-8">
          <img
            src="/assets/logo.png"
            alt="Axon Logo"
            className="h-72 w-auto mx-auto"
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1">
              {t('login.email', 'Email')}
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 pl-12 bg-white/50 border ${errors.email ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 placeholder-slate-400 transition-all`}
                placeholder="Enter your email"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-slate-500" />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1">
              {t('login.password', 'Password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 pl-12 pr-12 bg-white/50 border ${errors.password ? 'border-red-500' : 'border-slate-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 placeholder-slate-400 transition-all`}
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-slate-500" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-slate-600 hover:text-primary transition-colors font-medium mr-1"
              >
                {t('login.forgotPassword', 'Forgot Password?')}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
            >
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 ${isLoading ? 'bg-[#003366]/70 cursor-not-allowed' : 'bg-[#003366] hover:bg-[#002244]'
              } text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-md`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('login.loggingIn', 'Signing In...')}</span>
              </div>
            ) : (
              t('login.signIn', 'Sign In')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-6">
          <p className="text-slate-600 text-sm">
            {t('login.noAccount', "Don't have an account?")}{' '}
            <Link to="/register" className="text-[#003366] font-bold hover:underline">
              {t('login.signUp', 'Sign Up')}
            </Link>
          </p>



          {/* Back to Home */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span>{t('login.backToHome', 'Back to Home')}</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
