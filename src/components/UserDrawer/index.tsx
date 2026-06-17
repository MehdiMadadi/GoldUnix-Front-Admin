// UserDrawer.tsx - آپدیت شده
import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiBriefcase, FiUser, FiInfo, FiFileText, FiCreditCard, FiTrendingUp } from 'react-icons/fi';
import Badge from '../UI/Badge';
import { DRAWER_TABS, type DrawerTab } from './UserDrawer.types';
import InfoTab from './tabs/InfoTab';
import WalletTab from './tabs/WalletTab';
import OrdersTab from './tabs/OrdersTab';
import StakingTab from './tabs/StakingTab';
import { Api, UserAccountDto } from '../../lib/client';

interface UserDrawerProps {
  user: UserAccountDto | null;
  onClose: () => void;
}

// Icon mapping for tabs
const TAB_ICONS: Record<DrawerTab, typeof FiInfo> = {
  info: FiInfo,
  wallet: FiCreditCard,
  orders: FiFileText,
  staking: FiTrendingUp,
};

function getTypeBadge(type: UserAccountDto['type']) {
  if (type === 'trade') return <Badge variant="primary" small>صنف</Badge>;
  return <Badge variant="neutral" small>عادی</Badge>;
}

function getStatusBadge(status: UserAccountDto['status']) {
  if (status === 'ACTIVE') return <Badge variant="success" small>فعال</Badge>;
  if (status === 'BLOCKED') return <Badge variant="danger" small>مسدود</Badge>;
  return <Badge variant="neutral" small>در انتظار</Badge>;
}

export default function UserDrawer({ user, onClose }: UserDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('info');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setActiveTab('info');
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [user]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 280);
  }, [onClose]);

  const handleUserUpdate = (updatedUser: UserAccountDto) => {
    // Handle user update if needed
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (user) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [user, handleClose]);

  if (!user) return null;

  const userTypeIcon = user.type === 'trade' ? FiBriefcase : FiUser;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-280 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`user-drawer ${isVisible ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`جزئیات کاربر ${user.firstName} ${user.lastName}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {React.createElement(userTypeIcon, { size: 22, className: 'text-primary' })}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {getTypeBadge(user.type)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-500"
              aria-label="بستن"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center border-b border-border-light dark:border-border-dark flex-shrink-0 overflow-x-auto">
            {DRAWER_TABS.map(tab => {
              const IconComponent = TAB_ICONS[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'info' && (
              <div className="h-full overflow-y-auto">
                <InfoTab user={user} onUserUpdate={handleUserUpdate} />
              </div>
            )}
            
            {activeTab === 'wallet' && (
              <WalletTab userId={user.id!} />
            )}
            
            {activeTab === 'orders' && (
              <OrdersTab userId={user.username!} />
            )}
            
            {activeTab === 'staking' && (
              <StakingTab userId={user.id!} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}