import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Compass, 
  Grid, 
  List, 
  Anchor, 
  Scissors, 
  User, 
  Folder, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { t } = useTranslation('marketplace');

  const menuItems = [
    { id: 'explore', icon: Compass, label: t('sidebar.explore') },
    { id: 'collections', icon: Grid, label: t('sidebar.collections') },
    { id: 'items', icon: List, label: t('sidebar.items') },
    { id: 'activity', icon: Anchor, label: t('sidebar.activity') },
    { id: 'create', icon: Scissors, label: t('sidebar.create') },
    { id: 'profile', icon: User, label: t('sidebar.profile') },
    { id: 'portfolio', icon: Folder, label: t('sidebar.portfolio') },
    { id: 'settings', icon: Settings, label: t('sidebar.settings') },
    { id: 'help', icon: HelpCircle, label: t('sidebar.help') }
  ];

  return (
    <nav className="marketplace-sidebar">
      <div className="sidebar-container">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L30 16L16 30L2 16L16 2Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                  title={item.label}
                >
                  <Icon size={20} />
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}; 