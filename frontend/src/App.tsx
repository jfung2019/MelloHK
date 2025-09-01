import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/NavBar';
import { useAuthStore } from './store/store';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

function App() {
  const { authUser, checkAuthentication, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className='flex gap-2 items-center'>
        <LoaderCircle className='h-10 w-10 animate-spin' />
        Loading...
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full mx-auto px-8">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
            <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/setting" element={<SettingPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </div>
  )
}

export default App
