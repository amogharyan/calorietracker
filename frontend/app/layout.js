// app/layout.jsx
import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Calorie Tracker',
  description: 'Track your daily meals and calories easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Navbar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
