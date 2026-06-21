import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Bell, Home, Calendar, Star, MessageCircle, User, Plus, Camera, ThumbsUp, ChevronLeft, ChevronRight, Send, Image, ImageOff, Pencil, Lock, Trash2, Eye, EyeOff } from 'lucide-react';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=0F4C81&color=fff";

const DoctorHome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';
  const [activeSidebar, setActiveSidebar] = useState('home');
  const [activeHomeTab, setActiveHomeTab] = useState('requests');
  const [activeProfileSubView, setActiveProfileSubView] = useState(null); // null, 'edit', 'password'
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentChatPatient, setCurrentChatPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  const handleOpenChat = (patient) => {
    setCurrentChatPatient(patient);
    setChatMessages([
      { id: 1, sender: 'patient', text: isRtl ? 'مرحباً يا دكتور' : 'Hello doctor' },
      { id: 2, sender: 'doctor', text: isRtl ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?' },
      { id: 3, sender: 'patient', text: patient.subtitle || patient.condition || 'Regular 4' }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const doctorMsgText = newMessageText.trim();
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'doctor', text: doctorMsgText }]);
    setNewMessageText('');

    // Dynamic auto-reply from patient for maximum responsiveness
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'patient', text: isRtl ? 'تمام يا دكتور، شكراً لك!' : 'Okay doctor, thank you!' }
      ]);
    }, 1200);
  };
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('doctorArticles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [articleImage, setArticleImage] = useState(null);
  const [articleContent, setArticleContent] = useState('');
  const ARTICLE_MAX = 500;
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: isRtl ? 'لديك طلب استشارة جديد من سارة ميلر' : 'New consultation request from Sarah Miller', time: isRtl ? 'منذ دقيقتين' : '2m ago', isNew: true },
    { id: 2, text: isRtl ? 'تم قبول مقالك الطبي الجديد للنشر' : 'Your medical article was approved', time: isRtl ? 'منذ ساعة' : '1h ago', isNew: false },
    { id: 3, text: isRtl ? 'قام جيمس ويلسون بتقييم استشارتك بـ 5 نجوم' : 'James Wilson rated your consultation 5 stars', time: isRtl ? 'منذ يوم' : '1d ago', isNew: false }
  ]);

  // User state for settings synchronization
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Initialize doctor data from localStorage or default
  const [doctorData, setDoctorData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return {
        name: parsed.name || parsed.firstName || (isRtl ? 'د. عبد الله' : 'Dr. Abdallah'),
        specialization: parsed.specialization || (isRtl ? 'أمراض القلب' : 'Cardiologist'),
        avatar: parsed.avatar || DEFAULT_AVATAR,
        bio: parsed.bio || (isRtl
          ? 'Experienced cardiologist'
          : 'Experienced cardiologist'),
        phone: parsed.phone || '+1234567890',
        experience: parsed.experience || '10',
        price: parsed.price || '100',
        license: parsed.license || 'LIC12345',
        licenseImage: parsed.licenseImage || null
      };
    }
    return {
      name: isRtl ? 'د. عبد الله' : 'Dr. Abdallah',
      specialization: isRtl ? 'أمراض القلب' : 'Cardiologist',
      avatar: DEFAULT_AVATAR,
      bio: 'Experienced cardiologist',
      phone: '+1234567890',
      experience: '10',
      price: '100',
      license: 'LIC12345',
      licenseImage: null
    };
  });

  // Mock patient requests
  const [patientRequests, setPatientRequests] = useState([
    {
      id: 1,
      name: isRtl ? 'سارة ميلر' : 'Sarah Miller',
      condition: isRtl ? '控制高血压' : 'Hypertension Control',
      message: isRtl
        ? "أشعر بالدوار قليلاً بعد الأدوية الصباحية. هل يجب أن أعدل الجرعة؟"
        : "I've been feeling slightly dizzy after my morning medication. Should I adjust the dosage?",
      image: DEFAULT_AVATAR,
      isNew: true
    },
    {
      id: 2,
      name: isRtl ? 'جيمس ويلسون' : 'James Wilson',
      condition: isRtl ? 'الشفاء بعد العملية' : 'Post-Op Recovery',
      message: isRtl
        ? 'الشفاء يسير بشكل جيد. أود تحديد موعد للمتابعة يوم الثلاثاء القادم إن أمكن.'
        : 'Recovery is going well. I would like to schedule a follow-up for next Tuesday if possible.',
      image: DEFAULT_AVATAR,
      isNew: false
    },
    {
      id: 3,
      name: isRtl ? 'روبرت فوكس' : 'Robert Fox',
      condition: isRtl ? 'طلب فحص طبي' : 'Check-up Request',
      message: isRtl
        ? "مرحباً دكتور، لاحظت بعض الأنماط غير المعتادة في تطبيق مراقبة معدل ضربات القلب. هل يمكننا المناقشة؟"
        : "Hi Doctor, I've noticed some unusual patterns in my heart rate monitor app. Can we discuss?",
      image: DEFAULT_AVATAR,
      isNew: false
    }
  ]);

  const sidebarItems = [
    { id: 'home', icon: Home, label: isRtl ? 'الرئيسية' : 'Home' },
    { id: 'ai-chat', icon: MessageCircle, label: isRtl ? 'دردشة الذكاء الاصطناعي' : 'AI Chat' },
    { id: 'articles', icon: Calendar, label: isRtl ? 'المقالات' : 'Articles' },
    { id: 'reviews', icon: ThumbsUp, label: isRtl ? 'تقييمات المرضى' : 'Patient Reviews' },
    { id: 'profile', icon: User, label: isRtl ? 'الملف' : 'Profile' },
  ];

  // Mock active chats state
  const [activeChats, setActiveChats] = useState(() => [
    { id: 4, name: isRtl ? 'جون دو' : 'John Doe', subtitle: isRtl ? 'متابعة دورية 4' : 'Regular 4', image: null },
    { id: 5, name: isRtl ? 'جون دو' : 'John Doe', subtitle: isRtl ? 'متابعة دورية 5' : 'Regular 5', image: null },
    { id: 6, name: isRtl ? 'د. جين سميث' : 'Dr. Jane Smith', subtitle: '120', image: null },
    { id: 7, name: isRtl ? 'جون دو' : 'John Doe', subtitle: isRtl ? 'متابعة دورية 8' : 'Regular 8', image: null },
    { id: 8, name: isRtl ? 'د. جين سميث' : 'Dr. Jane Smith', subtitle: isRtl ? 'فحص دوري' : 'Regular checkup', image: null },
    { id: 9, name: isRtl ? 'د. جين سميث' : 'Dr. Jane Smith', subtitle: isRtl ? 'فحص دوري' : 'Regular checkup', image: null }
  ]);

  const handleAccept = (id) => {
    const acceptedRequest = patientRequests.find(req => req.id === id);
    if (acceptedRequest) {
      const newChat = {
        id: acceptedRequest.id,
        name: acceptedRequest.name,
        subtitle: acceptedRequest.condition || (isRtl ? 'طلب مقبول' : 'Accepted request'),
        image: acceptedRequest.image && acceptedRequest.image !== DEFAULT_AVATAR ? acceptedRequest.image : null
      };
      setActiveChats(prev => [newChat, ...prev]);
    }
    setPatientRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    setPatientRequests(patientRequests.filter(req => req.id !== id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert(isRtl ? 'حجم الصورة كبير جداً. الحد الأقصى 2 ميجابايت.' : 'Image size is too large. Max limit is 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedData = { ...doctorData, avatar: base64String };
        setDoctorData(updatedData);

        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: base64String }));

        // Sync with user state if needed
        if (user) {
          setUser({ ...user, avatar: base64String });
        }

        // Notify other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-[#F5F7FA] font-['Inter','Poppins',sans-serif] ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Left Sidebar */}
      <aside className={`w-60 bg-white border-slate-200 flex flex-col shrink-0 ${isRtl ? 'border-l' : 'border-r'}`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary">As'alny</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'ai-chat') {
                  navigate('/ai-chat');
                } else {
                  setActiveSidebar(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeSidebar === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} size={20} />
              <input
                className={`w-full ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-primary/30 text-sm transition-all`}
                placeholder={isRtl ? 'ابحث عن مرضى أو تقارير...' : 'Search patients or reports...'}
                type="text"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Welcome Section */}
          {activeSidebar === 'home' && (
            <div className={`mb-8 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
              <div>
                <h2 className={`text-3xl font-extrabold text-slate-900 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {isRtl ? `مرحباً، ${doctorData.name}` : `Hi, ${doctorData.name}`}
                </h2>
                <p className={`text-slate-500 mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {isRtl ? 'إدارة مرضاك بسهولة' : 'Manage your patients easily'}
                </p>
              </div>

              {/* Notification Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all flex items-center justify-center group"
                >
                  <Bell size={24} className="group-hover:scale-110 transition-transform" />
                  {notifications.some(n => n.isNew) && (
                    <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showNotifications && (
                  <div className={`absolute top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                    <div className={`px-4 pb-2 mb-2 border-b border-slate-100 flex justify-between items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="font-bold text-slate-900">{isRtl ? 'الإشعارات' : 'Notifications'}</span>
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, isNew: false })))}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        {isRtl ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1 px-2">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl hover:bg-slate-50 transition-colors flex gap-3 ${isRtl ? 'text-right flex-row-reverse' : 'text-left flex-row'} ${notif.isNew ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 leading-snug">{notif.text}</p>
                            <span className="text-xs text-slate-400 font-medium block mt-1">{notif.time}</span>
                          </div>
                          {notif.isNew && (
                            <span className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs - only on Home */}
          {activeSidebar === 'home' && (
            <div className={`flex gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                onClick={() => setActiveHomeTab('chats')}
                className={`px-12 py-3 text-sm font-bold rounded-full transition-all duration-300 relative ${activeHomeTab === 'chats'
                    ? 'bg-[#0F4C81] text-white shadow-sm'
                    : 'bg-[#F1F3F5] text-slate-600 hover:bg-[#E9ECEF]'
                  }`}
              >
                {isRtl ? 'المحادثات' : 'Chats'}
              </button>
              <button
                onClick={() => setActiveHomeTab('requests')}
                className={`px-12 py-3 text-sm font-bold rounded-full transition-all duration-300 relative ${activeHomeTab === 'requests'
                    ? 'bg-[#0F4C81] text-white shadow-sm'
                    : 'bg-[#F1F3F5] text-slate-600 hover:bg-[#E9ECEF]'
                  }`}
              >
                {isRtl ? 'الطلبات' : 'Requests'}
                {patientRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                    {patientRequests.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Home content: Requests / Chats */}
          {activeSidebar === 'home' && (
            <div className="flex flex-col gap-4 max-w-3xl">
              {/* Patient Request Cards */}
              {activeHomeTab === 'requests' && patientRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white p-5 rounded-[24px] shadow-sm border border-slate-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Rounded avatar placeholder - light purple like screenshot */}
                    <div className="w-14 h-14 rounded-full bg-[#E5E0F9] shrink-0 flex items-center justify-center overflow-hidden">
                      {request.image && request.image !== DEFAULT_AVATAR ? (
                        <img alt={request.name} className="w-full h-full object-cover" src={request.image} />
                      ) : (
                        <span className="font-bold text-[#6366F1] text-lg">
                          {request.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-bold text-lg text-slate-800">{request.name}</h3>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">{request.condition}</p>
                    </div>
                  </div>

                  {/* Accept / Reject buttons in capsule style */}
                  <div className={`flex gap-3 items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-6 py-2 rounded-full border border-slate-200 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      {isRtl ? 'رفض' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-6 py-2 rounded-full bg-[#0F4C81] text-white font-bold text-xs hover:bg-[#0c3e6a] shadow-md shadow-blue-500/10 transition-all"
                    >
                      {isRtl ? 'قبول' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Active Chat Cards */}
              {activeHomeTab === 'chats' && activeChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`bg-white p-5 rounded-[24px] shadow-sm border border-slate-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Rounded avatar placeholder - light purple like screenshot */}
                    <div className="w-14 h-14 rounded-full bg-[#E5E0F9] shrink-0 flex items-center justify-center overflow-hidden">
                      {chat.image && chat.image !== DEFAULT_AVATAR ? (
                        <img alt={chat.name} className="w-full h-full object-cover" src={chat.image} />
                      ) : (
                        <span className="font-bold text-[#6366F1] text-lg">
                          {chat.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-bold text-lg text-slate-800">{chat.name}</h3>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">
                        {chat.subtitle || (isRtl ? 'فحص دوري' : 'Regular checkup')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenChat(chat)}
                    className="px-8 py-2.5 rounded-full bg-[#0F4C81] text-white font-bold text-sm hover:bg-[#0c3e6a] shadow-md shadow-blue-500/10 transition-all flex items-center gap-2"
                  >
                    {isRtl ? 'محادثة' : 'Chat'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Articles tab content */}
          {activeSidebar === 'articles' && (
            <div className={`max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                {isRtl ? 'المقالات' : 'Articles'}
              </h2>

              {/* Create Article Form Container - always visible matching screenshot */}
              <form
                className="bg-white border border-[#0F4C81] rounded-[28px] p-6 mb-8 flex flex-col gap-4 shadow-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const title = formData.get('title')?.toString().trim() || '';
                  const content = articleContent.trim();

                  if (!title || !content) return;

                  setArticles((prev) => {
                    const updated = [{ title, content, image: articleImage }, ...prev];
                    try { localStorage.setItem('doctorArticles', JSON.stringify(updated)); } catch {}
                    return updated;
                  });
                  setArticleImage(null);
                  setArticleContent('');
                  e.currentTarget.reset();
                }}
              >
                <h3 className="text-lg font-bold text-[#0F4C81]">
                  {isRtl ? 'إنشاء مقال' : 'Create Article'}
                </h3>

                <input
                  name="title"
                  placeholder={isRtl ? 'أدخل العنوان' : 'Enter title'}
                  required
                  className={`w-full py-2 bg-transparent text-[17px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-none border-b border-slate-100 focus:border-slate-300 transition-colors ${isRtl ? 'text-right' : 'text-left'
                    }`}
                />

                <div className="relative">
                  <textarea
                    name="content"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value.slice(0, ARTICLE_MAX))}
                    placeholder={isRtl ? 'أدخل المحتوى' : 'Enter content'}
                    required
                    rows={3}
                    className={`w-full py-2 bg-transparent text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none resize-none ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                  <p className={`text-xs font-medium mt-1 ${isRtl ? 'text-left' : 'text-right'} ${
                    articleContent.length >= ARTICLE_MAX ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {articleContent.length}/{ARTICLE_MAX}
                  </p>
                </div>

                <div className={`flex justify-between items-center mt-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* File Upload for Add Image */}
                  <label className="flex items-center gap-2 text-[#0F4C81] font-semibold cursor-pointer select-none hover:opacity-80 active:scale-95 transition-all text-[15px]">
                    <Image size={20} />
                    <span>
                      {articleImage
                        ? (isRtl ? 'تم اختيار صورة ✓' : 'Image Selected ✓')
                        : (isRtl ? 'إضافة صورة' : 'Add Image')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setArticleImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    className="bg-[#0F4C81] text-white rounded-full px-8 py-2.5 font-bold hover:bg-[#0c3e6a] transition-colors shadow-sm"
                  >
                    {isRtl ? 'مشاركة' : 'Share'}
                  </button>
                </div>
              </form>

              {/* Articles List */}
              <div className="space-y-6">
                {articles.map((article, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F1F3F5] rounded-[28px] p-6 flex flex-col gap-4 shadow-none border-none animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    {/* Article Image (or placeholder) */}
                    {article.image ? (
                      <div className="w-full rounded-[20px] overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm">
                        <img src={article.image} alt={article.title} className="w-full h-auto object-contain rounded-[20px]" />
                      </div>
                    ) : (
                      <div className="w-full bg-[#E9ECEF] rounded-2xl h-44 flex items-center justify-center text-slate-400">
                        <ImageOff size={44} className="stroke-[1.5]" />
                      </div>
                    )}

                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h4 className="text-xl font-bold text-[#0F4C81] mb-2">{article.title}</h4>
                      <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">{article.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews tab content */}
          {activeSidebar === 'reviews' && (
            <div className={`max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
              {/* Reviews Header with Back Arrow */}
              <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={() => setActiveSidebar('home')}
                  className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center active:scale-95 shadow-sm bg-white"
                >
                  {isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {isRtl ? 'تقييمات المرضى' : 'Patient Reviews'}
                </h2>
              </div>

              {/* Reviews Cards List */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: isRtl ? 'أحمد حسن' : 'Ahmed Hassan',
                    rating: 4,
                    comment: isRtl
                      ? 'كان الطبيب محترفاً للغاية ومتعاوناً جداً.'
                      : 'Doctor was very professional and helpful.',
                    avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150'
                  },
                  {
                    id: 2,
                    name: isRtl ? 'س.س محمد' : 'ss Mohamed',
                    rating: 5,
                    comment: isRtl
                      ? 'تجربة ممتازة، أوصي به بشدة.'
                      : 'Excellent experience, highly recommended.',
                    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'
                  },
                  {
                    id: 3,
                    name: isRtl ? 'عمر علي' : 'Omar Ali',
                    rating: 4,
                    comment: isRtl
                      ? 'طبيب جيد ولكن وقت الانتظار كان طويلاً.'
                      : 'Good doctor but waiting time was long.',
                    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
                  }
                ].map((review) => (
                  <div
                    key={review.id}
                    className={`bg-white p-5 rounded-[24px] shadow-sm border border-slate-100/50 flex items-start gap-4 hover:shadow-md transition-all duration-300 ${isRtl ? 'flex-row-reverse' : 'flex-row'
                      }`}
                  >
                    {/* Circular patient profile image */}
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-slate-100/50 shadow-inner"
                    />

                    {/* Review content */}
                    <div className={`flex-1 flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
                      <h3 className="font-bold text-lg text-slate-800 leading-snug">{review.name}</h3>

                      {/* Star Ratings */}
                      <div className="flex gap-0.5 mt-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const isFilled = starIndex <= review.rating;
                          return (
                            <Star
                              key={starIndex}
                              size={16}
                              className={isFilled ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'}
                            />
                          );
                        })}
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile tab content */}
          {activeSidebar === 'profile' && (
            <div className="-mx-4 sm:-mx-8 -my-4 sm:-my-8 bg-white flex flex-col min-h-[calc(100vh-64px)] relative">
              {activeProfileSubView === null && (
                /* Profile Main View — replicating PatientHome profile design */
                <>
                  {/* Blue Header Section — edge-to-edge */}
                  <div className="bg-[#004A87] w-full pt-12 pb-10 rounded-b-[40px] flex flex-col items-center justify-center shrink-0 relative z-10 shadow-md">
                    <div className="relative mb-4">
                      <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                        <img alt={doctorData.name} className="w-full h-full object-cover" src={doctorData.avatar || DEFAULT_AVATAR} />
                      </div>
                      <label className="absolute bottom-1 right-1 bg-[#004A87] text-white w-8 h-8 flex items-center justify-center rounded-full border-[3px] border-white hover:bg-[#003a6b] transition-colors shadow-sm cursor-pointer">
                        <Plus size={18} strokeWidth={3} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-1">{doctorData.name}</h2>
                    <p className="text-white/90 text-[15px] font-normal mb-1">{doctorData.email || 'doctor11111@example.com'}</p>
                    <p className="text-white/95 text-[15px] font-normal">{doctorData.specialization || 'Cardiology'}</p>
                  </div>

                  {/* Settings List Section */}
                  <div className="flex-1 w-full px-4 sm:px-8 py-8 bg-white">
                    <div className="w-full space-y-4">
                      {[
                        { id: 'edit', icon: Pencil, label: isRtl ? 'تعديل المعلومات الأساسية' : 'Edit Basic Information', action: () => setActiveProfileSubView('edit') },
                        { id: 'password', icon: Lock, label: isRtl ? 'تغيير كلمة المرور' : 'Change Password', action: () => setActiveProfileSubView('password') },
                        { id: 'notifications', icon: Bell, label: isRtl ? 'إعدادات الإشعارات' : 'Notification Settings' },
                        { id: 'delete', icon: Trash2, label: isRtl ? 'حذف الحساب' : 'Delete Account' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={item.action}
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
                </>
              )}

              {activeProfileSubView === 'edit' && (
                /* Edit Profile Form — matching screenshot design */
                <div className="flex-1 w-full flex flex-col relative pb-28">
                  {/* Blue Header Section — edge-to-edge */}
                  <div className="bg-[#004A87] w-full pt-12 pb-10 rounded-b-[40px] flex flex-col items-center justify-center shrink-0 relative z-10 shadow-md">
                    {/* Back Arrow absolute positioned top left to navigate back */}
                    <button
                      onClick={() => setActiveProfileSubView(null)}
                      className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <div className="relative mb-4">
                      <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                        <img alt={doctorData.name} className="w-full h-full object-cover" src={doctorData.avatar || DEFAULT_AVATAR} />
                      </div>
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-1">{doctorData.name}</h2>
                    <p className="text-white/90 text-[15px] font-normal mb-1">{doctorData.email || 'doctor11111@example.com'}</p>
                    <p className="text-white/95 text-[15px] font-normal">{doctorData.specialization || 'Cardiology'}</p>
                  </div>

                  {/* Title of view */}
                  <div className="px-6 pt-8 pb-4">
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {isRtl ? 'تعديل الملف' : 'Edit Profile'}
                    </h2>
                  </div>

                  {/* Form Fields — scrollable */}
                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="w-full max-w-lg mx-auto space-y-6">
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                        <input id="edit-doc-name" type="text" defaultValue={doctorData.name} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                        <input id="edit-doc-email" type="email" defaultValue={doctorData.email || 'doctor11111@example.com'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                        <input id="edit-doc-phone" type="tel" defaultValue={doctorData.phone || '+1234567890'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'سنوات الخبرة' : 'Years of Experience'}</label>
                        <input id="edit-doc-exp" type="number" defaultValue={doctorData.experience || '10'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'السعر' : 'Price'}</label>
                        <input id="edit-doc-price" type="number" defaultValue={doctorData.price || '100'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'التخصص' : 'Specialization'}</label>
                        <div className="relative">
                          <select id="edit-doc-spec" defaultValue={doctorData.specialization || 'Cardiology'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px] appearance-none cursor-pointer">
                            <option value="Cardiology">{isRtl ? 'أمراض القلب' : 'Cardiology'}</option>
                            <option value="Neurology">{isRtl ? 'الأعصاب' : 'Neurology'}</option>
                            <option value="Dermatology">{isRtl ? 'الأمراض الجلدية' : 'Dermatology'}</option>
                            <option value="Orthopedics">{isRtl ? 'العظام' : 'Orthopedics'}</option>
                            <option value="Pediatrics">{isRtl ? 'الأطفال' : 'Pediatrics'}</option>
                            <option value="Ophthalmology">{isRtl ? 'العيون' : 'Ophthalmology'}</option>
                            <option value="General">{isRtl ? 'طب عام' : 'General'}</option>
                          </select>
                          <ChevronRight size={20} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none ${isRtl ? 'left-4' : 'right-4'}`} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'رقم الترخيص' : 'License Number'}</label>
                        <input id="edit-doc-license" type="text" defaultValue={doctorData.license || 'LIC12345'} className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'عن الطبيب' : 'About'}</label>
                        <textarea
                          id="edit-doc-bio"
                          defaultValue={doctorData.bio || 'Experienced cardiologist'}
                          rows={4}
                          className="w-full bg-white border border-slate-200 rounded-[24px] px-5 py-4 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px] resize-none"
                          placeholder={isRtl ? 'نبذة عن الطبيب...' : 'Short bio...'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'رخصة طبية' : 'Medical License'}</label>
                        <label className="block bg-white border border-slate-200 rounded-[28px] h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50 transition-all overflow-hidden relative">
                          {doctorData.licenseImage ? (
                            <img src={doctorData.licenseImage} alt="Medical License" className="w-full h-full object-contain" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <ImageOff size={48} className="text-slate-800 mb-2" strokeWidth={1.5} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setDoctorData(prev => ({ ...prev, licenseImage: reader.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-50 z-20">
                    <div className="w-full max-w-lg mx-auto p-6">
                      <button
                        onClick={() => {
                          let newName = document.getElementById('edit-doc-name')?.value || doctorData.name;
                          const newEmail = document.getElementById('edit-doc-email')?.value || doctorData.email;
                          const newPhone = document.getElementById('edit-doc-phone')?.value || doctorData.phone;
                          const newExp = document.getElementById('edit-doc-exp')?.value || doctorData.experience;
                          const newPrice = document.getElementById('edit-doc-price')?.value || doctorData.price;
                          const newSpec = document.getElementById('edit-doc-spec')?.value || doctorData.specialization;
                          const newLicense = document.getElementById('edit-doc-license')?.value || doctorData.license;
                          const newBio = document.getElementById('edit-doc-bio')?.value || doctorData.bio;

                          // Ensure Dr. prefix
                          const prefix = isRtl ? 'د. ' : 'Dr. ';
                          const cleanName = newName.replace(/^(Dr\.\s*|د\.\s*)/i, '');
                          const finalName = prefix + cleanName;

                          const updatedData = {
                            ...doctorData,
                            name: finalName,
                            email: newEmail,
                            phone: newPhone,
                            experience: newExp,
                            price: newPrice,
                            specialization: newSpec,
                            license: newLicense,
                            bio: newBio
                          };
                          setDoctorData(updatedData);

                          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                          localStorage.setItem('user', JSON.stringify({
                            ...currentUser,
                            name: finalName,
                            email: newEmail,
                            phone: newPhone,
                            experience: newExp,
                            price: newPrice,
                            specialization: newSpec,
                            license: newLicense,
                            bio: newBio,
                            licenseImage: doctorData.licenseImage
                          }));
                          window.dispatchEvent(new Event('storage'));
                          setActiveProfileSubView(null);
                        }}
                        className="w-full bg-[#004A87] text-white py-4.5 rounded-full font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-blue-900/10 tracking-widest uppercase"
                      >
                        {isRtl ? 'حفظ' : 'SAVE'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeProfileSubView === 'password' && (
                /* Change Password Form — matching screenshot design */
                <div className="flex-1 w-full flex flex-col relative pb-28">
                  {/* Header with Back Arrow + Title */}
                  <div className="flex items-center gap-4 px-6 pt-8 pb-6">
                    <button
                      onClick={() => setActiveProfileSubView(null)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-colors"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {isRtl ? 'تغيير كلمة المرور' : 'Change Password'}
                    </h2>
                  </div>

                  {/* Form Fields — scrollable */}
                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="w-full max-w-lg mx-auto space-y-6">
                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                        <div className="relative">
                          <input
                            id="edit-current-pw"
                            type={showCurrentPw ? 'text' : 'password'}
                            placeholder={isRtl ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                            className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 pr-12 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 focus:outline-none ${isRtl ? 'left-4' : 'right-4'}`}
                          >
                            {showCurrentPw ? <Eye size={20} className="text-slate-500" /> : <EyeOff size={20} className="text-slate-500" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                        <div className="relative">
                          <input
                            id="edit-new-pw"
                            type={showNewPw ? 'text' : 'password'}
                            placeholder={isRtl ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                            className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 pr-12 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 focus:outline-none ${isRtl ? 'left-4' : 'right-4'}`}
                          >
                            {showNewPw ? <Eye size={20} className="text-slate-500" /> : <EyeOff size={20} className="text-slate-500" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-500 mb-2 font-medium">{isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
                        <div className="relative">
                          <input
                            id="edit-confirm-pw"
                            type={showConfirmPw ? 'text' : 'password'}
                            placeholder={isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                            className="w-full bg-white border border-slate-200 rounded-full px-5 py-4 pr-12 focus:outline-none focus:border-[#004A87] focus:ring-2 focus:ring-[#004A87]/20 text-slate-800 font-medium text-[15px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 focus:outline-none ${isRtl ? 'left-4' : 'right-4'}`}
                          >
                            {showConfirmPw ? <Eye size={20} className="text-slate-500" /> : <EyeOff size={20} className="text-slate-500" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Update Button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-50 z-20">
                    <div className="w-full max-w-lg mx-auto p-6">
                      <button
                        onClick={() => {
                          const currentVal = document.getElementById('edit-current-pw')?.value;
                          const newVal = document.getElementById('edit-new-pw')?.value;
                          const confirmVal = document.getElementById('edit-confirm-pw')?.value;

                          if (!currentVal || !newVal || !confirmVal) {
                            alert(isRtl ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
                            return;
                          }
                          if (newVal !== confirmVal) {
                            alert(isRtl ? 'كلمة المرور الجديدة غير متطابقة' : 'New passwords do not match');
                            return;
                          }

                          // Success action
                          alert(isRtl ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
                          setActiveProfileSubView(null);
                        }}
                        className="w-full bg-[#004A87] text-white py-4.5 rounded-full font-bold text-lg hover:bg-[#003a6b] transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-blue-900/10 text-center"
                      >
                        {isRtl ? 'تحديث كلمة المرور' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


        </div>

        {/* Dynamic Mobile Chat Interface overlay */}
        {currentChatPatient && (
          <div className="absolute inset-0 flex flex-col bg-[#F8F9FA] z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Chat Header */}
            <div className={`h-20 bg-white border-b border-slate-100 flex items-center gap-4 px-6 shrink-0 shadow-sm ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                onClick={() => setCurrentChatPatient(null)}
                className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-all flex items-center justify-center active:scale-95"
              >
                {isRtl ? <ChevronRight size={26} /> : <ChevronLeft size={26} />}
              </button>

              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Purple Avatar Circle */}
                <div className="w-12 h-12 rounded-full bg-[#E5E0F9] shrink-0 flex items-center justify-center font-bold text-[#6366F1] text-lg">
                  {currentChatPatient.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{currentChatPatient.name}</h2>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col bg-[#F8F9FA]">
              {chatMessages.map((msg) => {
                const isDoctor = msg.sender === 'doctor';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-5 py-3.5 shadow-sm text-[15px] font-semibold max-w-[75%] leading-relaxed ${isDoctor
                          ? 'bg-[#0F4C81] text-white rounded-3xl rounded-tr-none'
                          : 'bg-white text-slate-800 rounded-3xl rounded-tl-none border border-slate-100'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Footer Input */}
            <form
              onSubmit={handleSendMessage}
              className={`p-4 bg-white border-t border-slate-100 flex gap-3 items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                className={`flex-1 px-6 py-3.5 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-primary/5 text-[15px] text-slate-800 transition-all ${isRtl ? 'text-right' : 'text-left'
                  }`}
              />
              <button
                type="submit"
                className="w-12 h-12 rounded-full bg-[#0F4C81] text-white flex items-center justify-center hover:bg-[#0c3e6a] transition-all shrink-0 shadow-md hover:scale-105"
              >
                <Send size={20} className={isRtl ? 'rotate-180 ml-0.5' : 'mr-0.5'} />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorHome;
