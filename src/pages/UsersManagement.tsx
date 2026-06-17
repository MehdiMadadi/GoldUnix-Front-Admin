// pages/admin/Users.tsx
import Header from '../components/Layout/Header';
import UsersPage from './UsersPage';

export default function UsersManagement() {
  return (
    <>
      <Header title="مدیریت کاربران" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <UsersPage />
        </div>
      </div>
    </>
  );
}