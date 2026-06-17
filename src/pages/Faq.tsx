// pages/admin/Faq.tsx
import Header from '../components/Layout/Header';
import FaqPage from './FaqPage';

export default function Faq() {
  return (
    <>
      <Header title="مدیریت سوالات متداول" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <FaqPage />
        </div>
      </div>
    </>
  );
}