// pages/admin/SystemConfig.tsx
import Header from '../components/Layout/Header';
import SystemConfigPage from './SystemConfigPage';

export default function SystemConfig() {
  return (
    <>
      <Header title="تنظیمات سیستم" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <SystemConfigPage />
        </div>
      </div>
    </>
  );
}