import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Target,
  Camera,
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogIn,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Check,
  Shuffle,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  HelpCircle,
  KeyRound,
  Trash2,
  ChevronDown,
  Globe,
  Search,
  School,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminRole } from '../types';
import { VALID_INSTITUTIONAL_KEYS } from '../data/adminData';
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  CountryCode,
  detectCountryFromInput
} from '../data/countryCodes';
import {
  searchInstitutions,
  InstitutionSuggestion
} from '../data/collegesData';
import { FloatingAssistant } from './FloatingAssistant';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'register' | 'login';
  initialAudience?: 'learner' | 'admin';
}

interface PresetAvatar {
  id: string;
  name: string;
  gender: 'female' | 'male';
  tag: string;
  url: string;
}

const AI_PRESET_AVATARS: PresetAvatar[] = [
  // Female AI Avatars
  {
    id: 'f1',
    name: 'Ananya',
    gender: 'female',
    tag: 'Female 1',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'f2',
    name: 'Priya',
    gender: 'female',
    tag: 'Female 2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'f3',
    name: 'Kavya',
    gender: 'female',
    tag: 'Female 3',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'f4',
    name: 'Sara',
    gender: 'female',
    tag: 'Female 4',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'f5',
    name: 'Riya',
    gender: 'female',
    tag: 'Female 5',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'f6',
    name: 'Tanvi',
    gender: 'female',
    tag: 'Female 6',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
  },
  // Male AI Avatars
  {
    id: 'm1',
    name: 'Aarav',
    gender: 'male',
    tag: 'Male 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'm2',
    name: 'Rohan',
    gender: 'male',
    tag: 'Male 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'm3',
    name: 'Nikhil',
    gender: 'male',
    tag: 'Male 3',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'm4',
    name: 'Dev',
    gender: 'male',
    tag: 'Male 4',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'm5',
    name: 'Kabir',
    gender: 'male',
    tag: 'Male 5',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'm6',
    name: 'Vikram',
    gender: 'male',
    tag: 'Male 6',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
  initialAudience
}) => {
  const {
    students,
    registerNewStudent,
    loginWithCredentials,
    resetStudentPassword,
    sendPasswordResetEmailHandler,
    loginWithGoogle,
    isFirebaseLoading,
    deleteStudentProfile,
    loginPrefillIdentifier,
    setLoginPrefillIdentifier,
    setCurrentPage,
    // Admin RBAC & Faculty Auth
    admins,
    activeAdmin,
    loginAdmin,
    loginAdminWithGoogle,
    loginAdminQuick,
    registerAdmin,
    switchUserRole,
    authModalAudience,
    setAuthModalAudience
  } = useApp();
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  const [audience, setAudience] = useState<'learner' | 'admin'>(initialAudience || authModalAudience || 'learner');
  const [adminMode, setAdminMode] = useState<'register' | 'login' | 'quick'>('register');

  useEffect(() => {
    if (initialAudience) {
      setAudience(initialAudience);
    } else if (authModalAudience) {
      setAudience(authModalAudience);
    }
  }, [initialAudience, authModalAudience, isOpen]);

  // Admin form state
  const [adminRegName, setAdminRegName] = useState('');
  const [adminRegEmail, setAdminRegEmail] = useState('');
  const [adminRegInstitution, setAdminRegInstitution] = useState('Indian Institute of Technology Bombay');
  const [adminRegDepartment, setAdminRegDepartment] = useState('Department of Computer Science & Engineering');
  const [adminRegRole, setAdminRegRole] = useState<AdminRole>('faculty_lead');
  const [adminRegAuthKey, setAdminRegAuthKey] = useState('FACULTY-DEAN-CS');
  const [adminRegPin, setAdminRegPin] = useState('654321');
  const [adminRegConsent, setAdminRegConsent] = useState(true);

  const [adminLoginEmail, setAdminLoginEmail] = useState('aris.vance@cs.mit.edu');
  const [adminLoginPin, setAdminLoginPin] = useState('749201');
  const [adminLoginAuthKey, setAdminLoginAuthKey] = useState('MINDTRACE-ADMIN-2026');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);
    setIsAdminSubmitting(true);

    try {
      const res = await loginAdmin(adminLoginEmail, adminLoginPin, adminLoginAuthKey);
      if (!res.success) {
        setAdminError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        setAdminSuccess(`Welcome back, ${res.admin?.name || 'Administrator'}!`);
        setTimeout(() => {
          switchUserRole('admin');
          setCurrentPage('admin-dashboard');
          onClose();
          if (onSuccess) onSuccess();
        }, 300);
      }
    } catch (err: any) {
      setAdminError(err?.message || 'Login encountered an unexpected error.');
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const handleAdminRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    if (!adminRegName.trim() || !adminRegEmail.trim() || !adminRegAuthKey.trim()) {
      setAdminError('Please fill in all mandatory fields.');
      return;
    }
    if (!adminRegConsent) {
      setAdminError('Please acknowledge the DPDP & FERPA student data privacy compliance policy.');
      return;
    }

    setIsAdminSubmitting(true);
    try {
      const res = await registerAdmin({
        name: adminRegName,
        email: adminRegEmail,
        institution: adminRegInstitution,
        department: adminRegDepartment,
        role: adminRegRole,
        authKey: adminRegAuthKey,
        securityPin: adminRegPin
      });

      if (!res.success) {
        setAdminError(res.error || 'Registration failed.');
      } else {
        setAdminSuccess('Institutional credentials verified! Redirecting to Faculty Portal...');
        setTimeout(() => {
          switchUserRole('admin');
          setCurrentPage('admin-dashboard');
          onClose();
          if (onSuccess) onSuccess();
        }, 500);
      }
    } catch (err: any) {
      setAdminError(err?.message || 'Registration encountered an error.');
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const handleAdminGoogleSSO = async () => {
    setAdminError(null);
    const res = await loginAdminWithGoogle();
    if (!res.success) {
      setAdminError(res.error || 'Google Institutional SSO failed.');
    } else {
      setAdminSuccess('Authenticated via Google Institutional SSO!');
      setTimeout(() => {
        switchUserRole('admin');
        setCurrentPage('admin-dashboard');
        onClose();
        if (onSuccess) onSuccess();
      }, 300);
    }
  };

  const handleAdminQuickSelect = (adminId: string) => {
    loginAdminQuick(adminId);
    setAdminSuccess('Demo persona activated! Redirecting to Faculty Portal...');
    setTimeout(() => {
      switchUserRole('admin');
      setCurrentPage('admin-dashboard');
      onClose();
      if (onSuccess) onSuccess();
    }, 300);
  };

  // Form Fields - Registration
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [institution, setInstitution] = useState(''); // College or Company Name
  const [isInstitutionDropdownOpen, setIsInstitutionDropdownOpen] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const institutionDropdownRef = useRef<HTMLDivElement>(null);
  const institutionInputRef = useRef<HTMLInputElement>(null);

  const [roleType, setRoleType] = useState<'student' | 'professional' | 'other'>('student');
  const [degree, setDegree] = useState('B.Tech in Computer Science & Engineering');
  const [graduationYearOrExp, setGraduationYearOrExp] = useState('2026');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [targetExam, setTargetExam] = useState('Campus Placements & GATE CS');
  const [learningGoal, setLearningGoal] = useState('Data Structures & Algorithms Mastery');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Prepare for placements']);
  const [primaryGoal, setPrimaryGoal] = useState('Prepare for placements');
  const [learningInterests, setLearningInterests] = useState<string[]>(['Data Structures & Algorithms']);
  const [confidenceLevel, setConfidenceLevel] = useState<'beginner' | 'comfortable' | 'advanced' | 'not_sure'>('beginner');
  const [diagnosticStatus, setDiagnosticStatus] = useState<'not_started' | 'skipped'>('not_started');
  const [avatar, setAvatar] = useState<string>(
    AI_PRESET_AVATARS[0].url
  );

  // Phone input & auto-detection handler
  const handlePhoneChange = (inputVal: string) => {
    // Check if input begins with + or dial code to auto-detect country
    const detected = detectCountryFromInput(inputVal);
    if (detected) {
      setSelectedCountry(detected.country);
      setPhone(detected.cleanedNumber);
      return;
    }

    // Otherwise strip non-digits for standard clean storage
    const digitsOnly = inputVal.replace(/[^\d\s-()]/g, '');
    setPhone(digitsOnly);
  };

  // Filtered country codes based on search query
  const filteredCountries = COUNTRY_CODES.filter((c) => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dialCode.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  // Real-time phone verification status
  const cleanPhoneDigits = phone.replace(/\D/g, '');
  const isIndianNumber = selectedCountry.code === 'IN';
  const isPhoneValid = cleanPhoneDigits.length > 0
    ? (isIndianNumber ? /^[6-9]\d{9}$/.test(cleanPhoneDigits) : selectedCountry.validationRegex.test(cleanPhoneDigits))
    : false;

  // Filtered institution suggestions
  const rawSuggestions = searchInstitutions(institution, 30);
  const filteredInstitutions = useMemo(() => {
    if (selectedCityFilter === 'All' || selectedCityFilter === 'All Locations') {
      return rawSuggestions;
    }
    const filterLower = selectedCityFilter.toLowerCase();
    if (filterLower === 'iits') {
      return rawSuggestions.filter(
        (item) =>
          item.category === 'iit' ||
          item.name.toLowerCase().includes('iit') ||
          item.name.toLowerCase().includes('indian institute of technology')
      );
    }
    if (filterLower === 'dy patil') {
      return rawSuggestions.filter(
        (item) =>
          item.name.toLowerCase().includes('dy patil') ||
          item.name.toLowerCase().includes('d. y. patil') ||
          item.name.toLowerCase().includes('d.y. patil') ||
          (item.shortCode && item.shortCode.toLowerCase().includes('dy patil'))
      );
    }
    if (filterLower === 'srm') {
      return rawSuggestions.filter(
        (item) =>
          item.name.toLowerCase().includes('srm') ||
          (item.shortCode && item.shortCode.toLowerCase().includes('srm'))
      );
    }
    if (filterLower === 'lucknow') {
      return rawSuggestions.filter(
        (item) =>
          item.city.toLowerCase().includes('lucknow') ||
          item.name.toLowerCase().includes('lucknow')
      );
    }
    if (filterLower === 'nits & iiits') {
      return rawSuggestions.filter(
        (item) =>
          item.category === 'nit' ||
          item.category === 'iiit' ||
          item.name.includes('NIT') ||
          item.name.includes('IIIT')
      );
    }
    if (filterLower === 'global / intl') {
      return rawSuggestions.filter(
        (item) =>
          item.category === 'international' ||
          item.stateOrCountry.includes('United States') ||
          item.stateOrCountry.includes('United Kingdom') ||
          item.stateOrCountry.includes('Canada') ||
          item.stateOrCountry.includes('Australia') ||
          item.stateOrCountry.includes('Singapore') ||
          item.stateOrCountry.includes('Germany') ||
          item.stateOrCountry.includes('Japan')
      );
    }
    return rawSuggestions.filter(
      (item) =>
        item.city.toLowerCase().includes(filterLower) ||
        item.name.toLowerCase().includes(filterLower) ||
        item.stateOrCountry.toLowerCase().includes(filterLower)
    );
  }, [rawSuggestions, selectedCityFilter]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
      if (
        institutionDropdownRef.current &&
        !institutionDropdownRef.current.contains(e.target as Node) &&
        institutionInputRef.current &&
        !institutionInputRef.current.contains(e.target as Node)
      ) {
        setIsInstitutionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Camera / Upload / AI Avatar selection state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotHint, setShowForgotHint] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Formal Firebase Password Reset State
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailMessage, setResetEmailMessage] = useState<string | null>(null);

  const handleSendFirebasePasswordReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setResetEmailMessage(null);

    const emailToSend = (resetEmail || (loginIdentifier.includes('@') ? loginIdentifier : '')).trim();
    if (!emailToSend) {
      setFormError('Please enter your email address to receive the Firebase password reset link.');
      return;
    }

    setIsSendingResetEmail(true);
    try {
      const res = await sendPasswordResetEmailHandler(emailToSend);
      if (res.success) {
        setResetEmailSent(true);
        setResetEmailMessage(res.message);
        setFormSuccess(res.message);
      } else {
        setFormError(res.message || 'Failed to dispatch password reset email. Please try again.');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Error occurred while contacting Firebase Authentication.');
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  useEffect(() => {
    setMode(initialMode);
    setFormError(null);
    setFormSuccess(null);
    setResetEmailSent(false);
    setResetEmailMessage(null);
    if (loginPrefillIdentifier) {
      setLoginIdentifier(loginPrefillIdentifier);
      setLoginPassword('');
      if (loginPrefillIdentifier.includes('@')) {
        setResetEmail(loginPrefillIdentifier);
      }
    }
  }, [initialMode, isOpen, loginPrefillIdentifier]);

  // Clean up camera stream when modal closes or unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure stream attaches whenever camera becomes active or DOM renders video
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  const handleVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      if (el.srcObject !== streamRef.current) {
        el.srcObject = streamRef.current;
      }
      el.play().catch((err) => {
        console.warn('Video play deferred:', err);
      });
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraReady(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to access webcam.';
      setCameraError(
        `${errorMsg} You can pick one of the male/female AI avatars below or upload a photo.`
      );
      setIsCameraActive(false);
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    // Guard against grabbing empty frames before camera stream delivers pixels
    if (!width || !height || video.readyState < 2) {
      setCameraError('Camera stream is still starting. Please wait 1 second and click snap again.');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const size = Math.min(width, height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fallback white fill to prevent black transparency
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Center-crop square from camera feed
        const sx = Math.max(0, (width - size) / 2);
        const sy = Math.max(0, (height - size) / 2);

        // Mirror horizontally for natural selfie view
        ctx.translate(size, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        if (dataUrl && dataUrl.length > 600) {
          setAvatar(dataUrl);
          setCameraError(null);
          stopCamera();
        } else {
          setCameraError('Capture returned an empty image. Please retry or choose an AI avatar.');
        }
      }
    } catch (e) {
      console.error(e);
      setCameraError('Unable to capture frame. Please choose one of the avatars below.');
    }
  };

  const selectPresetAvatar = (preset: PresetAvatar) => {
    stopCamera();
    setAvatar(preset.url);
    setCameraError(null);
  };

  const selectRandomAvatar = () => {
    const filtered =
      avatarGenderFilter === 'all'
        ? AI_PRESET_AVATARS
        : AI_PRESET_AVATARS.filter((p) => p.gender === avatarGenderFilter);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    if (random) {
      selectPresetAvatar(random);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          setCameraError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!institution.trim()) {
      setFormError('Please enter your College, University, or Company / Organization name.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please ensure both password fields match.');
      return;
    }
    if (!agreeTerms) {
      setFormError('Please agree to the MindTrace Academic Integrity Honor Code to proceed.');
      return;
    }

    stopCamera();

    const fullFormattedPhone = phone.trim()
      ? `${selectedCountry.dialCode} ${phone.trim()}`
      : undefined;

    const newId = `student-${Date.now()}`;
    registerNewStudent({
      id: newId,
      name: name.trim(),
      email: email.trim(),
      phone: fullFormattedPhone,
      institution: institution.trim(),
      roleType,
      graduationYearOrExp,
      password: password.trim(),
      degree: degree.trim(),
      targetExam: targetExam.trim(),
      learningGoal: learningGoal.trim(),
      learningGoals: selectedGoals,
      primaryGoal,
      learningInterests,
      confidenceLevels: {
        'Data Structures & Algorithms': confidenceLevel
      },
      academicProfile: {
        currentYear: graduationYearOrExp,
        branch: degree.trim(),
        graduationYear: graduationYearOrExp
      },
      onboardingCompleted: true,
      diagnosticStatus,
      currentCourse: 'Data Structures & Algorithms',
      currentChapter: 'Binary Search Trees',
      courseProgress: 63,
      avatar
    });

    setCurrentPage('dashboard');
    onSuccess();
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!loginIdentifier.trim()) {
      setFormError('Please enter your registered Email, Phone, or Name.');
      return;
    }
    if (!loginPassword.trim()) {
      setFormError('Please enter your account password.');
      return;
    }

    const result = loginWithCredentials(loginIdentifier, loginPassword);
    if (!result.success) {
      setFormError(result.error || 'Authentication failed. Please verify your credentials.');
      return;
    }

    stopCamera();
    setCurrentPage('dashboard');
    onSuccess();
    onClose();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSelectAccountForLogin = (student: (typeof students)[0]) => {
    setLoginIdentifier(student.email || student.name);
    setLoginPassword(student.password || 'password123');
    setFormError(null);
    setFormSuccess(null);
    setShowForgotHint(false);
  };

  const handleDeleteProfile = (e: React.MouseEvent, studentId: string) => {
    e.stopPropagation();
    deleteStudentProfile(studentId);
    setConfirmDeleteId(null);
    if (loginIdentifier.toLowerCase() === studentId.toLowerCase()) {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    const result = await loginWithGoogle();
    if (result.success) {
      onSuccess();
      onClose();
    } else if (result.error) {
      setFormError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon with Dual-Side Toggle (Learners Section vs Admins Section) */}
        <div
          className={`p-6 relative text-white transition-colors duration-300 ${
            audience === 'admin'
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900'
              : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            aria-label="Back to MindTrace home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="absolute top-5 right-5 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* DUAL-SIDE PORTAL SELECTOR: Learners Section vs Admins Section */}
          <div className="grid grid-cols-2 p-1 bg-black/30 backdrop-blur-xs rounded-xl mb-4 border border-white/20">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setAudience('learner');
                setAuthModalAudience('learner');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer ${
                audience === 'learner'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learners Section</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setAudience('admin');
                setAuthModalAudience('admin');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer ${
                audience === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admins Section</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-white/20 text-white">
              {audience === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              {audience === 'admin' ? 'Institutional Faculty & Administrative Intelligence' : 'MindTrace Learner Intelligence'}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            {audience === 'admin'
              ? adminMode === 'register'
                ? 'Faculty & Admin Registration'
                : adminMode === 'login'
                ? 'Institutional Faculty Sign In'
                : 'Evaluation Personas'
              : mode === 'register'
              ? 'Create Learner Profile'
              : 'Select Existing Account'}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-md">
            {audience === 'admin'
              ? adminMode === 'register'
                ? 'Register with your college department credentials and registrar authorization clearance key.'
                : adminMode === 'login'
                ? 'Sign in using your institutional academic email, registrar clearance key, and security PIN.'
                : 'Select a verified faculty or dean persona to evaluate cohort-level diagnostics instantly.'
              : mode === 'register'
              ? 'Register with your student details & profile photo to personalize your Diagnostic Assessment and Learning Twin.'
              : 'Choose one of the saved learner accounts or demo personas to continue.'}
          </p>

          {/* Mode Tabs */}
          {audience === 'learner' ? (
            <div className="flex gap-2 mt-4 pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode('register');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Registration</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode('login');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Log In</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={() => setAdminMode('register')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminMode === 'register'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Faculty Registration</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminMode('login')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminMode === 'login'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Institutional Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminMode('quick')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminMode === 'quick'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Evaluation</span>
              </button>
            </div>
          )}
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {audience === 'admin' ? (
            <div className="space-y-4">
              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{adminError}</span>
                </div>
              )}
              {adminSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              {/* Mode 1: Faculty Registration */}
              {adminMode === 'register' && (
                <form onSubmit={handleAdminRegisterSubmit} className="space-y-4">
                  {/* Notice banner */}
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Institutional Role-Based Security: </span>
                      Faculty registration requires an institutional clearance key. Student profiles cannot access this administrative portal.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Academic Name & Title
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={adminRegName}
                        onChange={(e) => setAdminRegName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Gupta, Prof. Sarah Vance"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Institutional Academic Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={adminRegEmail}
                        onChange={(e) => setAdminRegEmail(e.target.value)}
                        placeholder="e.g. faculty@iitb.ac.in, professor@mit.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        University / College
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={adminRegInstitution}
                          onChange={(e) => setAdminRegInstitution(e.target.value)}
                          placeholder="University / Institute name"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Department / Division
                      </label>
                      <div className="relative">
                        <School className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={adminRegDepartment}
                          onChange={(e) => setAdminRegDepartment(e.target.value)}
                          placeholder="e.g. Computer Science & Eng"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Institutional Role
                      </label>
                      <select
                        value={adminRegRole}
                        onChange={(e) => setAdminRegRole(e.target.value as AdminRole)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="faculty_lead">Faculty Course Lead</option>
                        <option value="department_head">Department Chair / Head</option>
                        <option value="dean">Academic Dean</option>
                        <option value="academic_advisor">Academic Advising Specialist</option>
                        <option value="system_admin">Institutional Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        6-Digit Security PIN
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          maxLength={6}
                          value={adminRegPin}
                          onChange={(e) => setAdminRegPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit security PIN"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Registrar Authorization Clearance Key
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={adminRegAuthKey}
                        onChange={(e) => setAdminRegAuthKey(e.target.value.toUpperCase())}
                        placeholder="e.g. MINDTRACE-ADMIN-2026"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono uppercase"
                      />
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Quick clearance keys:</span>
                      {Object.keys(VALID_INSTITUTIONAL_KEYS).slice(0, 3).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAdminRegAuthKey(key)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer font-mono"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminRegConsent}
                        onChange={(e) => setAdminRegConsent(e.target.checked)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-[11px] text-slate-600 leading-tight">
                        I certify that I am authorized faculty/staff and will adhere to FERPA & DPDP educational data privacy laws. Unconsented raw student data is strictly restricted.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdminSubmitting}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAdminSubmitting ? 'Verifying Credentials...' : 'Complete Faculty Registration & Enter Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAdminMode('login')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      Already registered as faculty? Sign In here →
                    </button>
                  </div>
                </form>
              )}

              {/* Mode 2: Institutional Sign In */}
              {adminMode === 'login' && (
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  {/* Google Institutional SSO */}
                  <button
                    type="button"
                    onClick={handleAdminGoogleSSO}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign In with Institutional Google Workspace</span>
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-semibold">
                      Or with Institutional Credentials
                    </span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Institutional Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={adminLoginEmail}
                        onChange={(e) => setAdminLoginEmail(e.target.value)}
                        placeholder="e.g. aris.vance@cs.mit.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        6-Digit Security PIN
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          maxLength={6}
                          value={adminLoginPin}
                          onChange={(e) => setAdminLoginPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit PIN"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono tracking-widest"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Clearance Key
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={adminLoginAuthKey}
                          onChange={(e) => setAdminLoginAuthKey(e.target.value.toUpperCase())}
                          placeholder="Clearance Key"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdminSubmitting}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isAdminSubmitting ? 'Authenticating...' : 'Sign In to Faculty Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setAdminMode('register')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      New Faculty Member? Register here →
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminMode('quick')}
                      className="text-xs text-slate-500 hover:text-indigo-600 font-medium cursor-pointer"
                    >
                      Test Demo Personas →
                    </button>
                  </div>
                </form>
              )}

              {/* Mode 3: Quick Demo Personas */}
              {adminMode === 'quick' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Select a verified academic persona to experience cohort analytics and consent-gated student records:
                  </p>
                  <div className="space-y-2.5">
                    {admins.map((adm) => (
                      <div
                        key={adm.id}
                        onClick={() => handleAdminQuickSelect(adm.id)}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={adm.avatar}
                            alt={adm.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-900">
                                {adm.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold">
                                {adm.role.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{adm.roleTitle}</p>
                            <p className="text-[10px] text-slate-400">{adm.institution}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                          <span>Activate</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Cross-link back to Learners section */}
              <div className="pt-3 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAudience('learner');
                    setAuthModalAudience('learner');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Looking for student practice & cognitive diagnostics? Switch to Learners Section →</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

          {mode === 'register' ? (
            <div className="space-y-4">
              {/* Google One-Click Quick Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isFirebaseLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isFirebaseLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                  or register with custom profile
                </span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Learning onboarding</p>
                  <h3 className="text-base font-bold text-slate-900 mt-1">Tell us what you are working toward</h3>
                  <p className="text-xs text-slate-600 mt-1">These choices personalize your first learning plan and can be changed later.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Goals <span className="font-normal text-slate-500">(select all that apply)</span></label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {['Prepare for placements', 'Strengthen fundamentals', 'Prepare for internships', 'Explore AI / ML'].map((goal) => (
                      <label key={goal} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={selectedGoals.includes(goal)} onChange={(event) => setSelectedGoals((current) => event.target.checked ? [...new Set([...current, goal])] : current.filter((item) => item !== goal))} className="accent-blue-600" />
                        {goal}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="text-xs font-semibold text-slate-700">Primary goal
                    <select value={primaryGoal} onChange={(event) => setPrimaryGoal(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-normal">
                      {selectedGoals.map((goal) => <option key={goal}>{goal}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-slate-700">Current confidence
                    <select value={confidenceLevel} onChange={(event) => setConfidenceLevel(event.target.value as typeof confidenceLevel)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-normal">
                      <option value="beginner">Beginner</option><option value="comfortable">Comfortable</option><option value="advanced">Advanced</option><option value="not_sure">Not sure</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Preferred learning areas <span className="font-normal text-slate-500">(up to 5)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {['Programming Fundamentals', 'Data Structures & Algorithms', 'Database Management Systems', 'Web Development', 'Artificial Intelligence', 'Machine Learning'].map((interest) => (
                      <button key={interest} type="button" onClick={() => setLearningInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : current.length < 5 ? [...current, interest] : current)} className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${learningInterests.includes(interest) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'}`}>{interest}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-semibold text-slate-700">Start with a diagnostic?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDiagnosticStatus('not_started')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${diagnosticStatus === 'not_started' ? 'bg-blue-100 text-blue-800' : 'text-slate-500'}`}>Take later</button>
                    <button type="button" onClick={() => setDiagnosticStatus('skipped')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${diagnosticStatus === 'skipped' ? 'bg-slate-200 text-slate-800' : 'text-slate-500'}`}>Skip for now</button>
                  </div>
                </div>
              </section>
              {/* Profile Picture Upload, Camera Capture & AI Avatar Presets */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Profile Picture <span className="text-slate-400 font-normal lowercase">(camera, upload or AI avatars)</span>
                  </label>
                  <button
                    type="button"
                    onClick={selectRandomAvatar}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                    title="Pick a random AI avatar"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Random AI Avatar</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  {/* Avatar Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={avatar}
                      alt="Profile preview"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-sm bg-slate-100"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  </div>

                  {/* Camera & Upload Actions */}
                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          fileInputRef.current?.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Photo</span>
                      </button>

                      {!isCameraActive ? (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-blue-600" />
                          <span>Open Live Camera</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            disabled={!isCameraReady}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                              isCameraReady
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-400 text-white opacity-80 cursor-wait'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>{isCameraReady ? 'Snap Photo' : 'Starting Camera...'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Snap a photo via camera, upload an image, or choose from our diverse AI-generated male & female student avatars below.
                    </p>
                  </div>
                </div>

                {/* Live Camera Viewport if active */}
                {isCameraActive && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border-2 border-blue-500 bg-slate-950 aspect-video max-w-sm mx-auto shadow-md">
                    <video
                      ref={handleVideoRef}
                      autoPlay
                      playsInline
                      muted
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.play().catch(() => {});
                        }
                      }}
                      onCanPlay={() => setIsCameraReady(true)}
                      onPlaying={() => setIsCameraReady(true)}
                      className="w-full h-full object-cover -scale-x-100"
                    />
                    {!isCameraReady && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                        <span>Initializing webcam video stream...</span>
                      </div>
                    )}
                    {isCameraReady && (
                      <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Capture Photo Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {cameraError && (
                  <div className="mt-2 text-rose-600 text-[11px] bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* AI-Generated Male & Female Avatars Section */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Generated Avatars (Male & Female):</span>
                    </div>

                    {/* Gender Filter Tabs */}
                    <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-[11px] self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setAvatarGenderFilter('all')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          avatarGenderFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All (12)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarGenderFilter('female')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          avatarGenderFilter === 'female'
                            ? 'bg-pink-100 text-pink-800 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Female (6)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarGenderFilter('male')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          avatarGenderFilter === 'male'
                            ? 'bg-blue-100 text-blue-800 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Male (6)</span>
                      </button>
                    </div>
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-2.5">
                    {AI_PRESET_AVATARS.filter(
                      (p) => avatarGenderFilter === 'all' || p.gender === avatarGenderFilter
                    ).map((preset) => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => selectPresetAvatar(preset)}
                          className={`group relative p-1.5 rounded-xl border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/25 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          title={`Select ${preset.name} (${preset.gender})`}
                        >
                          <div className="relative">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="w-full">
                            <div className="text-[11px] font-semibold text-slate-800 truncate">
                              {preset.name}
                            </div>
                            <span
                              className={`text-[9px] font-medium px-1 rounded block truncate ${
                                preset.gender === 'female'
                                  ? 'text-pink-700 bg-pink-50'
                                  : 'text-blue-700 bg-blue-50'
                              }`}
                            >
                              {preset.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal & Academic / Professional Details */}
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sunil Kumar Singh"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="student@college.edu or name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone / Mobile Number with Country Code Selector & Auto Detection */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Mobile / WhatsApp Number
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                    </div>

                    <div className="relative flex rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
                      {/* Country Code Trigger Button */}
                      <div className="relative shrink-0" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCountryDropdownOpen(!isCountryDropdownOpen);
                            setCountrySearch('');
                          }}
                          className="h-full px-2.5 py-2 flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border-r border-slate-200 rounded-l-xl text-xs font-medium text-slate-700 transition-colors focus:outline-none"
                          title="Select Country Dial Code"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span className="font-bold text-slate-800">{selectedCountry.dialCode}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                        </button>

                        {/* Country Code Dropdown Popover */}
                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="p-2.5 bg-slate-50 border-b border-slate-100">
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                <input
                                  type="text"
                                  placeholder="Search country or code (+91, +1, UK)..."
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                              </div>

                              {/* Popular Quick Select */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {[
                                  { code: 'IN', label: '🇮🇳 India (+91)' },
                                  { code: 'US', label: '🇺🇸 US (+1)' },
                                  { code: 'GB', label: '🇬🇧 UK (+44)' },
                                  { code: 'AE', label: '🇦🇪 UAE (+971)' },
                                  { code: 'CA', label: '🇨🇦 Canada (+1)' }
                                ].map((item) => {
                                  const cObj = COUNTRY_CODES.find((c) => c.code === item.code);
                                  if (!cObj) return null;
                                  return (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCountry(cObj);
                                        setIsCountryDropdownOpen(false);
                                      }}
                                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                                        selectedCountry.code === item.code
                                          ? 'bg-blue-600 text-white font-bold'
                                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-50">
                              {filteredCountries.map((c) => {
                                const isSel = selectedCountry.code === c.code;
                                return (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-blue-50/80 transition-colors ${
                                      isSel ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{c.flag}</span>
                                      <div>
                                        <div className="text-xs font-medium flex items-center gap-1.5">
                                          <span>{c.name}</span>
                                          <span className="text-[10px] text-slate-400 font-normal">({c.code})</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400">e.g. {c.format}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-mono font-bold text-slate-600">{c.dialCode}</span>
                                      {isSel && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                    </div>
                                  </button>
                                );
                              })}
                              {filteredCountries.length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-400">
                                  No countries matching "{countrySearch}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        placeholder={selectedCountry.format}
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-r-xl focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Verification Status Feedback */}
                    {phone.trim().length > 0 ? (
                      isPhoneValid ? (
                        <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/80 px-2 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode}) verified
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-amber-700 bg-amber-50/80 border border-amber-200/80 px-2 py-0.5 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {isIndianNumber
                              ? 'Enter 10-digit Indian number (e.g. 9876543210)'
                              : `Enter valid format for ${selectedCountry.name}: e.g. ${selectedCountry.format}`}
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-0.5">
                        <span>Prefix: {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})</span>
                        <span>Auto-detects country when typing +91</span>
                      </div>
                    )}
                  </div>

                  {/* College / University / Organization Auto-Suggest Typeahead */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        College / University / Company <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                        <Globe className="w-3 h-3 text-blue-500" />
                        <span>Worldwide GPS Search</span>
                      </span>
                    </div>

                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        ref={institutionInputRef}
                        type="text"
                        required
                        placeholder="Search any college, university or city (e.g. IIT, DY Patil, SRM, Lucknow, Ropar, Mumbai)..."
                        value={institution}
                        onFocus={() => setIsInstitutionDropdownOpen(true)}
                        onChange={(e) => {
                          setInstitution(e.target.value);
                          setIsInstitutionDropdownOpen(true);
                        }}
                        className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-2xs"
                      />
                      {institution.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setInstitution('');
                            institutionInputRef.current?.focus();
                          }}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* College & City Suggestions Dropdown */}
                    {isInstitutionDropdownOpen && (
                      <div
                        ref={institutionDropdownRef}
                        className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-80 flex flex-col"
                      >
                        {/* City & Category Quick Filters Header */}
                        <div className="p-2 bg-slate-50 border-b border-slate-100 shrink-0">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-600" />
                              <span>Global Locations & Institutes</span>
                            </span>
                            <span className="text-blue-600 font-normal">
                              {filteredInstitutions.length} found
                            </span>
                          </div>
                          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                            {[
                              { label: 'All', value: 'All' },
                              { label: '🏛️ IITs (All 23)', value: 'IITs' },
                              { label: '🎓 DY Patil', value: 'DY Patil' },
                              { label: '✨ SRM', value: 'SRM' },
                              { label: '📍 Lucknow', value: 'Lucknow' },
                              { label: '⚡ NITs & IIITs', value: 'NITs & IIITs' },
                              { label: '🌆 Mumbai', value: 'Mumbai' },
                              { label: '🏰 Pune', value: 'Pune' },
                              { label: '🏛️ Delhi NCR', value: 'Delhi' },
                              { label: '🚀 Bengaluru', value: 'Bengaluru' },
                              { label: '🌊 Chennai', value: 'Chennai' },
                              { label: '🌐 Global / Intl', value: 'Global / Intl' }
                            ].map((tab) => (
                              <button
                                key={tab.value}
                                type="button"
                                onClick={() => setSelectedCityFilter(tab.value)}
                                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold shrink-0 transition-colors cursor-pointer ${
                                  selectedCityFilter === tab.value
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom addition banner if typed something specific */}
                        {institution.trim().length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInstitutionDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 bg-blue-50/70 hover:bg-blue-100 border-b border-blue-100 text-left flex items-center justify-between gap-2 text-xs font-semibold text-blue-900 transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="p-0.5 rounded bg-blue-600 text-white text-[10px]">✓</span>
                              <span className="truncate">Use "<strong>{institution.trim()}</strong>"</span>
                            </div>
                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-700 shrink-0">
                              Custom Institution
                            </span>
                          </button>
                        )}

                        {/* Suggestions List */}
                        <div className="overflow-y-auto divide-y divide-slate-50 py-1 flex-1">
                          {filteredInstitutions.map((item: InstitutionSuggestion, idx: number) => (
                            <button
                              key={`${item.name}-${idx}`}
                              type="button"
                              onClick={() => {
                                setInstitution(item.name);
                                setIsInstitutionDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50/80 transition-colors flex items-start justify-between gap-2 group cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors mt-0.5 shrink-0">
                                  {item.category === 'iit' ? (
                                    <span className="text-xs font-bold text-amber-700">IIT</span>
                                  ) : item.category === 'nit' || item.category === 'iiit' ? (
                                    <span className="text-[10px] font-bold text-indigo-700">NIT</span>
                                  ) : item.category === 'company' ? (
                                    <Building2 className="w-3.5 h-3.5" />
                                  ) : item.category === 'international' ? (
                                    <Globe className="w-3.5 h-3.5" />
                                  ) : (
                                    <School className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-900">
                                    {item.name}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                    <span className="flex items-center gap-0.5 text-slate-500 font-medium">
                                      <MapPin className="w-2.5 h-2.5 text-rose-500" />
                                      {item.city}, {item.stateOrCountry}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                                  item.category === 'iit'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : item.name.toLowerCase().includes('dy patil')
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : item.name.toLowerCase().includes('srm')
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : item.city.toLowerCase().includes('lucknow')
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                    : item.category === 'company'
                                    ? 'bg-slate-100 text-slate-700'
                                    : item.category === 'international'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.category === 'iit'
                                  ? 'IIT'
                                  : item.name.toLowerCase().includes('dy patil')
                                  ? 'DY Patil'
                                  : item.name.toLowerCase().includes('srm')
                                  ? 'SRM'
                                  : item.city.toLowerCase().includes('lucknow')
                                  ? 'Lucknow'
                                  : item.category}
                              </span>
                            </button>
                          ))}

                          {filteredInstitutions.length === 0 && (
                            <div className="p-4 text-center">
                              <p className="text-xs text-slate-600 font-medium">
                                No pre-listed institutions matching "{institution}" in {selectedCityFilter}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                You can freely register with your custom college or GPS location!
                              </p>
                              {institution.trim() && (
                                <button
                                  type="button"
                                  onClick={() => setIsInstitutionDropdownOpen(false)}
                                  className="mt-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                                >
                                  Use "{institution.trim()}"
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer Tip */}
                        <div className="p-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center shrink-0">
                          Supports all 23 IITs, DY Patil, SRM, Lucknow, NITs, and GPS locations worldwide
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Status Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Status / Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoleType('student')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        roleType === 'student'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>🎓</span>
                      <span>College Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleType('professional')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        roleType === 'professional'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>💼</span>
                      <span>Working Pro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleType('other')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        roleType === 'other'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>🚀</span>
                      <span>Job Seeker / GATE</span>
                    </button>
                  </div>
                </div>

                {/* Degree & Graduation Year / Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {roleType === 'professional' ? 'Job Title / Domain' : 'Degree / Branch'}
                    </label>
                    <div className="relative">
                      {roleType === 'professional' ? (
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      )}
                      <input
                        type="text"
                        placeholder={
                          roleType === 'professional'
                            ? 'e.g. Software Engineer, QA, Data Analyst'
                            : 'e.g. B.Tech Computer Science, MCA'
                        }
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {roleType === 'professional' ? 'Total Experience' : 'Graduation Year'}
                    </label>
                    <select
                      value={graduationYearOrExp}
                      onChange={(e) => setGraduationYearOrExp(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="2024">Batch 2024</option>
                      <option value="2025">Batch 2025</option>
                      <option value="2026">Batch 2026</option>
                      <option value="2027">Batch 2027</option>
                      <option value="2028+">Batch 2028 or later</option>
                      <option value="1-2 Years Experience">1 - 2 Years Experience</option>
                      <option value="3+ Years Experience">3+ Years Experience</option>
                    </select>
                  </div>
                </div>

                {/* Password Creation Section */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Security & Password Creation</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Used to log back in anytime
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Create Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-3 pr-9 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Confirm Password <span className="text-rose-500">*</span></span>
                        {confirmPassword && (
                          <span
                            className={`text-[10px] font-semibold ${
                              password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                            }`}
                          >
                            {password === confirmPassword ? '✓ Passwords match' : '✗ Mismatch'}
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-3 pr-9 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white ${
                            confirmPassword && password !== confirmPassword
                              ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
                              : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target & Learning Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Exam / Career Target
                    </label>
                    <div className="relative">
                      <Target className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Campus Placements, GATE CS, SDE"
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Learning Goal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Recursion & Trees Mastery"
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Academic Integrity Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      I declare that the institution and details provided are accurate and agree to MindTrace's
                      <strong className="text-slate-800"> Academic Integrity & Diagnostic Honor Code</strong>.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Instant Notification Dispatch:</strong> Upon registration, an official welcome email is dispatched to your registered email, along with an SMS/WhatsApp security PIN to your phone number.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register & Begin Diagnostic Assessment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setMode('login');
                      setFormError(null);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Already have an account? Log In here →
                  </button>
                </div>
                {/* Cross-Link to Faculty & Admins Section */}
                <div className="pt-3 mt-3 border-t border-slate-200/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setAudience('admin');
                      setAuthModalAudience('admin');
                    }}
                    className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Are you a University Faculty Member or Dean? Switch to Admins Section →</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          ) : (
            /* Login Form with Credentials & Fast Demo Personas */
            <div className="space-y-5">
              {/* Google Sign-In for Existing/Returning Learners */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isFirebaseLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isFirebaseLoading ? 'Signing in with Google...' : 'Sign in with Google Account'}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                  or sign in with password
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address, Mobile, or Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. nitin@mindtrace.ai or +91 98765 43210"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotHint(!showForgotHint);
                        setFormError(null);
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center gap-1 hover:underline"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{showForgotHint ? 'Hide password help' : 'Forgot password?'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password (default: password123)"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {showForgotHint && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 text-blue-900 text-xs space-y-3.5 animate-in fade-in shadow-xs">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-blue-200/70">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                            <span>Firebase Authentication Password Reset</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold border border-blue-300/50">Official Flow</span>
                          </div>
                          <div className="text-[11px] text-blue-700">Self-service password reset & credential recovery via email</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-blue-100/90 text-blue-800 px-2 py-0.5 rounded-full font-bold border border-blue-300/60 shrink-0">
                        Default: password123
                      </span>
                    </div>

                    {/* Formal Firebase Email Reset Flow */}
                    <div className="space-y-2 bg-white/90 p-3 rounded-lg border border-blue-200/80">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dispatch Password Reset Link (Firebase Auth)</span>
                        </span>
                        <span className="text-[10px] font-normal text-slate-500">Secure TLS Delivery</span>
                      </label>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Enter your registered email address below to receive an official password reset email link generated by Firebase Authentication:
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="email"
                            placeholder="Enter your email (e.g. learner@institution.edu)"
                            value={resetEmail || (loginIdentifier.includes('@') ? loginIdentifier : '')}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isSendingResetEmail}
                          onClick={() => handleSendFirebasePasswordReset()}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          {isSendingResetEmail ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3" />
                              <span>Send Reset Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      {resetEmailSent && resetEmailMessage && (
                        <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-start gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="flex-1 leading-relaxed">
                            <span className="font-semibold block">Email Sent Successfully</span>
                            {resetEmailMessage}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instant Zero-Wait Fallbacks */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Instant Sign-In Options (Zero-Wait)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginPassword('password123');
                            setShowLoginPassword(true);
                            setFormError(null);
                            setFormSuccess('Applied default password "password123". Click "Log In to MindTrace" below.');
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Fill Default Password (password123)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const target = (loginIdentifier || resetEmail).trim();
                            if (!target) {
                              setFormError('Please enter your registered Email, Phone, or Name above to reset password.');
                              return;
                            }
                            const res = resetStudentPassword(target, 'password123');
                            if (!res.success) {
                              setFormError(res.error || 'Account not found. Please verify identifier.');
                            } else {
                              setLoginPassword('password123');
                              setShowLoginPassword(true);
                              setFormError(null);
                              setFormSuccess(res.message || 'Password reset to default "password123" successfully!');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset Account to Default Password</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                <div className="pt-2">
                  <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-2.5 flex items-start gap-2.5 text-xs text-blue-900 mb-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Security Sign-in Alert:</strong> Dispatches instant sign-in confirmation and security alerts to your registered email & phone.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to MindTrace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Saved Profiles on this Device (if any exist) */}
              {students.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Registered Profiles on this Device ({students.length})</span>
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      Password Required
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    Select your account to fill your email/ID into the form above. For security, your password must be entered manually each time.
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                    {students.map((student) => {
                      const isSelected = loginIdentifier.toLowerCase() === (student.email || student.name).toLowerCase();
                      return (
                        <div
                          key={student.id}
                          onClick={() => handleSelectAccountForLogin(student)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30'
                              : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                                <span>{student.name}</span>
                                {student.institution && (
                                  <span className="text-[10px] font-medium text-slate-500 truncate">
                                    • {student.institution}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {student.email} • {student.degree}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {confirmDeleteId === student.id ? (
                              <div
                                className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg animate-in fade-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-[10px] text-rose-700 font-bold">Remove?</span>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteProfile(e, student.id)}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteId(null);
                                  }}
                                  className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAccountForLogin(student);
                                  }}
                                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors border ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'text-blue-700 bg-white hover:bg-blue-50 border-blue-200'
                                  }`}
                                  title="Select this profile and enter password above"
                                >
                                  {isSelected ? 'Selected' : 'Select'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteId(student.id);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                                  title="Delete profile from device"
                                  aria-label={`Delete ${student.name}'s profile`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Bottom Switch to Register */}
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setMode('register');
                    setFormError(null);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Don't have an account yet? Create your Learner Profile →</span>
                </button>
              </div>

              {/* Cross-Link to Faculty & Admins Section */}
              <div className="pt-3 mt-3 border-t border-slate-200/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setAudience('admin');
                    setAuthModalAudience('admin');
                  }}
                  className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Are you a University Faculty Member or Dean? Switch to Admins Section →</span>
                </button>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>

      {/* Floating AI FAQ Assistant Widget for Registration & Login */}
      <FloatingAssistant
        onSwitchMode={(m) => {
          stopCamera();
          setMode(m);
        }}
        isInsideModal={true}
        onFocusField={(fieldName) => {
          if (fieldName === 'institution') {
            setIsInstitutionDropdownOpen(true);
            institutionInputRef.current?.focus();
          }
        }}
      />
    </div>
  );
};
