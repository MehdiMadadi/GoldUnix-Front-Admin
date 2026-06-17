import Header from '../../components/Layout/Header';
import CashoutsPage from './CashoutsPage';

export default function CashoutPage() {

  return (
    <>
      <Header title="مدیریت درخواست برداتش وجه" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
            <CashoutsPage />
        </div>
      </div>
    </>
  );
}
