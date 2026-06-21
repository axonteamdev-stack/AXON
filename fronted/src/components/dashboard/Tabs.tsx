import React, { useState } from 'react';
import clsx from 'clsx';

export type TabId = 'chats' | 'requests';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: 'chats', label: 'Chats' },
  { id: 'requests', label: 'Requests' },
];

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const [focusedTab, setFocusedTab] = useState<TabId | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabId) => {
    const currentIndex = tabs.findIndex(t => t.id === tabId);
    
    if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      e.preventDefault();
      onTabChange(tabs[currentIndex + 1].id);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      onTabChange(tabs[currentIndex - 1].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onTabChange(tabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      onTabChange(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div 
      className="flex border-b border-gray-200 mb-8" 
      role="tablist"
      aria-label="Dashboard tabs"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isFocused = focusedTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            onBlur={() => setFocusedTab(null)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={clsx(
              'relative px-8 py-4 text-sm font-semibold transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
              isActive 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-primary'
            )}
          >
            {tab.label}
            {/* Animated underline */}
            <span 
              className={clsx(
                'absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform transition-transform duration-300',
                isActive ? 'scale-x-100' : 'scale-x-0'
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
