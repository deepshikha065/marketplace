import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NiceRegistry } from './NiceRegistry';
import { ROUTES } from './constants/routes';
import Dashboard from './pages/Dashboard';
import AuthLayout from './components/onboarding/AuthLayout';
import Login from './pages/onboarding/Login';
import Signup from './pages/onboarding/Signup';
import ForgotPassword from './pages/onboarding/ForgotPassword';
import MainLayout from './components/common/MainLayout';
import Marketplace from './pages/Marketplace/Marketplace';
import ChangePassword from './pages/ChangePassword';
import ProductDetails from './pages/ProductDetails';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.SIGNUP,
        element: <Signup />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.MARKETPLACE,
        element: <Marketplace />,
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.CHANGE_PASSWORD,
        element: <ChangePassword />,
      },
      {
        path: ROUTES.PRODUCT_DETAILS,
        element: <ProductDetails />,
      },
      {
        path: ROUTES.CART,
        element: <Cart />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <NiceRegistry>
        <RouterProvider router={router} />
      </NiceRegistry>
    </Provider>
  )
}

export default App
