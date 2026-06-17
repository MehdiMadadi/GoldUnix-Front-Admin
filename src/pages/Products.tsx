// pages/admin/Products.tsx
import Header from '../components/Layout/Header';
import ProductsPage from './ProductsPage';

export default function Products() {
  return (
    <>
      <Header title="مدیریت محصولات" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">
          <ProductsPage />
        </div>
      </div>
    </>
  );
}