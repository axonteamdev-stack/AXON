import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search, Bell, Settings, Home, FileText, Users, User,
  Plus, ChevronLeft, ChevronRight, CalendarDays, CheckCircle, Heart,
  Star, ArrowRight, MessageCircle, MessageSquare, Lightbulb, Calendar, Camera,
  CalendarPlus, Building2, Pill, ClipboardList, Pencil, Trash2, Send,
  AlertCircle, Activity, FlaskConical, Lock, LogOut, Info, CloudUpload, Eye, EyeOff
} from 'lucide-react';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=0F4C81&color=fff";

const doctors = [
  {
    id: 1,
    name: 'Dr. Sara Mohamed',
    specialty: 'Neurology',
    experience: 12,
    rating: 4.9,
    fees: 420.0,
    image: DEFAULT_AVATAR,
    available: true
  },
  {
    id: 2,
    name: 'Dr. Khaled Omar',
    specialty: 'Dermatology',
    experience: 8,
    rating: 4.7,
    fees: 350.0,
    image: DEFAULT_AVATAR,
    available: false
  }
];

const PatientHome = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentMode, setAppointmentMode] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeProfileView, setActiveProfileView] = useState(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthConditions, setHealthConditions] = useState([]);
  const [conditionInputs, setConditionInputs] = useState([]);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [allergyInputs, setAllergyInputs] = useState([]);
  const [radiologyEntries, setRadiologyEntries] = useState([]);
  const [radiologyDrafts, setRadiologyDrafts] = useState([]);
  const [labEntries, setLabEntries] = useState([]);
  const [labDrafts, setLabDrafts] = useState([]);
  const [isEditingRadiology, setIsEditingRadiology] = useState(false);
  const [isEditingLab, setIsEditingLab] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [medsTakenToday, setMedsTakenToday] = useState(2);
  const [medsTotalToday] = useState(4);
  const [nextDoseInMinutes, setNextDoseInMinutes] = useState(20);
  const [isPanadolTaken, setIsPanadolTaken] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [medicalSearch, setMedicalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingHospital, setBookingHospital] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [hospitalBookSearch, setHospitalBookSearch] = useState('');
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [historyTab, setHistoryTab] = useState('appointments');

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [patientData, setPatientData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        name: parsed.name || `${parsed.firstName} ${parsed.lastName}` || (isRtl ? 'عبد الله حسن' : 'Abdalulah Hassan'),
        avatar: parsed.avatar || DEFAULT_AVATAR,
        bio: parsed.bio || (isRtl ? 'مريض مهتم بصحته.' : 'A health-conscious patient.'),
        id: parsed.id || '12345',
        email: parsed.email || 'al-bodaya@gmail.com',
        phone: parsed.phone || '01012345678',
        height: parsed.height || '165',
        weight: parsed.weight || '60'
      };
    }
    return {
      name: isRtl ? 'عبد الله حسن' : 'Abdalulah Hassan',
      avatar: DEFAULT_AVATAR,
      bio: isRtl ? 'مريض مهتم بصحته.' : 'A health-conscious patient.',
      id: '12345',
      email: 'al-bodaya@gmail.com',
      phone: '01012345678',
      height: '165',
      weight: '60'
    };
  });

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      if (activeTab !== 'home') {
        setActiveTab('home');
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNextDoseInMinutes((m) => (m > 0 ? m - 1 : 0));
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const medsProgress = useMemo(() => {
    const safeTotal = Math.max(1, medsTotalToday || 1);
    return Math.min(100, Math.max(0, Math.round((medsTakenToday / safeTotal) * 100)));
  }, [medsTakenToday, medsTotalToday]);

  const navItems = [
    { id: 'home', icon: Home, label: isRtl ? 'الرئيسية' : 'Home' },
    { id: 'chats', icon: MessageSquare, label: isRtl ? 'المحادثات' : 'Chats' },
    { id: 'community', icon: Users, label: isRtl ? 'المجتمع' : 'Community' },
    { id: 'profile', icon: User, label: isRtl ? 'الملف الشخصي' : 'Profile' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPatientData({ ...patientData, avatar: base64String });
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: base64String }));
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderHomeContent = () => (
    <div className={`flex flex-col ${isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row'} justify-between gap-6 w-full`}>
      {/* Left section: Main content */}
      <div className="flex flex-col gap-6 flex-1 max-w-5xl">
        {/* Top section: Today's Medications */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            {isRtl ? 'أدوية اليوم' : "Today's Medications"}
          </h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#EDF1F7] rounded-[32px] px-6 py-6 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <span className="text-2xl" role="img" aria-label="pill" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>💊</span>
              <span className="text-[#004A87] font-black text-lg">
                {isRtl ? `الجرعة القادمة خلال ${nextDoseInMinutes} دقيقة` : `Next dose in ${nextDoseInMinutes} minutes`}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="relative shrink-0 flex items-center justify-center">
                <svg className="w-[320px] h-[320px] transform -rotate-90">
                  <circle cx="160" cy="160" r="145" stroke="#D1D5DB" strokeWidth="14" fill="transparent" />
                  <circle
                    cx="160" cy="160" r="145" stroke="#004A87" strokeWidth="14" fill="transparent"
                    strokeDasharray={2 * Math.PI * 145}
                    strokeDashoffset={2 * Math.PI * 145 * (1 - medsProgress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base text-slate-500 font-bold uppercase tracking-tighter opacity-60">
                    {isRtl ? 'تم تناوله اليوم' : 'taken today'}
                  </span>
                  <span className="text-6xl font-black text-slate-900 mt-0.5">
                    {medsTakenToday}/{medsTotalToday}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col gap-5 lg:pl-20">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-60">
                      {isRtl ? 'الجرعة القادمة' : 'Next dose'}
                    </p>
                    <h4 className="text-xl font-black text-[#004A87]">{isRtl ? 'فيتامين د' : 'Vitamin D'}</h4>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider opacity-60">
                      {isRtl ? 'الوقت' : 'Time'}
                    </p>
                    <p className="text-xl font-black text-[#004A87]">10:00 PM</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 max-w-[240px]">
                  <button
                    onClick={() => setMedsTakenToday((v) => Math.min(medsTotalToday, v + 1))}
                    className="w-full bg-[#004A87] text-white py-2.5 rounded-[14px] font-black hover:bg-[#003a6b] transition-all shadow-md shadow-[#004A87]/20 text-base"
                  >
                    {isRtl ? 'تم التناول' : 'Taken'}
                  </button>
                  <button
                    onClick={() => setActiveTab('records')}
                    className="w-full border-2 border-[#004A87] text-[#004A87] py-2 rounded-[14px] font-black hover:bg-[#004A87]/5 transition-all text-base"
                  >
                    {isRtl ? 'عرض الكل' : 'View All'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section: Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>

          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 grid grid-cols-4 gap-4">
            {[
              { icon: CalendarPlus, label: isRtl ? 'حجز' : 'Book', onClick: () => { setBookingStep(1); setBookingConfirmed(false); setBookingDoctor(null); setBookingHospital(null); setBookingDate(''); setBookingTime(''); setBookingNotes(''); setActiveTab('booking'); } },
              { icon: Building2, label: isRtl ? 'مستشفيات' : 'Hospitals', onClick: () => setActiveTab('hospitals') },
              { icon: Pill, label: isRtl ? 'أدوية' : 'Medicals', onClick: () => setActiveTab('medicals') },
              { icon: ClipboardList, label: isRtl ? 'السجل' : 'History', onClick: () => setActiveTab('history') },
            ].map((action, idx) => (
              <button key={idx} onClick={action.onClick} className="flex flex-col items-center gap-2 group transition-all">
                <div className="w-14 h-14 bg-[#004A87]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon size={26} className="text-[#004A87]" />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right section: Articles & Tips */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-80 shrink-0"
      >
        <h3 className={`text-lg font-bold text-slate-800 mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          {isRtl ? 'المقالات والنصائح' : 'Articles & Tips'}
        </h3>

        <div className="space-y-4">
          {[
            {
              title: isRtl ? '5 نصائح لتناول الأدوية في الوقت المحدد' : '5 Tips to Take Your Medication on Time',
              image: <img src="/assets/IMG_9401.PNG" className="w-full h-full object-cover" alt="Support" />
            },
            {
              title: isRtl ? 'أهمية الفيتامينات اليومية لصحتك' : 'Why Daily Vitamins Matter for Your Health',
              image: <img src="/assets/IMG_9403.PNG" className="w-full h-full object-cover" alt="Activity" />
            }
          ].map((article, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-[#004A87]/30 transition-all cursor-pointer group"
            >
              <div className="h-44 group-hover:scale-110 transition-transform overflow-hidden">
                {article.image}
              </div>
              <div className="p-4">
                <h4 className={`text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#004A87] transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                  {article.title}
                </h4>

              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderCommunityContent = () => (
    <div className="max-w-4xl mx-auto relative min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-800">{isRtl ? 'المجتمع' : 'Community'}</h3>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              {isRtl ? 'لا توجد منشورات بعد' : 'No posts yet'}
            </h3>
            <p className="text-slate-500 font-medium">
              {isRtl ? 'كن أول من يشارك شيئاً مع المجتمع' : 'Be the first to share something'}
            </p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{post.author || (isRtl ? 'مستخدم' : 'User')}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.time || (isRtl ? 'الآن' : 'Just now')}</p>
                </div>
              </div>
              <h4 className="text-lg font-black text-[#004A87] mb-2">{post.title}</h4>
              <p className="text-slate-600 leading-relaxed mb-3">{post.content}</p>
              {post.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-96">
                  <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Interaction Buttons */}
              <div className="flex items-center gap-6 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    const newPosts = [...posts];
                    newPosts[idx] = {
                      ...newPosts[idx],
                      liked: !newPosts[idx].liked,
                      likes: (newPosts[idx].likes || 0) + (newPosts[idx].liked ? -1 : 1)
                    };
                    setPosts(newPosts);
                  }}
                  className={`flex items-center gap-2 font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                >
                  <Heart size={20} className={post.liked ? "fill-current" : ""} />
                  <span>{post.likes > 0 ? post.likes : (isRtl ? 'إعجاب' : 'Love')}</span>
                </button>
                <button
                  onClick={() => setExpandedComments(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#004A87] transition-colors"
                >
                  <MessageCircle size={20} />
                  <span>{post.comments > 0 ? post.comments : (isRtl ? 'تعليق' : 'Comment')}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[idx] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-slate-100"
                >
                  {/* Comments List */}
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                    {(post.commentsList || []).length === 0 ? (
                      <p className="text-center text-slate-400 text-sm py-2">
                        {isRtl ? 'كن أول من يعلق!' : 'Be the first to comment!'}
                      </p>
                    ) : (
                      (post.commentsList || []).map((comment, cIdx) => (
                        <div key={cIdx} className="bg-slate-50 p-3 rounded-2xl">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                              <User size={14} />
                            </div>
                            <span className="font-bold text-slate-900 text-xs">{comment.author}</span>
                            <span className="text-[10px] text-slate-400">{comment.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 pl-8 pr-2">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.target.elements.comment;
                      if (input.value.trim()) {
                        const newPosts = [...posts];
                        const currentComments = newPosts[idx].commentsList || [];
                        newPosts[idx] = {
                          ...newPosts[idx],
                          commentsList: [...currentComments, {
                            author: patientData.name,
                            text: input.value.trim(),
                            time: isRtl ? 'الآن' : 'Just now'
                          }],
                          comments: currentComments.length + 1
                        };
                        setPosts(newPosts);
                        input.value = '';
                      }
                    }}
                    className="flex items-center gap-2 relative"
                  >
                    <input
                      name="comment"
                      type="text"
                      placeholder={isRtl ? 'اكتب تعليقاً...' : 'Write a comment...'}
                      className="flex-1 bg-slate-50 pl-4 pr-12 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 border border-slate-200"
                    />
                    <button type="submit" className={`absolute ${isRtl ? 'left-2' : 'right-2'} w-8 h-8 rounded-xl bg-[#004A87] text-white flex items-center justify-center hover:bg-[#003a6b] transition-colors`}>
                      <Plus size={18} />
                    </button>
                  </form>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsCreatingPost(true)}
        className={`fixed bottom-12 ${isRtl ? 'left-12' : 'right-12'} w-16 h-16 bg-[#004A87] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-[60] group`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        <Plus size={32} className="relative z-10" />
      </button>

      {/* Create Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsCreatingPost(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl z-10"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 sm:hidden" />

            <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
              {isRtl ? 'إنشاء منشور' : 'Create Post'}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder={isRtl ? 'عنوان المنشور' : 'Post title'}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87] font-medium placeholder:text-slate-400"
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={isRtl ? 'اكتب شيئاً...' : 'Write something...'}
                rows={4}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87] font-medium placeholder:text-slate-400 resize-none"
              />
              {newPostImage && (
                <div className="relative rounded-2xl overflow-hidden h-40 w-full border border-slate-200 mt-4">
                  <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[#004A87] font-bold hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors cursor-pointer">
                <Camera size={22} className="text-[#004A87]" />
                <span>{isRtl ? 'إضافة صورة' : 'Add Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setNewPostImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button
                onClick={() => {
                  if (newPostTitle && newPostContent) {
                    setPosts([{
                      title: newPostTitle,
                      content: newPostContent,
                      image: newPostImage,
                      author: patientData.name,
                      time: isRtl ? 'الآن' : 'Just now'
                    }, ...posts]);
                    setIsCreatingPost(false);
                    setNewPostTitle('');
                    setNewPostContent('');
                    setNewPostImage(null);
                  }
                }}
                className="bg-[#004A87] text-white px-12 py-3.5 rounded-full font-bold shadow-lg shadow-[#004A87]/20 hover:bg-[#003a6b] transition-all active:scale-95 text-lg"
              >
                {isRtl ? 'مشاركة' : 'Share'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderRecordsContent = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* All Medicine Header */}
      <div className="bg-[#004A87] text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} className={isRtl ? 'transform rotate-180' : ''} />
          </button>
          <h2 className="text-xl font-bold tracking-tight">{isRtl ? 'كل الأدوية' : 'All Medicine'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search size={22} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Calendar size={22} />
          </button>
        </div>
      </div>

      {/* Medication Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#004A87] mb-2">{isRtl ? 'بانادول' : 'panadol'}</h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">
              {isRtl ? 'ثلاث مرات يومياً' : 'three times daily'}
            </p>
          </div>
          <div className="flex items-center gap-4">

            {/* Note: In the screenshot there is a pen and a trash bin. I will use Edit/Trash icons from lucide */}
            <button className="text-[#004A87] hover:scale-110 transition-transform">
              <Pencil size={20} />
            </button>
            <button className="text-red-500 hover:scale-110 transition-transform">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Details with Icons */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#004A87]">
              <CalendarDays size={18} />
            </div>
            <span className="font-bold text-sm">{isRtl ? 'التالي:' : 'Next:'}</span>
            <span className="font-black text-slate-900 ml-2">08:00</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#004A87]">
              <Calendar size={18} />
            </div>
            <span className="font-bold text-sm">{isRtl ? 'البداية:' : 'Start:'}</span>
            <span className="font-black text-slate-900 ml-2">24 Apr 2026</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#004A87]">
              <Calendar size={18} />
            </div>
            <span className="font-bold text-sm">{isRtl ? 'النهاية:' : 'End:'}</span>
            <span className="font-black text-slate-900 ml-2">30 Apr 2026</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              if (!isPanadolTaken) {
                setIsPanadolTaken(true);
                setMedsTakenToday((v) => Math.min(medsTotalToday, v + 1));
              }
            }}
            disabled={isPanadolTaken}
            className={`${isPanadolTaken ? 'bg-green-500 hover:bg-green-600' : 'bg-[#004A87] hover:bg-[#003a6b]'} text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#004A87]/20 disabled:opacity-80 disabled:cursor-not-allowed`}
          >
            <CheckCircle size={20} />
            {isPanadolTaken ? (isRtl ? 'تم' : 'Done') : (isRtl ? 'تم التناول' : 'Taken')}
          </button>
          <button className="border-2 border-red-200 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-300 transition-all">
            <Plus size={20} className="transform rotate-45" />
            {isRtl ? 'تخطي' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfileContent = () => {
    if (activeProfileView === 'basic') {
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative pb-28">
          {/* Absolute Back Button */}
          <button
            onClick={() => setActiveProfileView(null)}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-12 flex flex-col">
            {/* Avatar Section */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <label className="cursor-pointer block relative">
                  <div className="w-32 h-32 bg-[#F0F2F5] rounded-full flex items-center justify-center overflow-hidden">
                    {patientData.avatar ? (
                      <img src={patientData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-[#64748B]" />
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[#004A87] text-white w-8 h-8 flex items-center justify-center rounded-full border-[3px] border-white hover:bg-[#003a6b] transition-colors shadow-sm">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-600 mb-2 font-medium">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                <input id="edit-name" type="text" defaultValue={patientData.name} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2 font-medium">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                <input id="edit-email" type="email" defaultValue={patientData.email} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2 font-medium">{isRtl ? 'رقم الهاتف' : 'Phone'}</label>
                <input id="edit-phone" type="tel" defaultValue={patientData.phone} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-slate-600 mb-2 font-medium">{isRtl ? 'الطول (سم)' : 'Height (cm)'}</label>
                  <input id="edit-height" type="number" defaultValue={patientData.height} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-slate-600 mb-2 font-medium">{isRtl ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                  <input id="edit-weight" type="number" defaultValue={patientData.weight} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-50">
            <div className="w-full max-w-lg mx-auto p-6">
              <button
                onClick={() => {
                  const newName = document.getElementById('edit-name')?.value;
                  const newEmail = document.getElementById('edit-email')?.value;
                  const newPhone = document.getElementById('edit-phone')?.value;
                  const newHeight = document.getElementById('edit-height')?.value;
                  const newWeight = document.getElementById('edit-weight')?.value;

                  const updatedData = {
                    ...patientData,
                    name: newName || patientData.name,
                    email: newEmail || patientData.email,
                    phone: newPhone || patientData.phone,
                    height: newHeight || patientData.height,
                    weight: newWeight || patientData.weight,
                  };

                  setPatientData(updatedData);
                  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                  localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedData }));
                  window.dispatchEvent(new Event('storage'));

                  setActiveProfileView(null);
                }}
                className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
              >
                {isRtl ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeProfileView === 'health') {
      const allConditions = [...healthConditions, ...conditionInputs];
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative pb-28">
          {/* Absolute Back Button */}
          <button
            onClick={() => {
              setActiveProfileView(null);
              setIsEditingHealth(false);
              setConditionInputs([]);
            }}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors z-10"
          >
            <ChevronLeft size={32} className={isRtl ? 'rotate-180' : ''} />
          </button>

          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-16 flex flex-col items-center">
            {/* Header Icon & Text */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#F0F5FA] rounded-full flex items-center justify-center mb-5">
                <Heart size={32} className="text-[#004A87]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{isRtl ? 'الحالات الصحية' : 'Health Conditions'}</h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base">{isRtl ? 'حالاتك الصحية' : 'Your health conditions'}</p>
            </div>

            {/* Conditions List or Empty State */}
            <div className="w-full flex-1 flex flex-col pb-24">
              {isEditingHealth && conditionInputs.length === 0 && healthConditions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <Info size={64} className="text-slate-400 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-slate-400 mb-2 text-center">{isRtl ? 'لم تتم إضافة حالات صحية بعد' : 'No health conditions added yet'}</h3>
                  <p className="text-slate-400 text-center font-medium">{isRtl ? 'اضغط على + لإضافة حالة' : 'Tap + to add one'}</p>
                </div>
              ) : !isEditingHealth && healthConditions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <Info size={64} className="text-slate-400 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-slate-400 mb-2 text-center">{isRtl ? 'لم تتم إضافة حالات صحية بعد' : 'No health conditions added yet'}</h3>
                  <p className="text-slate-400 text-center font-medium">{isRtl ? 'اضغط على تعديل لإضافة حالة' : 'Tap Edit to add one'}</p>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  {/* Saved conditions */}
                  {healthConditions.map((cond, idx) => (
                    <div key={`saved-${idx}`} className="flex items-center gap-3">
                      <div className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium">
                        {cond}
                      </div>
                      {isEditingHealth && (
                        <button
                          onClick={() => setHealthConditions(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <span className="text-2xl font-light leading-none">✕</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {/* New input rows */}
                  {conditionInputs.map((val, idx) => (
                    <div key={`input-${idx}`} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = [...conditionInputs];
                          updated[idx] = e.target.value;
                          setConditionInputs(updated);
                        }}
                        placeholder={isRtl ? 'اسم الحالة' : 'Condition name'}
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      <button
                        onClick={() => setConditionInputs(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <span className="text-2xl font-light leading-none">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {isEditingHealth ? (
            <>
              {/* + FAB */}
              <button
                onClick={() => setConditionInputs(prev => [...prev, ''])}
                className={`fixed bottom-24 ${isRtl ? 'left-8' : 'right-8'} w-14 h-14 bg-[#004A87] text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#003a6b] transition-transform hover:scale-110 active:scale-95 z-20`}
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
              {/* SAVE button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100">
                <div className="w-full max-w-lg mx-auto p-6">
                  <button
                    onClick={() => {
                      const newConditions = conditionInputs.filter(c => c.trim() !== '');
                      setHealthConditions(prev => [...prev, ...newConditions]);
                      setConditionInputs([]);
                      setIsEditingHealth(false);
                    }}
                    className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isRtl ? 'حفظ' : 'SAVE'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <div className="w-full max-w-lg mx-auto p-6">
                <button
                  onClick={() => setIsEditingHealth(true)}
                  className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isRtl ? 'تعديل' : 'Edit'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeProfileView === 'allergies') {
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative pb-28">
          {/* Absolute Back Button */}
          <button
            onClick={() => {
              setActiveProfileView(null);
              setIsEditingAllergies(false);
              setAllergyInputs([]);
            }}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors z-10"
          >
            <ChevronLeft size={32} className={isRtl ? 'rotate-180' : ''} />
          </button>

          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-16 flex flex-col items-center">
            {/* Header Icon & Text */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#F0F5FA] rounded-full flex items-center justify-center mb-5">
                <AlertCircle size={32} className="text-[#004A87]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{isRtl ? 'الحساسية' : 'Allergies'}</h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base">{isRtl ? 'حالات الحساسية لديك' : 'Your allergy conditions'}</p>
            </div>

            {/* Allergies List or Empty State */}
            <div className="w-full flex-1 flex flex-col pb-24">
              {isEditingAllergies && allergyInputs.length === 0 && allergies.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <Info size={64} className="text-slate-400 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-slate-400 mb-2 text-center">{isRtl ? 'لم تتم إضافة حساسية بعد' : 'No allergies added yet'}</h3>
                  <p className="text-slate-400 text-center font-medium">{isRtl ? 'اضغط على + لإضافة حساسية' : 'Tap + to add one'}</p>
                </div>
              ) : !isEditingAllergies && allergies.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <Info size={64} className="text-slate-400 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-slate-400 mb-2 text-center">{isRtl ? 'لم تتم إضافة حساسية بعد' : 'No allergies added yet'}</h3>
                  <p className="text-slate-400 text-center font-medium">{isRtl ? 'اضغط على تعديل لإضافة حساسية' : 'Tap Edit to add one'}</p>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  {/* Saved allergies */}
                  {allergies.map((allergy, idx) => (
                    <div key={`saved-${idx}`} className="flex items-center gap-3">
                      <div className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium">
                        {allergy}
                      </div>
                      {isEditingAllergies && (
                        <button
                          onClick={() => setAllergies(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <span className="text-2xl font-light leading-none">✕</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {/* New input rows */}
                  {allergyInputs.map((val, idx) => (
                    <div key={`input-${idx}`} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = [...allergyInputs];
                          updated[idx] = e.target.value;
                          setAllergyInputs(updated);
                        }}
                        placeholder={isRtl ? 'اسم الحساسية' : 'Allergy name'}
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      <button
                        onClick={() => setAllergyInputs(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <span className="text-2xl font-light leading-none">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {isEditingAllergies ? (
            <>
              {/* + FAB */}
              <button
                onClick={() => setAllergyInputs(prev => [...prev, ''])}
                className={`fixed bottom-24 ${isRtl ? 'left-8' : 'right-8'} w-14 h-14 bg-[#004A87] text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#003a6b] transition-transform hover:scale-110 active:scale-95 z-20`}
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
              {/* SAVE button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100">
                <div className="w-full max-w-lg mx-auto p-6">
                  <button
                    onClick={() => {
                      const newAllergies = allergyInputs.filter(a => a.trim() !== '');
                      setAllergies(prev => [...prev, ...newAllergies]);
                      setAllergyInputs([]);
                      setIsEditingAllergies(false);
                    }}
                    className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isRtl ? 'حفظ' : 'SAVE'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <div className="w-full max-w-lg mx-auto p-6">
                <button
                  onClick={() => setIsEditingAllergies(true)}
                  className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isRtl ? 'تعديل' : 'Edit'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeProfileView === 'radiology') {
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative pb-28">
          {/* Back Button */}
          <button
            onClick={() => {
              setActiveProfileView(null);
              setRadiologyDrafts([]);
              setIsEditingRadiology(false);
            }}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors z-10"
          >
            <ChevronLeft size={32} className={isRtl ? 'rotate-180' : ''} />
          </button>

          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-16 flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#EEF3FA] rounded-full flex items-center justify-center mb-5">
                <Activity size={32} className="text-[#004A87]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{isRtl ? 'الأشعة' : 'Radiology'}</h2>
              <p className="text-slate-400 font-medium text-sm">{isRtl ? 'صور الأشعة' : 'Radiology images'}</p>
            </div>

            {/* Entries */}
            <div className="w-full space-y-4 pb-28">
              {/* Saved entries */}
              {radiologyEntries.map((entry, idx) => (
                <div key={`saved-${idx}`} className="w-full border border-slate-200 rounded-2xl p-4">
                  {/* Image preview */}
                  <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-slate-100">
                    {entry.image ? (
                      <img src={entry.image} alt="radiology" className="w-full h-full object-cover" />
                    ) : (
                      <CloudUpload size={40} className="text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>
                  {/* Description */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{isRtl ? 'الوصف' : 'Description'}</span>
                  </div>
                  <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-medium min-h-[60px] bg-white">
                    {entry.description}
                  </div>
                </div>
              ))}

              {/* Draft entries (being edited) */}
              {radiologyDrafts.map((draft, idx) => (
                <div key={`draft-${idx}`} className="w-full border border-slate-200 rounded-2xl p-4">
                  {/* Image upload area */}
                  <label className="cursor-pointer block">
                    <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-dashed border-slate-300 hover:border-[#004A87]/40 transition-colors">
                      {draft.image ? (
                        <img src={draft.image} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <CloudUpload size={40} className="text-slate-300" strokeWidth={1.5} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updated = [...radiologyDrafts];
                            updated[idx] = { ...updated[idx], image: reader.result };
                            setRadiologyDrafts(updated);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Description label + Remove */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{isRtl ? 'الوصف' : 'Description'}</span>
                    <button
                      onClick={() => setRadiologyDrafts(prev => prev.filter((_, i) => i !== idx))}
                      className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={14} />
                      {isRtl ? 'حذف' : 'Remove'}
                    </button>
                  </div>

                  {/* Description textarea */}
                  <textarea
                    value={draft.description}
                    onChange={(e) => {
                      const updated = [...radiologyDrafts];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setRadiologyDrafts(updated);
                    }}
                    rows={2}
                    placeholder={isRtl ? 'أضف وصفاً...' : 'Add a description...'}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 resize-none bg-white"
                  />
                </div>
              ))}

              {/* Empty state */}
              {radiologyEntries.length === 0 && radiologyDrafts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Info size={56} className="text-slate-300 mb-4" strokeWidth={1.5} />
                  <p className="text-slate-400 font-medium text-center">{isRtl ? 'اضغط + لإضافة صورة أشعة' : 'Tap + to add a radiology image'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {isEditingRadiology ? (
            <>
              {/* + FAB */}
              <button
                onClick={() => setRadiologyDrafts(prev => [...prev, { image: null, description: '' }])}
                className={`fixed bottom-24 ${isRtl ? 'left-8' : 'right-8'} w-14 h-14 bg-[#004A87] text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#003a6b] transition-transform hover:scale-110 active:scale-95 z-20`}
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
              {/* SAVE button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100">
                <div className="w-full max-w-lg mx-auto p-6">
                  <button
                    onClick={() => {
                      const validDrafts = radiologyDrafts.filter(d => d.image || d.description.trim());
                      setRadiologyEntries(prev => [...prev, ...validDrafts]);
                      setRadiologyDrafts([]);
                      setIsEditingRadiology(false);
                    }}
                    className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isRtl ? 'حفظ' : 'SAVE'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <div className="w-full max-w-lg mx-auto p-6">
                <button
                  onClick={() => setIsEditingRadiology(true)}
                  className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isRtl ? 'تعديل' : 'Edit'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeProfileView === 'lab') {
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative pb-28">
          {/* Back Button */}
          <button
            onClick={() => {
              setActiveProfileView(null);
              setLabDrafts([]);
              setIsEditingLab(false);
            }}
            className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors z-10"
          >
            <ChevronLeft size={32} className={isRtl ? 'rotate-180' : ''} />
          </button>

          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-16 flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#EEF3FA] rounded-full flex items-center justify-center mb-5">
                <FlaskConical size={32} className="text-[#004A87]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{isRtl ? 'التحاليل' : 'Lab Tests'}</h2>
              <p className="text-slate-400 font-medium text-sm">{isRtl ? 'نتائج التحاليل' : 'Lab test results'}</p>
            </div>

            {/* Entries */}
            <div className="w-full space-y-4 pb-28">
              {/* Saved entries */}
              {labEntries.map((entry, idx) => (
                <div key={`saved-${idx}`} className="w-full border border-slate-200 rounded-2xl p-4">
                  <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-slate-100">
                    {entry.image ? (
                      <img src={entry.image} alt="lab" className="w-full h-full object-cover" />
                    ) : (
                      <CloudUpload size={40} className="text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{isRtl ? 'الوصف' : 'Description'}</span>
                  </div>
                  <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-medium min-h-[60px] bg-white">
                    {entry.description}
                  </div>
                </div>
              ))}

              {/* Draft entries */}
              {labDrafts.map((draft, idx) => (
                <div key={`draft-${idx}`} className="w-full border border-slate-200 rounded-2xl p-4">
                  {/* Image upload area */}
                  <label className="cursor-pointer block">
                    <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-dashed border-slate-300 hover:border-[#004A87]/40 transition-colors">
                      {draft.image ? (
                        <img src={draft.image} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <CloudUpload size={40} className="text-slate-300" strokeWidth={1.5} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updated = [...labDrafts];
                            updated[idx] = { ...updated[idx], image: reader.result };
                            setLabDrafts(updated);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Description label + Remove */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{isRtl ? 'الوصف' : 'Description'}</span>
                    <button
                      onClick={() => setLabDrafts(prev => prev.filter((_, i) => i !== idx))}
                      className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={14} />
                      {isRtl ? 'حذف' : 'Remove'}
                    </button>
                  </div>

                  {/* Description textarea */}
                  <textarea
                    value={draft.description}
                    onChange={(e) => {
                      const updated = [...labDrafts];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setLabDrafts(updated);
                    }}
                    rows={2}
                    placeholder={isRtl ? 'أضف وصفاً...' : 'Add a description...'}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 resize-none bg-white"
                  />
                </div>
              ))}

              {/* Empty state */}
              {labEntries.length === 0 && labDrafts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Info size={56} className="text-slate-300 mb-4" strokeWidth={1.5} />
                  <p className="text-slate-400 font-medium text-center">{isRtl ? 'اضغط + لإضافة تحليل' : 'Tap + to add a lab test result'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {isEditingLab ? (
            <>
              {/* + FAB */}
              <button
                onClick={() => setLabDrafts(prev => [...prev, { image: null, description: '' }])}
                className={`fixed bottom-24 ${isRtl ? 'left-8' : 'right-8'} w-14 h-14 bg-[#004A87] text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-[#003a6b] transition-transform hover:scale-110 active:scale-95 z-20`}
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
              {/* SAVE button */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100">
                <div className="w-full max-w-lg mx-auto p-6">
                  <button
                    onClick={() => {
                      const validDrafts = labDrafts.filter(d => d.image || d.description.trim());
                      setLabEntries(prev => [...prev, ...validDrafts]);
                      setLabDrafts([]);
                      setIsEditingLab(false);
                    }}
                    className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isRtl ? 'حفظ' : 'SAVE'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <div className="w-full max-w-lg mx-auto p-6">
                <button
                  onClick={() => setIsEditingLab(true)}
                  className="w-full bg-[#004A87] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isRtl ? 'تعديل' : 'Edit'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeProfileView === 'password') {
      return (
        <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 pt-8 pb-6">
            <button
              onClick={() => {
                setActiveProfileView(null);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-800 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h2 className="text-xl font-bold text-slate-900">{isRtl ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
          </div>

          {/* Fields */}
          <div className="flex-1 w-full max-w-lg mx-auto px-6 pt-4 space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'كلمة المرور الحالية' : 'Current Password'}</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={isRtl ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-700 font-medium placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrentPw ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isRtl ? 'أدخل كلمة مرور جديدة' : 'Enter new password'}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-700 font-medium placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPw ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-700 font-medium placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPw ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {passwordError && (
              <p className="text-red-500 text-sm font-medium">{passwordError}</p>
            )}

            {/* Update Password Button */}
            <button
              onClick={() => {
                setPasswordError('');
                if (!currentPassword || !newPassword || !confirmPassword) {
                  setPasswordError(isRtl ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPasswordError(isRtl ? 'كلمتا المرور الجديدتان غير متطابقتين' : 'New passwords do not match');
                  return;
                }
                if (newPassword.length < 6) {
                  setPasswordError(isRtl ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
                  return;
                }
                // Success
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setActiveProfileView(null);
              }}
              className="w-full bg-[#004A87] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#004A87]/20"
            >
              {isRtl ? 'تحديث كلمة المرور' : 'Update Password'}
            </button>
          </div>
        </div>
      );
    }

    const profileItems = [
      { id: 'basic', icon: User, label: isRtl ? 'تعديل المعلومات الأساسية' : 'Edit Basic Information' },
      { id: 'health', icon: Heart, label: isRtl ? 'تعديل الحالات الصحية' : 'Edit Health Conditions' },
      { id: 'allergies', icon: AlertCircle, label: isRtl ? 'تعديل الحساسية' : 'Edit Allergies' },
      { id: 'radiology', icon: Activity, label: isRtl ? 'تعديل الأشعة' : 'Edit Radiology' },
      { id: 'lab', icon: FlaskConical, label: isRtl ? 'تعديل التحاليل' : 'Edit Lab Tests' },
      { id: 'password', icon: Lock, label: isRtl ? 'تغيير كلمة المرور' : 'Change Password' },
      { id: 'notifications', icon: Bell, label: isRtl ? 'إعدادات الإشعارات' : 'Notification Settings' },
      { id: 'delete', icon: Trash2, label: isRtl ? 'حذف الحساب' : 'Delete Account' },
    ];

    return (
      <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)]">
        {/* Blue Header Section */}
        <div className="bg-[#004A87] w-full pt-12 pb-10 rounded-b-[40px] flex flex-col items-center justify-center shrink-0 relative z-10 shadow-md">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 mb-4">
            <img alt={patientData.name} className="w-full h-full object-cover" src={patientData.avatar || DEFAULT_AVATAR} />
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">{patientData.name}</h2>
        </div>

        {/* List Section */}
        <div className="flex-1 w-full px-4 sm:px-8 py-8 bg-white">
          <div className="w-full space-y-4">
            {profileItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.id === 'delete') {
                    setShowDeleteConfirm(true);
                  } else {
                    setActiveProfileView(item.id);
                  }
                }}
                className={`flex items-center justify-between cursor-pointer group hover:bg-slate-50 p-4 rounded-2xl transition-colors border-b border-slate-50 last:border-0 ${item.id === 'delete' ? 'hover:bg-red-50' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <item.icon size={26} className={item.id === 'delete' ? 'text-red-500' : 'text-slate-800'} strokeWidth={1.5} />
                  <span className={`text-lg font-medium ${item.id === 'delete' ? 'text-red-500' : 'text-slate-800'}`}>{item.label}</span>
                </div>
                <ChevronRight size={22} className={`text-slate-400 group-hover:text-slate-800 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Delete Account Bottom Sheet */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] p-8 z-10"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                  <Trash2 size={36} className="text-red-500" strokeWidth={1.5} />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-slate-900 text-center mb-3">
                {isRtl ? 'حذف الحساب' : 'Delete Account'}
              </h3>
              <p className="text-slate-500 text-center font-medium mb-8 leading-relaxed">
                {isRtl
                  ? 'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.'
                  : 'Are you sure you want to delete your account? This action cannot be undone.'}
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
                >
                  {isRtl ? 'نعم، احذف حسابي' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  const renderChatsContent = () => {
    const doctors = [
      { name: isRtl ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan', specialty: isRtl ? 'أخصائي أمراض القلب' : 'Cardiology Specialist', img: '/assets/IMG_9401.PNG' },
      { name: isRtl ? 'د. سارة محمد' : 'Dr. Sara Mohamed', specialty: isRtl ? 'استشاري المخ والأعصاب' : 'Neurology Consultant', img: null },
      { name: isRtl ? 'د. عمر علي' : 'Dr. Omar Ali', specialty: isRtl ? 'طب باطني' : 'Internal Medicine', img: null },
      { name: isRtl ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan', specialty: isRtl ? 'أخصائي أمراض القلب' : 'Cardiology Specialist', img: '/assets/IMG_9401.PNG' },
      { name: isRtl ? 'د. سارة محمد' : 'Dr. Sara Mohamed', specialty: isRtl ? 'استشاري المخ والأعصاب' : 'Neurology Consultant', img: null },
      { name: isRtl ? 'د. عمر علي' : 'Dr. Omar Ali', specialty: isRtl ? 'طب باطني' : 'Internal Medicine', img: null },
    ];

    if (activeChatDoctor) {
      return (
        <div className="max-w-3xl mx-auto w-full h-[calc(100vh-120px)] flex flex-col bg-[#F5F7FA] rounded-3xl overflow-hidden shadow-sm border border-slate-200">
          {/* Chat Header */}
          <div className="bg-[#004A87] text-white px-6 py-4 flex items-center justify-between shrink-0">
            <button
              onClick={() => setActiveChatDoctor(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={24} className={isRtl ? 'rotate-180' : ''} />
            </button>
            <h3 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">{activeChatDoctor.name}</h3>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white shrink-0 z-10">
              {activeChatDoctor.img ? (
                <img src={activeChatDoctor.img} alt={activeChatDoctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#004A87]">
                  <User size={24} />
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            {/* Received Message */}
            <div className="flex">
              <div className="bg-white text-slate-800 px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[80%] border border-slate-100">
                <p className="font-medium">{isRtl ? 'ما هي شكواك؟' : 'What is your complaint?'}</p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="bg-white p-4 border-t border-slate-100 flex items-center gap-3 shrink-0">
            <input
              type="text"
              placeholder={isRtl ? 'اكتب رسالتك...' : 'Type your message...'}
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 font-medium placeholder:text-slate-400"
            />
            <button className="w-12 h-12 rounded-full bg-[#004A87] text-white flex items-center justify-center hover:bg-[#003a6b] transition-colors shrink-0 shadow-md">
              <Send size={20} className={isRtl ? 'rotate-180 -ml-1' : 'ml-1'} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto w-full pb-24">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-[#004A87]">{isRtl ? 'أطبائي' : 'My Doctors'}</h3>
        </div>

        <div className="space-y-4">
          {doctors.map((doc, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-4 sm:p-5 flex items-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-50 flex items-center justify-center">
                {doc.img ? (
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-slate-400" />
                )}
              </div>
              <div className={`flex-1 ${isRtl ? 'pr-4 sm:pr-6' : 'pl-4 sm:pl-6'}`}>
                <h4 className="font-bold text-slate-900 text-lg sm:text-xl">{doc.name}</h4>
                <p className="text-slate-500 text-sm sm:text-base font-medium">{doc.specialty}</p>
              </div>
              <button
                onClick={() => setActiveChatDoctor(doc)}
                className="bg-[#004A87] text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-2xl font-bold shadow-md shadow-[#004A87]/20 hover:bg-[#003a6b] transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                {isRtl ? 'محادثة' : 'Chat'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const egyptHospitals = [
    { name: 'Kasr Al Ainy Hospital', city: 'Cairo', type: 'Government', phone: '+20 2 2365 0000' },
    { name: 'Al-Galaa Military Hospital', city: 'Cairo', type: 'Military', phone: '+20 2 2402 5000' },
    { name: 'Cairo University Hospitals', city: 'Cairo', type: 'University', phone: '+20 2 2368 8888' },
    { name: 'Ain Shams University Hospital', city: 'Cairo', type: 'University', phone: '+20 2 2482 1234' },
    { name: 'Dar El Fouad Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 3827 1000' },
    { name: 'Cleopatra Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2414 4000' },
    { name: 'As-Salam International Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2524 0250' },
    { name: 'Al-Maadi Military Hospital', city: 'Cairo', type: 'Military', phone: '+20 2 2358 0000' },
    { name: 'Nasser Institute Hospital', city: 'Cairo', type: 'Government', phone: '+20 2 2678 2000' },
    { name: 'National Cancer Institute', city: 'Cairo', type: 'Government', phone: '+20 2 2364 5555' },
    { name: 'El-Demerdash Hospital', city: 'Cairo', type: 'University', phone: '+20 2 2482 9999' },
    { name: 'Theodor Bilharz Research Institute', city: 'Cairo', type: 'Research', phone: '+20 2 3540 1019' },
    { name: 'International Medical Center', city: 'Cairo', type: 'Private', phone: '+20 2 2618 6600' },
    { name: 'Mounira Hospital', city: 'Cairo', type: 'Government', phone: '+20 2 2794 5678' },
    { name: 'Heliopolis Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2290 1234' },
    { name: 'Maadi Military Hospital', city: 'Cairo', type: 'Military', phone: '+20 2 2358 1111' },
    { name: 'Bab Al Shaaria University Hospital', city: 'Cairo', type: 'University', phone: '+20 2 2511 0000' },
    { name: 'El Salam International Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2524 0111' },
    { name: 'Cairo Specialized Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2415 5678' },
    { name: 'Police Hospital', city: 'Cairo', type: 'Government', phone: '+20 2 2360 8888' },
    { name: 'Alexandria University Hospital', city: 'Alexandria', type: 'University', phone: '+20 3 4871 234' },
    { name: 'Medical Research Institute', city: 'Alexandria', type: 'Research', phone: '+20 3 4283 000' },
    { name: 'El-Hadara University Hospital', city: 'Alexandria', type: 'University', phone: '+20 3 5921 000' },
    { name: 'Alexandria International Hospital', city: 'Alexandria', type: 'Private', phone: '+20 3 5872 000' },
    { name: 'Smouha Medical Center', city: 'Alexandria', type: 'Private', phone: '+20 3 4283 999' },
    { name: 'Military Medical Academy Hospital', city: 'Alexandria', type: 'Military', phone: '+20 3 5470 000' },
    { name: 'Al-Anfoushy Hospital', city: 'Alexandria', type: 'Government', phone: '+20 3 4811 000' },
    { name: 'Maamoura Hospital', city: 'Alexandria', type: 'Government', phone: '+20 3 5470 999' },
    { name: 'Al-Raml Hospital', city: 'Alexandria', type: 'Government', phone: '+20 3 4830 000' },
    { name: 'Borg El Arab Hospital', city: 'Alexandria', type: 'Private', phone: '+20 3 4591 000' },
    { name: 'Mansoura University Hospital', city: 'Mansoura', type: 'University', phone: '+20 50 224 5678' },
    { name: 'Mansoura International Hospital', city: 'Mansoura', type: 'Private', phone: '+20 50 236 7890' },
    { name: 'Al-Gomhouria Hospital Mansoura', city: 'Mansoura', type: 'Government', phone: '+20 50 223 4567' },
    { name: 'Delta Medical Center', city: 'Mansoura', type: 'Private', phone: '+20 50 235 6789' },
    { name: 'Kidney and Urology Center Mansoura', city: 'Mansoura', type: 'Specialized', phone: '+20 50 224 0000' },
    { name: 'Tanta University Hospital', city: 'Tanta', type: 'University', phone: '+20 40 333 1234' },
    { name: 'Al-Gharbia General Hospital', city: 'Tanta', type: 'Government', phone: '+20 40 332 5678' },
    { name: 'Tanta Fever Hospital', city: 'Tanta', type: 'Government', phone: '+20 40 333 9999' },
    { name: 'El-Mahalla General Hospital', city: 'El-Mahalla', type: 'Government', phone: '+20 40 222 1234' },
    { name: 'Kafr El-Sheikh General Hospital', city: 'Kafr El-Sheikh', type: 'Government', phone: '+20 47 321 5678' },
    { name: 'Luxor International Hospital', city: 'Luxor', type: 'Private', phone: '+20 95 238 0000' },
    { name: 'Luxor General Hospital', city: 'Luxor', type: 'Government', phone: '+20 95 237 5678' },
    { name: 'Aswan University Hospital', city: 'Aswan', type: 'University', phone: '+20 97 231 2345' },
    { name: 'Aswan General Hospital', city: 'Aswan', type: 'Government', phone: '+20 97 231 0000' },
    { name: 'Aswan Heart Centre', city: 'Aswan', type: 'Specialized', phone: '+20 97 231 9999' },
    { name: 'Sohag University Hospital', city: 'Sohag', type: 'University', phone: '+20 93 460 1234' },
    { name: 'Sohag General Hospital', city: 'Sohag', type: 'Government', phone: '+20 93 460 5678' },
    { name: 'Qena University Hospital', city: 'Qena', type: 'University', phone: '+20 96 533 2345' },
    { name: 'Qena General Hospital', city: 'Qena', type: 'Government', phone: '+20 96 533 0000' },
    { name: 'Minya University Hospital', city: 'Minya', type: 'University', phone: '+20 86 234 5678' },
    { name: 'Minya General Hospital', city: 'Minya', type: 'Government', phone: '+20 86 235 0000' },
    { name: 'Beni Suef University Hospital', city: 'Beni Suef', type: 'University', phone: '+20 82 232 1234' },
    { name: 'Beni Suef General Hospital', city: 'Beni Suef', type: 'Government', phone: '+20 82 232 5678' },
    { name: 'Fayoum University Hospital', city: 'Fayoum', type: 'University', phone: '+20 84 634 1234' },
    { name: 'Fayoum General Hospital', city: 'Fayoum', type: 'Government', phone: '+20 84 634 5678' },
    { name: 'Zagazig University Hospital', city: 'Zagazig', type: 'University', phone: '+20 55 236 1234' },
    { name: 'Zagazig General Hospital', city: 'Zagazig', type: 'Government', phone: '+20 55 235 5678' },
    { name: 'Port Said General Hospital', city: 'Port Said', type: 'Government', phone: '+20 66 322 1234' },
    { name: 'Port Said Military Hospital', city: 'Port Said', type: 'Military', phone: '+20 66 322 5678' },
    { name: 'Suez Canal University Hospital', city: 'Suez', type: 'University', phone: '+20 62 322 1234' },
    { name: 'Suez General Hospital', city: 'Suez', type: 'Government', phone: '+20 62 323 5678' },
    { name: 'Ismailia General Hospital', city: 'Ismailia', type: 'Government', phone: '+20 64 391 2345' },
    { name: 'Suez Canal Hospital Ismailia', city: 'Ismailia', type: 'Government', phone: '+20 64 391 0000' },
    { name: 'Hurghada International Hospital', city: 'Hurghada', type: 'Private', phone: '+20 65 354 9100' },
    { name: 'Hurghada General Hospital', city: 'Hurghada', type: 'Government', phone: '+20 65 354 5678' },
    { name: 'Sharm El-Sheikh International Hospital', city: 'Sharm El-Sheikh', type: 'Private', phone: '+20 69 366 0803' },
    { name: 'Sharm El-Sheikh General Hospital', city: 'Sharm El-Sheikh', type: 'Government', phone: '+20 69 366 0911' },
    { name: 'Marsa Matrouh General Hospital', city: 'Marsa Matrouh', type: 'Government', phone: '+20 46 493 3000' },
    { name: 'Damanhur Teaching Hospital', city: 'Damanhur', type: 'University', phone: '+20 45 330 1234' },
    { name: 'Damanhur General Hospital', city: 'Damanhur', type: 'Government', phone: '+20 45 330 5678' },
    { name: 'Shebin El-Kom Teaching Hospital', city: 'Shebin El-Kom', type: 'University', phone: '+20 48 222 1234' },
    { name: 'Assiut University Hospital', city: 'Assiut', type: 'University', phone: '+20 88 241 2345' },
    { name: 'Assiut General Hospital', city: 'Assiut', type: 'Government', phone: '+20 88 241 0000' },
    { name: 'South Valley University Hospital', city: 'Qena', type: 'University', phone: '+20 96 533 8888' },
    { name: 'Al-Rajhi Oncology Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 3749 0000' },
    { name: 'Children Cancer Hospital (57357)', city: 'Cairo', type: 'Specialized', phone: '+20 2 2535 7357' },
    { name: 'Magdi Yacoub Heart Foundation', city: 'Aswan', type: 'Specialized', phone: '+20 97 231 1357' },
    { name: 'Bahrain Hospital Egypt', city: 'Cairo', type: 'Private', phone: '+20 2 3827 0000' },
    { name: 'Saudi German Hospital Cairo', city: 'Cairo', type: 'Private', phone: '+20 2 2690 0000' },
    { name: 'Saudi German Hospital Alexandria', city: 'Alexandria', type: 'Private', phone: '+20 3 5470 1234' },
    { name: 'El Gouna Hospital', city: 'El Gouna', type: 'Private', phone: '+20 65 358 0012' },
    { name: 'Magrabi Eye Hospital Cairo', city: 'Cairo', type: 'Specialized', phone: '+20 2 2519 7777' },
    { name: 'Magrabi Eye Hospital Alexandria', city: 'Alexandria', type: 'Specialized', phone: '+20 3 4827 777' },
    { name: 'Air Force Specialized Hospital', city: 'Cairo', type: 'Military', phone: '+20 2 2267 9000' },
    { name: 'Al Salam Hospital Alexandria', city: 'Alexandria', type: 'Private', phone: '+20 3 5470 2222' },
    { name: 'Benha University Hospital', city: 'Benha', type: 'University', phone: '+20 13 322 1234' },
    { name: 'El-Menoufia University Hospital', city: 'Shebin El-Kom', type: 'University', phone: '+20 48 222 9999' },
    { name: 'Kafr El-Sheikh University Hospital', city: 'Kafr El-Sheikh', type: 'University', phone: '+20 47 321 9999' },
    { name: 'Modern Cairo Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2415 1111' },
    { name: 'El-Nozha International Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2290 5678' },
    { name: 'Mataria Teaching Hospital', city: 'Cairo', type: 'University', phone: '+20 2 2636 0000' },
    { name: 'Embaba General Hospital', city: 'Giza', type: 'Government', phone: '+20 2 3309 0000' },
    { name: 'Giza General Hospital', city: 'Giza', type: 'Government', phone: '+20 2 3587 5678' },
    { name: 'October 6 University Hospital', city: '6th October', type: 'University', phone: '+20 38 820 000' },
    { name: 'New Cairo Specialized Hospital', city: 'New Cairo', type: 'Private', phone: '+20 2 2618 9999' },
    { name: 'Maadi Specialized Hospital', city: 'Cairo', type: 'Private', phone: '+20 2 2380 1234' },
    { name: 'Sheikh Zayed Specialized Hospital', city: 'Sheikh Zayed', type: 'Government', phone: '+20 38 514 0000' },
    { name: 'New Valley General Hospital', city: 'Kharga', type: 'Government', phone: '+20 92 792 1234' },
    { name: 'Damietta University Hospital', city: 'Damietta', type: 'University', phone: '+20 57 222 9999' },
    { name: 'Al Salam Specialized Hospital Zagazig', city: 'Zagazig', type: 'Private', phone: '+20 55 237 1111' },
  ];

  const egyptMedicals = [
    { name: 'Panadol', generic: 'Paracetamol', category: 'Painkiller', dosage: '500mg', description: 'Pain & fever relief' },
    { name: 'Brufen', generic: 'Ibuprofen', category: 'Anti-inflammatory', dosage: '400mg', description: 'Pain, fever & inflammation' },
    { name: 'Voltaren', generic: 'Diclofenac', category: 'Anti-inflammatory', dosage: '50mg', description: 'Joint & muscle pain' },
    { name: 'Amoxil', generic: 'Amoxicillin', category: 'Antibiotic', dosage: '500mg', description: 'Bacterial infections' },
    { name: 'Augmentin', generic: 'Amoxicillin/Clavulanate', category: 'Antibiotic', dosage: '625mg', description: 'Broad-spectrum antibiotic' },
    { name: 'Ciprobay', generic: 'Ciprofloxacin', category: 'Antibiotic', dosage: '500mg', description: 'Urinary & respiratory infections' },
    { name: 'Zithromax', generic: 'Azithromycin', category: 'Antibiotic', dosage: '500mg', description: 'Respiratory infections' },
    { name: 'Flagyl', generic: 'Metronidazole', category: 'Antibiotic', dosage: '500mg', description: 'Anaerobic bacterial infections' },
    { name: 'Nexium', generic: 'Esomeprazole', category: 'Antacid', dosage: '40mg', description: 'Acid reflux & ulcers' },
    { name: 'Omez', generic: 'Omeprazole', category: 'Antacid', dosage: '20mg', description: 'Stomach acid reducer' },
    { name: 'Zantac', generic: 'Ranitidine', category: 'Antacid', dosage: '150mg', description: 'Heartburn & acid reduction' },
    { name: 'Gaviscon', generic: 'Alginate/Antacid', category: 'Antacid', dosage: 'Suspension', description: 'Heartburn & indigestion' },
    { name: 'Metformin', generic: 'Metformin HCl', category: 'Diabetes', dosage: '500mg', description: 'Type 2 diabetes management' },
    { name: 'Glucovance', generic: 'Metformin/Glibenclamide', category: 'Diabetes', dosage: '500/5mg', description: 'Type 2 diabetes' },
    { name: 'Lantus', generic: 'Insulin Glargine', category: 'Diabetes', dosage: '100IU/ml', description: 'Long-acting insulin' },
    { name: 'NovoRapid', generic: 'Insulin Aspart', category: 'Diabetes', dosage: '100IU/ml', description: 'Fast-acting insulin' },
    { name: 'Glucophage', generic: 'Metformin HCl', category: 'Diabetes', dosage: '1000mg', description: 'Blood sugar control' },
    { name: 'Concor', generic: 'Bisoprolol', category: 'Cardiology', dosage: '5mg', description: 'Heart failure & hypertension' },
    { name: 'Norvasc', generic: 'Amlodipine', category: 'Cardiology', dosage: '5mg', description: 'High blood pressure & angina' },
    { name: 'Plavix', generic: 'Clopidogrel', category: 'Cardiology', dosage: '75mg', description: 'Blood clot prevention' },
    { name: 'Aspirin Cardio', generic: 'Acetylsalicylic Acid', category: 'Cardiology', dosage: '100mg', description: 'Heart attack prevention' },
    { name: 'Coumadin', generic: 'Warfarin', category: 'Cardiology', dosage: '5mg', description: 'Blood thinner / anticoagulant' },
    { name: 'Lipitor', generic: 'Atorvastatin', category: 'Cholesterol', dosage: '20mg', description: 'Cholesterol reduction' },
    { name: 'Crestor', generic: 'Rosuvastatin', category: 'Cholesterol', dosage: '10mg', description: 'Cholesterol & triglycerides' },
    { name: 'Zocor', generic: 'Simvastatin', category: 'Cholesterol', dosage: '20mg', description: 'LDL cholesterol lowering' },
    { name: 'Tritace', generic: 'Ramipril', category: 'Hypertension', dosage: '5mg', description: 'High blood pressure & heart failure' },
    { name: 'Coversyl', generic: 'Perindopril', category: 'Hypertension', dosage: '5mg', description: 'Blood pressure control' },
    { name: 'Losartan', generic: 'Losartan Potassium', category: 'Hypertension', dosage: '50mg', description: 'Hypertension & kidney protection' },
    { name: 'Lasix', generic: 'Furosemide', category: 'Diuretic', dosage: '40mg', description: 'Fluid retention & edema' },
    { name: 'Aldactone', generic: 'Spironolactone', category: 'Diuretic', dosage: '25mg', description: 'Heart failure & edema' },
    { name: 'Ventolin', generic: 'Salbutamol', category: 'Respiratory', dosage: '100mcg', description: 'Asthma & bronchospasm' },
    { name: 'Symbicort', generic: 'Budesonide/Formoterol', category: 'Respiratory', dosage: '160/4.5mcg', description: 'Asthma maintenance' },
    { name: 'Seretide', generic: 'Fluticasone/Salmeterol', category: 'Respiratory', dosage: '250/25mcg', description: 'Asthma & COPD' },
    { name: 'Clarinase', generic: 'Loratadine/Pseudoephedrine', category: 'Allergy', dosage: '5/120mg', description: 'Allergic rhinitis' },
    { name: 'Telfast', generic: 'Fexofenadine', category: 'Allergy', dosage: '180mg', description: 'Allergies & hay fever' },
    { name: 'Zyrtec', generic: 'Cetirizine', category: 'Allergy', dosage: '10mg', description: 'Allergic conditions' },
    { name: 'Claritin', generic: 'Loratadine', category: 'Allergy', dosage: '10mg', description: 'Allergies & urticaria' },
    { name: 'Prozac', generic: 'Fluoxetine', category: 'Antidepressant', dosage: '20mg', description: 'Depression & anxiety' },
    { name: 'Zoloft', generic: 'Sertraline', category: 'Antidepressant', dosage: '50mg', description: 'Depression & panic disorder' },
    { name: 'Lexapro', generic: 'Escitalopram', category: 'Antidepressant', dosage: '10mg', description: 'Depression & anxiety disorders' },
    { name: 'Xanax', generic: 'Alprazolam', category: 'Anxiolytic', dosage: '0.5mg', description: 'Anxiety & panic attacks' },
    { name: 'Rivotril', generic: 'Clonazepam', category: 'Anticonvulsant', dosage: '0.5mg', description: 'Epilepsy & anxiety' },
    { name: 'Tegretol', generic: 'Carbamazepine', category: 'Anticonvulsant', dosage: '200mg', description: 'Epilepsy & nerve pain' },
    { name: 'Depakine', generic: 'Sodium Valproate', category: 'Anticonvulsant', dosage: '500mg', description: 'Epilepsy & bipolar disorder' },
    { name: 'Synthroid', generic: 'Levothyroxine', category: 'Thyroid', dosage: '50mcg', description: 'Hypothyroidism treatment' },
    { name: 'Neomercazole', generic: 'Carbimazole', category: 'Thyroid', dosage: '5mg', description: 'Hyperthyroidism' },
    { name: 'Forteo', generic: 'Teriparatide', category: 'Bone', dosage: '20mcg', description: 'Osteoporosis treatment' },
    { name: 'Fosamax', generic: 'Alendronate', category: 'Bone', dosage: '70mg', description: 'Osteoporosis prevention' },
    { name: 'Calcium Sandoz', generic: 'Calcium Carbonate', category: 'Supplement', dosage: '500mg', description: 'Calcium supplement' },
    { name: 'Vitamin D3 Drops', generic: 'Cholecalciferol', category: 'Supplement', dosage: '1000IU', description: 'Vitamin D deficiency' },
    { name: 'Ferro Grad', generic: 'Ferrous Sulfate', category: 'Supplement', dosage: '325mg', description: 'Iron deficiency anemia' },
    { name: 'Neurovit', generic: 'B1/B6/B12', category: 'Supplement', dosage: 'Complex', description: 'Nervous system support' },
    { name: 'Folic Acid', generic: 'Folic Acid', category: 'Supplement', dosage: '5mg', description: 'Pregnancy & anemia' },
    { name: 'Diflucan', generic: 'Fluconazole', category: 'Antifungal', dosage: '150mg', description: 'Fungal infections' },
    { name: 'Lamisil', generic: 'Terbinafine', category: 'Antifungal', dosage: '250mg', description: 'Skin & nail fungal infections' },
    { name: 'Zovirax', generic: 'Acyclovir', category: 'Antiviral', dosage: '400mg', description: 'Herpes virus treatment' },
    { name: 'Tamiflu', generic: 'Oseltamivir', category: 'Antiviral', dosage: '75mg', description: 'Influenza treatment' },
    { name: 'Zofran', generic: 'Ondansetron', category: 'Antiemetic', dosage: '8mg', description: 'Nausea & vomiting' },
    { name: 'Primperan', generic: 'Metoclopramide', category: 'Antiemetic', dosage: '10mg', description: 'Nausea & gastroparesis' },
    { name: 'Imodium', generic: 'Loperamide', category: 'GI', dosage: '2mg', description: 'Diarrhea treatment' },
    { name: 'Dulcolax', generic: 'Bisacodyl', category: 'GI', dosage: '5mg', description: 'Constipation relief' },
    { name: 'Lactulose', generic: 'Lactulose', category: 'GI', dosage: '15ml', description: 'Constipation & liver disease' },
    { name: 'Smecta', generic: 'Diosmectite', category: 'GI', dosage: '3g', description: 'Diarrhea & stomach pain' },
    { name: 'Buscopan', generic: 'Hyoscine Butylbromide', category: 'Antispasmodic', dosage: '10mg', description: 'Abdominal & bowel cramps' },
    { name: 'Colchicine', generic: 'Colchicine', category: 'Gout', dosage: '0.5mg', description: 'Gout treatment' },
    { name: 'Allopurinol', generic: 'Allopurinol', category: 'Gout', dosage: '300mg', description: 'Uric acid reduction' },
    { name: 'Prednisolone', generic: 'Prednisolone', category: 'Corticosteroid', dosage: '5mg', description: 'Inflammation & immune conditions' },
    { name: 'Dexamethasone', generic: 'Dexamethasone', category: 'Corticosteroid', dosage: '4mg', description: 'Severe inflammation' },
    { name: 'Hydrocortisone', generic: 'Hydrocortisone', category: 'Corticosteroid', dosage: '10mg', description: 'Allergic & inflammatory reactions' },
    { name: 'Humulin N', generic: 'Isophane Insulin', category: 'Diabetes', dosage: '100IU/ml', description: 'Intermediate-acting insulin' },
    { name: 'Victoza', generic: 'Liraglutide', category: 'Diabetes', dosage: '1.2mg', description: 'Type 2 diabetes & weight management' },
    { name: 'Januvia', generic: 'Sitagliptin', category: 'Diabetes', dosage: '100mg', description: 'Type 2 diabetes' },
    { name: 'Jardiance', generic: 'Empagliflozin', category: 'Diabetes', dosage: '10mg', description: 'Type 2 diabetes & heart protection' },
    { name: 'Efient', generic: 'Prasugrel', category: 'Cardiology', dosage: '10mg', description: 'Acute coronary syndrome' },
    { name: 'Brilinta', generic: 'Ticagrelor', category: 'Cardiology', dosage: '90mg', description: 'Heart attack prevention' },
    { name: 'Digoxin', generic: 'Digoxin', category: 'Cardiology', dosage: '0.25mg', description: 'Heart failure & atrial fibrillation' },
    { name: 'Amiodarone', generic: 'Amiodarone HCl', category: 'Cardiology', dosage: '200mg', description: 'Heart arrhythmia' },
    { name: 'Isosorbide', generic: 'Isosorbide Mononitrate', category: 'Cardiology', dosage: '20mg', description: 'Angina prevention' },
    { name: 'Aldazide', generic: 'Hydrochlorothiazide/Spironolactone', category: 'Diuretic', dosage: '25/25mg', description: 'Hypertension & edema' },
    { name: 'Diamox', generic: 'Acetazolamide', category: 'Diuretic', dosage: '250mg', description: 'Glaucoma & edema' },
    { name: 'Spiriva', generic: 'Tiotropium', category: 'Respiratory', dosage: '18mcg', description: 'COPD management' },
    { name: 'Singulair', generic: 'Montelukast', category: 'Respiratory', dosage: '10mg', description: 'Asthma & allergic rhinitis' },
    { name: 'Pulmicort', generic: 'Budesonide', category: 'Respiratory', dosage: '200mcg', description: 'Asthma prevention' },
    { name: 'Atrovent', generic: 'Ipratropium', category: 'Respiratory', dosage: '20mcg', description: 'COPD & bronchospasm' },
    { name: 'Nasonex', generic: 'Mometasone', category: 'Allergy', dosage: '50mcg', description: 'Nasal allergy symptoms' },
    { name: 'Avamys', generic: 'Fluticasone Furoate', category: 'Allergy', dosage: '27.5mcg', description: 'Allergic rhinitis' },
    { name: 'Efexor', generic: 'Venlafaxine', category: 'Antidepressant', dosage: '75mg', description: 'Depression & anxiety disorder' },
    { name: 'Remeron', generic: 'Mirtazapine', category: 'Antidepressant', dosage: '15mg', description: 'Depression & sleep disturbances' },
    { name: 'Risperdal', generic: 'Risperidone', category: 'Antipsychotic', dosage: '2mg', description: 'Schizophrenia & bipolar disorder' },
    { name: 'Abilify', generic: 'Aripiprazole', category: 'Antipsychotic', dosage: '10mg', description: 'Schizophrenia & depression' },
    { name: 'Aricept', generic: 'Donepezil', category: 'Neurology', dosage: '5mg', description: "Alzheimer's disease" },
    { name: 'Lyrica', generic: 'Pregabalin', category: 'Neurology', dosage: '75mg', description: 'Nerve pain & epilepsy' },
    { name: 'Requip', generic: 'Ropinirole', category: 'Neurology', dosage: '1mg', description: "Parkinson's disease" },
    { name: 'Madopar', generic: 'Levodopa/Benserazide', category: 'Neurology', dosage: '100/25mg', description: "Parkinson's disease" },
    { name: 'Enbrel', generic: 'Etanercept', category: 'Immunology', dosage: '50mg', description: 'Rheumatoid arthritis' },
    { name: 'Humira', generic: 'Adalimumab', category: 'Immunology', dosage: '40mg', description: 'Inflammatory conditions' },
    { name: 'Cellcept', generic: 'Mycophenolate', category: 'Immunosuppressant', dosage: '500mg', description: 'Organ transplant rejection' },
    { name: 'Cyclosporine', generic: 'Ciclosporin', category: 'Immunosuppressant', dosage: '100mg', description: 'Transplant & autoimmune disease' },
  ];

  const renderHospitalsContent = () => {
    const cities = ['All', ...Array.from(new Set(egyptHospitals.map(h => h.city)))];
    const filtered = egyptHospitals.filter(h =>
      (selectedCity === 'All' || h.city === selectedCity) &&
      (h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) || h.city.toLowerCase().includes(hospitalSearch.toLowerCase()))
    );
    const typeColor = { Government: 'bg-blue-100 text-blue-700', Private: 'bg-emerald-100 text-emerald-700', University: 'bg-purple-100 text-purple-700', Military: 'bg-slate-200 text-slate-700', Specialized: 'bg-amber-100 text-amber-700', Research: 'bg-pink-100 text-pink-700' };
    return (
      <div className="max-w-4xl mx-auto pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveTab('home')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className={`text-slate-700 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{isRtl ? 'مستشفيات مصر' : 'Hospitals in Egypt'}</h2>
            <p className="text-slate-500 text-sm font-medium">{egyptHospitals.length} {isRtl ? 'مستشفى' : 'hospitals'}</p>
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={hospitalSearch} onChange={e => setHospitalSearch(e.target.value)} placeholder={isRtl ? 'ابحث عن مستشفى...' : 'Search hospitals...'} className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-sm font-medium" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {cities.map(city => (
            <button key={city} onClick={() => setSelectedCity(city)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCity === city ? 'bg-[#004A87] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#004A87]'}`}>{city}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((h, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 bg-[#004A87]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={22} className="text-[#004A87]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{h.name}</h4>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">{h.city}</p>
                    <p className="text-[#004A87] text-xs font-semibold mt-1">{h.phone}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${typeColor[h.type] || 'bg-slate-100 text-slate-600'}`}>{h.type}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Building2 size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">{isRtl ? 'لا توجد نتائج' : 'No results found'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMedicalsContent = () => {
    const categories = ['All', ...Array.from(new Set(egyptMedicals.map(m => m.category)))];
    const filtered = egyptMedicals.filter(m =>
      (selectedCategory === 'All' || m.category === selectedCategory) &&
      (m.name.toLowerCase().includes(medicalSearch.toLowerCase()) || m.generic.toLowerCase().includes(medicalSearch.toLowerCase()) || m.category.toLowerCase().includes(medicalSearch.toLowerCase()))
    );
    const categoryColor = { Painkiller: 'bg-red-100 text-red-700', 'Anti-inflammatory': 'bg-orange-100 text-orange-700', Antibiotic: 'bg-yellow-100 text-yellow-700', Antacid: 'bg-teal-100 text-teal-700', Diabetes: 'bg-blue-100 text-blue-700', Cardiology: 'bg-pink-100 text-pink-700', Cholesterol: 'bg-purple-100 text-purple-700', Hypertension: 'bg-indigo-100 text-indigo-700', Diuretic: 'bg-cyan-100 text-cyan-700', Respiratory: 'bg-sky-100 text-sky-700', Allergy: 'bg-lime-100 text-lime-700', Antidepressant: 'bg-violet-100 text-violet-700', Supplement: 'bg-emerald-100 text-emerald-700', Antifungal: 'bg-amber-100 text-amber-700', GI: 'bg-rose-100 text-rose-700' };
    return (
      <div className="max-w-4xl mx-auto pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveTab('home')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className={`text-slate-700 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{isRtl ? 'الأدوية' : 'Medications'}</h2>
            <p className="text-slate-500 text-sm font-medium">{egyptMedicals.length} {isRtl ? 'دواء' : 'medications'}</p>
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={medicalSearch} onChange={e => setMedicalSearch(e.target.value)} placeholder={isRtl ? 'ابحث عن دواء...' : 'Search medications...'} className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-sm font-medium" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#004A87] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#004A87]'}`}>{cat}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((m, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 bg-[#004A87]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Pill size={22} className="text-[#004A87]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">{m.generic}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">{m.description}</p>
                    <p className="text-[#004A87] text-xs font-semibold mt-1">Dosage: {m.dosage}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColor[m.category] || 'bg-slate-100 text-slate-600'}`}>{m.category}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Pill size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">{isRtl ? 'لا توجد نتائج' : 'No results found'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const bookingDoctors = [
    { id: 1, name: 'Dr. Ahmed Hassan', specialty: 'Cardiology', rating: 4.9, fee: 300, available: true, img: null },
    { id: 2, name: 'Dr. Sara Mohamed', specialty: 'Neurology', rating: 4.8, fee: 350, available: true, img: null },
    { id: 3, name: 'Dr. Omar Ali', specialty: 'Internal Medicine', rating: 4.7, fee: 250, available: true, img: null },
    { id: 4, name: 'Dr. Nour El-Din', specialty: 'Dermatology', rating: 4.6, fee: 280, available: true, img: null },
    { id: 5, name: 'Dr. Mona Khalil', specialty: 'Pediatrics', rating: 4.9, fee: 320, available: true, img: null },
    { id: 6, name: 'Dr. Yasser Fathi', specialty: 'Orthopedics', rating: 4.5, fee: 400, available: false, img: null },
    { id: 7, name: 'Dr. Heba Mansour', specialty: 'Gynecology', rating: 4.8, fee: 350, available: true, img: null },
    { id: 8, name: 'Dr. Khaled Mostafa', specialty: 'Ophthalmology', rating: 4.7, fee: 270, available: true, img: null },
    { id: 9, name: 'Dr. Rania Samir', specialty: 'Psychiatry', rating: 4.6, fee: 400, available: true, img: null },
    { id: 10, name: 'Dr. Tarek Nabil', specialty: 'General Surgery', rating: 4.8, fee: 500, available: true, img: null },
    { id: 11, name: 'Dr. Dina Fouad', specialty: 'Endocrinology', rating: 4.9, fee: 380, available: true, img: null },
    { id: 12, name: 'Dr. Amr Shalaby', specialty: 'Urology', rating: 4.5, fee: 300, available: true, img: null },
    { id: 13, name: 'Dr. Layla Ibrahim', specialty: 'Rheumatology', rating: 4.7, fee: 350, available: false, img: null },
    { id: 14, name: 'Dr. Sherif Gamal', specialty: 'Gastroenterology', rating: 4.6, fee: 420, available: true, img: null },
    { id: 15, name: 'Dr. Noha Abdel Aziz', specialty: 'Oncology', rating: 4.9, fee: 600, available: true, img: null },
  ];

  const timeSlots = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM'];

  const renderBookingContent = () => {
    const filteredDoctors = bookingDoctors.filter(d =>
      d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
    );
    const filteredHospitals = egyptHospitals.filter(h =>
      h.name.toLowerCase().includes(hospitalBookSearch.toLowerCase()) ||
      h.city.toLowerCase().includes(hospitalBookSearch.toLowerCase())
    );

    if (bookingConfirmed) {
      return (
        <div className="max-w-lg mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{isRtl ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h2>
            <p className="text-slate-500 font-medium mb-8">{isRtl ? 'موعدك محجوز بنجاح' : 'Your appointment has been booked successfully'}</p>
            <div className="bg-[#F5F8FF] rounded-2xl p-5 text-left space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <User size={18} className="text-[#004A87] shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">{isRtl ? 'الطبيب' : 'Doctor'}</p>
                  <p className="font-bold text-slate-800 text-sm">{bookingDoctor?.name}</p>
                  <p className="text-xs text-slate-500">{bookingDoctor?.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-[#004A87] shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">{isRtl ? 'المستشفى' : 'Hospital'}</p>
                  <p className="font-bold text-slate-800 text-sm">{bookingHospital?.name}</p>
                  <p className="text-xs text-slate-500">{bookingHospital?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-[#004A87] shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</p>
                  <p className="font-bold text-slate-800 text-sm">{bookingDate} — {bookingTime}</p>
                </div>
              </div>
              {bookingNotes && (
                <div className="flex items-start gap-3">
                  <ClipboardList size={18} className="text-[#004A87] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{isRtl ? 'ملاحظات' : 'Notes'}</p>
                    <p className="font-medium text-slate-700 text-sm">{bookingNotes}</p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { setBookingConfirmed(false); setActiveTab('home'); }} className="w-full bg-[#004A87] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#003a6b] transition-all active:scale-95">
              {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { if (bookingStep > 1) setBookingStep(bookingStep - 1); else setActiveTab('home'); }} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className={`text-slate-700 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900">{isRtl ? 'حجز موعد' : 'Book Appointment'}</h2>
            <p className="text-slate-500 text-sm font-medium">{isRtl ? `الخطوة ${bookingStep} من 3` : `Step ${bookingStep} of 3`}</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${bookingStep >= s ? 'bg-[#004A87] text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${bookingStep > s ? 'bg-[#004A87]' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 — Choose Doctor */}
        {bookingStep === 1 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{isRtl ? 'اختر الطبيب' : 'Choose a Doctor'}</h3>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} placeholder={isRtl ? 'ابحث باسم الطبيب أو التخصص...' : 'Search by name or specialty...'} className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-sm font-medium" />
            </div>
            <div className="space-y-3">
              {filteredDoctors.map(doc => (
                <button key={doc.id} onClick={() => { setBookingDoctor(doc); setBookingStep(2); }} disabled={!doc.available}
                  className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left transition-all hover:shadow-md ${bookingDoctor?.id === doc.id ? 'border-[#004A87]' : 'border-slate-100 hover:border-[#004A87]/40'} ${!doc.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#004A87]/10 flex items-center justify-center shrink-0">
                      <User size={26} className="text-[#004A87]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${doc.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{doc.available ? (isRtl ? 'متاح' : 'Available') : (isRtl ? 'غير متاح' : 'Unavailable')}</span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">{doc.specialty}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-amber-500 text-xs font-bold">★ {doc.rating}</span>
                        <span className="text-[#004A87] text-xs font-bold">EGP {doc.fee}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Choose Hospital + Date + Time */}
        {bookingStep === 2 && (
          <div className="space-y-6">
            {/* Selected doctor recap */}
            <div className="bg-[#004A87]/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#004A87]/10 flex items-center justify-center shrink-0">
                <User size={20} className="text-[#004A87]" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{bookingDoctor?.name}</p>
                <p className="text-slate-500 text-xs font-medium">{bookingDoctor?.specialty}</p>
              </div>
            </div>

            {/* Hospital */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-3">{isRtl ? 'اختر المستشفى' : 'Choose Hospital'}</h3>
              <div className="relative mb-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input value={hospitalBookSearch} onChange={e => setHospitalBookSearch(e.target.value)} placeholder={isRtl ? 'ابحث عن مستشفى...' : 'Search hospital...'} className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-sm font-medium" />
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {filteredHospitals.slice(0, 20).map((h, idx) => (
                  <button key={idx} onClick={() => setBookingHospital(h)}
                    className={`w-full text-left bg-white rounded-xl px-4 py-3 border-2 transition-all ${bookingHospital?.name === h.name ? 'border-[#004A87] bg-[#004A87]/5' : 'border-slate-100 hover:border-[#004A87]/40'}`}>
                    <p className="font-bold text-slate-800 text-sm">{h.name}</p>
                    <p className="text-slate-400 text-xs font-medium">{h.city} · {h.type}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-3">{isRtl ? 'اختر التاريخ' : 'Choose Date'}</h3>
              <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-sm" />
            </div>

            {/* Time */}
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-3">{isRtl ? 'اختر الوقت' : 'Choose Time'}</h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(t => (
                  <button key={t} onClick={() => setBookingTime(t)}
                    className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${bookingTime === t ? 'bg-[#004A87] text-white border-[#004A87]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#004A87]'}`}>{t}</button>
                ))}
              </div>
            </div>

            <button onClick={() => { if (bookingHospital && bookingDate && bookingTime) setBookingStep(3); }}
              disabled={!bookingHospital || !bookingDate || !bookingTime}
              className="w-full bg-[#004A87] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#003a6b] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
              {isRtl ? 'التالي' : 'Next'}
            </button>
          </div>
        )}

        {/* Step 3 — Review & Confirm */}
        {bookingStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-800">{isRtl ? 'مراجعة وتأكيد' : 'Review & Confirm'}</h3>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#004A87]/10 flex items-center justify-center shrink-0">
                  <User size={24} className="text-[#004A87]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{isRtl ? 'الطبيب' : 'Doctor'}</p>
                  <p className="font-bold text-slate-900">{bookingDoctor?.name}</p>
                  <p className="text-slate-500 text-sm">{bookingDoctor?.specialty} · EGP {bookingDoctor?.fee}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#004A87]/10 flex items-center justify-center shrink-0">
                  <Building2 size={24} className="text-[#004A87]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{isRtl ? 'المستشفى' : 'Hospital'}</p>
                  <p className="font-bold text-slate-900">{bookingHospital?.name}</p>
                  <p className="text-slate-500 text-sm">{bookingHospital?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#004A87]/10 flex items-center justify-center shrink-0">
                  <CalendarDays size={24} className="text-[#004A87]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</p>
                  <p className="font-bold text-slate-900">{bookingDate}</p>
                  <p className="text-slate-500 text-sm">{bookingTime}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{isRtl ? 'ملاحظات (اختياري)' : 'Notes (optional)'}</label>
              <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} rows={3} placeholder={isRtl ? 'اكتب أي تفاصيل إضافية...' : 'Add any additional details...'} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-sm resize-none placeholder:text-slate-300" />
            </div>
            <button onClick={() => {
                setConfirmedBookings(prev => [...prev, {
                  id: Date.now(),
                  doctor: bookingDoctor,
                  hospital: bookingHospital,
                  date: bookingDate,
                  time: bookingTime,
                  notes: bookingNotes,
                  bookedAt: new Date().toLocaleDateString('en-GB'),
                  status: 'Upcoming',
                }]);
                setBookingConfirmed(true);
              }}
              className="w-full bg-[#004A87] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#003a6b] transition-all active:scale-95 shadow-lg shadow-[#004A87]/20">
              {isRtl ? 'تأكيد الحجز' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderHistoryContent = () => {

    const medicationHistory = [
      { name: isRtl ? 'بانادول' : 'Panadol', dose: '500mg', takenAt: '08:00 AM', date: new Date().toLocaleDateString('en-GB'), status: 'Taken' },
      { name: isRtl ? 'فيتامين د' : 'Vitamin D', dose: '1000IU', takenAt: '10:00 PM', date: new Date().toLocaleDateString('en-GB'), status: isPanadolTaken ? 'Taken' : 'Pending' },
      { name: isRtl ? 'بانادول' : 'Panadol', dose: '500mg', takenAt: '02:00 PM', date: new Date(Date.now() - 86400000).toLocaleDateString('en-GB'), status: 'Taken' },
      { name: isRtl ? 'أوميبرازول' : 'Omeprazole', dose: '20mg', takenAt: '07:30 AM', date: new Date(Date.now() - 86400000).toLocaleDateString('en-GB'), status: 'Taken' },
      { name: isRtl ? 'فيتامين د' : 'Vitamin D', dose: '1000IU', takenAt: '10:00 PM', date: new Date(Date.now() - 86400000).toLocaleDateString('en-GB'), status: 'Skipped' },
    ];

    const communityHistory = posts.map((post, idx) => ({
      id: idx,
      type: 'post',
      title: post.title,
      time: post.time,
      likes: post.likes || 0,
      comments: post.comments || 0,
    }));

    const tabs = [
      { id: 'appointments', label: isRtl ? 'المواعيد' : 'Appointments' },
      { id: 'medications', label: isRtl ? 'الأدوية' : 'Medications' },
      { id: 'community', label: isRtl ? 'المجتمع' : 'Community' },
    ];

    return (
      <div className="max-w-3xl mx-auto pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveTab('home')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className={`text-slate-700 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{isRtl ? 'السجل والتاريخ' : 'History'}</h2>
            <p className="text-slate-500 text-sm font-medium">{isRtl ? 'جميع نشاطاتك' : 'All your activity'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setHistoryTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${historyTab === t.id ? 'bg-white text-[#004A87] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Appointments tab */}
        {historyTab === 'appointments' && (
          <div className="space-y-4">
            {confirmedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                <CalendarDays size={52} className="text-slate-300 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-slate-400 mb-1">{isRtl ? 'لا توجد مواعيد بعد' : 'No appointments yet'}</h3>
                <p className="text-slate-400 text-sm font-medium mb-6">{isRtl ? 'احجز موعدك الأول الآن' : 'Book your first appointment'}</p>
                <button onClick={() => { setBookingStep(1); setBookingConfirmed(false); setBookingDoctor(null); setBookingHospital(null); setBookingDate(''); setBookingTime(''); setBookingNotes(''); setActiveTab('booking'); }}
                  className="bg-[#004A87] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-[#003a6b] transition-all">
                  {isRtl ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            ) : (
              confirmedBookings.slice().reverse().map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#004A87]/10 rounded-2xl flex items-center justify-center shrink-0">
                        <User size={22} className="text-[#004A87]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{b.doctor?.name}</h4>
                        <p className="text-slate-500 text-sm">{b.doctor?.specialty}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${b.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : b.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-medium mb-0.5">{isRtl ? 'المستشفى' : 'Hospital'}</p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{b.hospital?.name}</p>
                      <p className="text-xs text-slate-500">{b.hospital?.city}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-medium mb-0.5">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</p>
                      <p className="text-sm font-bold text-slate-800">{b.date}</p>
                      <p className="text-xs text-slate-500">{b.time}</p>
                    </div>
                  </div>
                  {b.notes && (
                    <div className="mt-3 bg-amber-50 rounded-xl p-3">
                      <p className="text-xs text-amber-700 font-medium">{isRtl ? 'ملاحظات: ' : 'Notes: '}{b.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setConfirmedBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'Completed' } : x))}
                      disabled={b.status === 'Completed' || b.status === 'Cancelled'}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {isRtl ? 'مكتمل' : 'Mark Completed'}
                    </button>
                    <button onClick={() => setConfirmedBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'Cancelled' } : x))}
                      disabled={b.status === 'Completed' || b.status === 'Cancelled'}
                      className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-red-200">
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Medications tab */}
        {historyTab === 'medications' && (
          <div className="space-y-3">
            {medicationHistory.map((med, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${med.status === 'Taken' ? 'bg-green-100' : med.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'}`}>
                  <Pill size={20} className={med.status === 'Taken' ? 'text-green-600' : med.status === 'Pending' ? 'text-amber-600' : 'text-red-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${med.status === 'Taken' ? 'bg-green-100 text-green-700' : med.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                      {med.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium">{med.dose}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{med.date} · {med.takenAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community tab */}
        {historyTab === 'community' && (
          <div className="space-y-3">
            {communityHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                <MessageSquare size={52} className="text-slate-300 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-slate-400 mb-1">{isRtl ? 'لا توجد منشورات' : 'No posts yet'}</h3>
                <p className="text-slate-400 text-sm font-medium">{isRtl ? 'شارك في المجتمع' : 'Share something in the community'}</p>
              </div>
            ) : (
              communityHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#004A87]/10 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare size={18} className="text-[#004A87]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 font-medium mb-0.5">{isRtl ? 'منشور في المجتمع' : 'Community post'} · {item.time}</p>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                        <span>♥ {item.likes}</span>
                        <span>💬 {item.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSettingsContent = () => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl ${isRtl ? 'text-right ml-auto' : 'text-left'}`}>
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <Settings className="text-[#0F4C81]" />
        {isRtl ? 'الإعدادات' : 'Settings'}
      </h3>
      <p className="text-slate-500">{isRtl ? 'إعدادات الحساب...' : 'Account settings...'}</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'records': return renderRecordsContent();
      case 'community': return renderCommunityContent();
      case 'profile': return renderProfileContent();
      case 'chats': return renderChatsContent();
      case 'settings': return renderSettingsContent();
      case 'hospitals': return renderHospitalsContent();
      case 'medicals': return renderMedicalsContent();
      case 'booking': return renderBookingContent();
      case 'history': return renderHistoryContent();
      default: return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter','Poppins',sans-serif]">
      <div className="flex h-screen overflow-hidden">
        <aside className={`w-60 bg-white border-slate-200 flex flex-col shrink-0 ${isRtl ? 'border-l' : 'border-r'}`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F4C81] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F4C81]">As'alny</h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === item.id ? 'bg-[#0F4C81]/10 text-[#0F4C81]' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input className="w-full pl-11 pr-4 py-2.5 bg-slate-100 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/30 text-sm" placeholder={isRtl ? 'ابحث...' : 'Search...'} />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl" onClick={() => setActiveTab('profile')}>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{patientData.name}</p>
                  <p className="text-xs text-slate-500">#{patientData.id}</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0F4C81]/20">
                  <img alt={patientData.name} className="w-full h-full object-cover" src={patientData.avatar || DEFAULT_AVATAR} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 pt-6">
            {activeTab === 'home' && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-[#0F4C81] rounded-3xl p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-full border-2 border-white/30 p-1 bg-white/10 backdrop-blur-md overflow-hidden">
                    <img alt={patientData.name} className="w-full h-full object-cover rounded-full" src={patientData.avatar || DEFAULT_AVATAR} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      {isRtl ? `مساء الخير، ${patientData.name.split(' ')[0]}` : `Good Evening, ${patientData.name.split(' ')[0]}`}
                    </h1>
                    <p className="text-blue-100/80 text-sm font-medium">{isRtl ? 'صحتك تهمنا' : 'Your health matters'}</p>
                  </div>
                </div>
              </motion.div>
            )}
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
