import React from 'react';
import { Home, Calendar, Star, User, Settings, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '#' },
  { id: 'calender', label: 'Calendar', icon: Calendar, href: '#' },
  { id: 'reviews', label: 'Reviews', icon: Star, href: '#' },
  { id: 'profile', label: 'Profile', icon: User, href: '#' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#' },
];

const getDoctorData = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    return {
      name: parsed.name || parsed.firstName || 'Dr. Abdallah',
      specialty: parsed.specialization || 'Cardiologist',
      avatar: parsed.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMX-LuPwyrlnmNMdZpRwtmjLl6Kw1wfyvQGVWNviyTHioUjOpvaDEI8VSnQ_xKSnyslB7IqgaFmdNhjjcu2qn88F7gqmrj0nmUuq6nQ6Ou4Xksa0M2USaUuoqyoZWiBiOTlURxYLH3bJ8OMLeE9x2ODz84sVnk2g2WDSqCyBN0mWua_j5HNa68qfOpOV7R7HBMq2WBrfWhLL_Xan0smjs6wIs-As7WmUsDQEvx_4wJ16yIT-xvl5uIO704a18UJbYhRELqoQBTLQ'
    };
  }
  return {
    name: 'Dr. Abdallah',
    specialty: 'Cardiologist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMX-LuPwyrlnmNMdZpRwtmjLl6Kw1wfyvQGVWNviyTHioUjOpvaDEI8VSnQ_xKSnyslB7IqgaFmdNhjjcu2qn88F7gqmrj0nmUuq6nQ6Ou4Xksa0M2USaUuoqyoZWiBiOTlURxYLH3bJ8OMLeE9x2ODz84sVnk2g2WDSqCyBN0mWua_j5HNa68qfOpOV7R7HBMq2WBrfWhLL_Xan0smjs6wIs-As7WmUsDQEvx_4wJ16yIT-xvl5uIO704a18UJbYhRELqoQBTLQ'
  };
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'home', onNavigate }) => {
  const [doctorData, setDoctorData] = React.useState(getDoctorData());

  React.useEffect(() => {
    const syncData = () => {
      setDoctorData(getDoctorData());
    };
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img
          alt="As'alny Logo"
          className="h-12 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSMX-LuPwyrlnmNMdZpRwtmjLl6Kw1wfyvQGVWNviyTHioUjOpvaDEI8VSnQ_xKSnyslB7IqgaFmdNhjjcu2qn88F7gqmrj0nmUuq6nQ6Ou4Xksa0M2USaUuoqyoZWiBiOTlURxYLH3bJ8OMLeE9x2ODz84sVnk2g2WDSqCyBN0mWua_j5HNa68qfOpOV7R7HBMq2WBrfWhLL_Xan0smjs6wIs-As7WmUsDQEvx_4wJ16yIT-xvl5uIO704a18UJbYhRELqoQBTLQ"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4" role="navigation" aria-label="Main navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.(item.id);
              }}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'bg-blue-50 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Doctor Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <img
            alt={doctorData.name}
            className="w-10 h-10 rounded-full object-cover"
            src={doctorData.avatar}
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {doctorData.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {doctorData.specialty}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
