import { useState } from 'react';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import GeneralLedgerTab from '../../components/Accounting/GeneralLedgerTab';
import UserWalletsTab from '../../components/Accounting/UserWalletsTab';
import MarginTab from '../../components/Accounting/MarginTab';
import CreditTab from '../../components/Accounting/CreditTab';
import RevenueTab from '../../components/Accounting/RevenueTab';
import SettlementsTab from '../../components/Accounting/SettlementsTab';
import { ACCOUNTING_KPI, SETTLEMENTS } from '../../data/accounting';
import FinancialAccountsPage from './FinancialAccpounts';

export default function Khazaneh() {

  return (
    <>
      <Header title="خزانه داری" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
            <FinancialAccountsPage />
        </div>
      </div>
    </>
  );
}
