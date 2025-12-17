import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
// Import other providers here as you create them
// import { RestaurantProvider } from './RestaurantContext';
// import { ToastProvider } from './ToastContext';

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {/* Add more providers here as needed */}
      {/* <RestaurantProvider> */}
      {/* <ToastProvider> */}
      {children}
      {/* </ToastProvider> */}
      {/* </RestaurantProvider> */}
    </AuthProvider>
  );
}