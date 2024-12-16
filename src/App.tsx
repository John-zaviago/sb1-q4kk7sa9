import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SignUpForm } from '@/components/auth/signup-form';
import { LoginForm } from '@/components/auth/login-form';
import { AuthRoute, ProtectedRoute } from '@/components/auth/auth-routes';
import { ProductsPage } from '@/features/products/pages/products-page';
import { NewProductPage } from '@/features/products/pages/new-product-page';
import { EditProductPage } from '@/features/products/pages/edit-product-page';
import { StorePage } from '@/features/store/pages/store-page';
import { ProductPage } from '@/features/store/pages/product-page';
import { CheckoutPage } from '@/features/store/pages/checkout-page';
import { CartProvider } from '@/features/store/context/cart-context';
import { CustomersPage } from '@/features/customers/pages/customers-page';
import { NewCustomerPage } from '@/features/customers/pages/new-customer-page';
import { EditCustomerPage } from '@/features/customers/pages/edit-customer-page';
import { OrdersPage } from '@/features/orders/pages/orders-page';
import { NewOrderPage } from '@/features/orders/pages/new-order-page';
import { EditOrderPage } from '@/features/orders/pages/edit-order-page';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Store Routes */}
          <Route path="/store/:storeName" element={<StorePage />} />
          <Route path="/store/:storeName/products/:productId" element={<ProductPage />} />
          <Route path="/store/:storeName/checkout" element={<CheckoutPage />} />

          {/* Auth Routes */}
          <Route
            path="/auth/login"
            element={
              <AuthRoute>
                <LoginForm />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <AuthRoute>
                <SignUpForm />
              </AuthRoute>
            }
          />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>Dashboard Overview</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<NewProductPage />} />
            <Route path="products/:id" element={<EditProductPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<NewCustomerPage />} />
            <Route path="customers/:id" element={<EditCustomerPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/new" element={<NewOrderPage />} />
            <Route path="orders/:id" element={<EditOrderPage />} />
            <Route path="profile" element={<div>Profile Settings</div>} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Toaster />
      </Router>
    </CartProvider>
  );
}