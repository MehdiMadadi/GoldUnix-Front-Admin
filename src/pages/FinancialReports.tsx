// pages/admin/FinancialReports.tsx
import Header from '../components/Layout/Header';
import FinancialReportsPage from './FinancialReportsPage';

export default function FinancialReports() {
  return (
    <>
      <Header title="گزارشات مالی" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <FinancialReportsPage />
        </div>
      </div>
    </>
  );
}