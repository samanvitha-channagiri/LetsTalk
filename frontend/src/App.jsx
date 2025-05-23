import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from "react-router";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
const App = () => {
  //isLoading and authUser are objects,that's why later we convert to booleans
  const { isLoading, authUser } = useAuthUser();
   const {theme,setTheme}=useThemeStore()
  


  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  if (isLoading) return <PageLoader />;

  

  return (
    <div data-theme={theme} className=" h-screen ">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
             <Layout showSidebar={true}>
               <HomePage />
               </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded?"/":'/onboarding'}/>}
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated&&isOnboarded ? (
             <Layout>
              <NotificationsPage/>
             </Layout>
            ) : <Navigate to={!isAuthenticated?'/login':'/onboarding'}/>
          }
        />
        <Route
          path="/call/:id"
          element={isAuthenticated&&isOnboarded ? <CallPage /> : <Navigate to={!isAuthenticated?'/login':'/onboarding'} />}
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated&&isOnboarded?(
            <Layout showSidebar={false}>
              <ChatPage/>
              </Layout>

          ):(<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>

          )}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
