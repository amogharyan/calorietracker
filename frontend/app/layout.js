// app/layout.jsx
import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata = {
  title: 'CalorieTracker - Track Your Nutrition',
  description: 'Monitor your daily calorie intake, track macronutrients, and discover healthy dining options across campus.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
