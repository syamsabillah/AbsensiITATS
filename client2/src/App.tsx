import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Usermanagement from './pages/Usermanagement';
import History from './pages/History';
import ScanQRCodePage from './pages/scanQr';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isAuthRoute =
    pathname === '/' || pathname === '/signup' || pathname === '/scan';

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {isAuthRoute ? (
        <>
          {/* Auth routes without DefaultLayout */}
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/scan"
            element={
              <>
                <PageTitle title="Scan QR" />
                <ScanQRCodePage />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <PageTitle title="Signup" />
                <SignUp />
              </>
            }
          />
        </>
      ) : (
        <Route>
          {/* Non-auth routes within DefaultLayout */}
          <Route
            path="/dashboard"
            element={
              <>
                <PageTitle title="Dashboard" />
                <DefaultLayout children={<ECommerce />} />
              </>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <>
                <PageTitle title="User Management" />
                <DefaultLayout children={<Usermanagement />} />
              </>
            }
          />
          <Route
            path="/history"
            element={
              <>
                <PageTitle title="History" />
                <DefaultLayout children={<History />} />
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar" />
                <DefaultLayout children={<Calendar />} />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile" />
                <DefaultLayout children={<Profile />} />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements" />
                <DefaultLayout children={<FormElements />} />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout" />
                <DefaultLayout children={<FormLayout />} />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables" />
                <DefaultLayout children={<Tables />} />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings" />
                <DefaultLayout children={<Settings />} />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart" />
                <DefaultLayout children={<Chart />} />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons" />
                <Buttons />
              </>
            }
          />
        </Route>
      )}
    </Routes>
  );
}

export default App;
