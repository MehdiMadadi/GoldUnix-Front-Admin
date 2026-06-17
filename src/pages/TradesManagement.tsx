// pages/admin/TradesManagement.tsx
import Header from '../components/Layout/Header';
import TradesManagementPage from './TradesManagementPage';

export default function TradesManagement() {
  return (
    <>
      <Header title="مدیریت معاملات" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <TradesManagementPage />
        </div>
      </div>
    </>
  );
}