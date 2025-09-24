import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import NavBar from './components/NavBar';
import { useAuthStore, useThemeStore } from './store/store';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import NotificationPage from './pages/NotificationPage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import MainLayout from './components/MainLayout';
import Loading from './components/Loading';

function App() {
  const { authUser, checkAuthentication, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (isCheckingAuth && !authUser) return <Loading />;
  console.log('profileComplete', authUser);

  return (
    <div className="flex flex-col min-h-screen" data-theme={theme}>
      <div className="w-full mx-auto">
        <NavBar />
        <Routes>
          <Route path="/" element={
            authUser && authUser.profileComplete
              ?
              <MainLayout>
                <HomePage />
              </MainLayout>
              : <Navigate to={!authUser ? "/login" : "/profileCompletion"} />
          } />
          <Route path="/signup" element={authUser ? <Navigate to={authUser.profileComplete ? "/" : "/profileCompletion"} /> : <SignUpPage />} />
          <Route path="/login" element={authUser ? <Navigate to={authUser.profileComplete ? "/" : "/profileCompletion"} /> : <LoginPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profileCompletion" element={
            authUser && !authUser.profileComplete
              ?
              <ProfileCompletionPage />
              : <Navigate to="/login" />
          }
          />
          <Route path="/chat/:id" element={
            authUser && authUser.profileComplete
              ?
                <ChatPage />
              : <Navigate to={!authUser ? "/login" : "/profileCompletion"} />
          } />
          <Route path="/notifications" element={
            authUser && authUser.profileComplete
              ?
              <MainLayout>
                <NotificationPage />
              </MainLayout>
              : <Navigate to={!authUser ? "/login" : "/profileCompletion"} />
          } />
          <Route path="/setting" element={<SettingPage />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  )
}

export default App
