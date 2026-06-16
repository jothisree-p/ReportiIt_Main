import { Routes, Route } from "react-router-dom";

import SplashScreen from "./SplashScreen";
import About from "./About";
import Contact from "./Contact";
import LegalPage from "./LegalPage";
import UserType from "./UserType";
import CitizenLogin from "./CitizenLogin";
import CitizenDashboard from "./CitizenDashboard";
import ReportCrime from "./ReportCrime";
import ReportDetails from "./ReportDetails";
import MyComplaints from  "./MyComplaints";
import CitizenComplaintDetails from "./CitizenComplaintDetails";
import CitizenSignup from "./CitizenSignup";
import CitizenProfile from "./CitizenProfile";
import TrackStatus from "./TrackStatus";
import AIChat from "./AIChat";
import OfficerLogin from "./OfficerLogin";
import OfficerDashboard from "./OfficerDashboard";
import AssignedCases from "./AssignedCases";
import OfficerComplaintDetails from "./OfficerComplaintDetails";
import OfficerStatistics from "./OfficerStatistics";
import OfficerProfile from "./OfficerProfile";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import ManageOfficers from "./ManageOfficers";
import EditOfficer from "./EditOfficer";
import AddOfficer from "./AddOfficer";
import OfficerDetails from "./OfficerDetails";
import AdminReports from "./AdminReports";
import Categories from "./Categories";
import AdminProfile from "./AdminProfile";
import AdminStatistics from "./AdminStatistics";
import VerifyOtp from "./VerifyOtp";
import AllNotifications from "./AllNotifications";
import FeedbackDetails from "./FeedbackDetails";
function App() {
  return (
    <Routes>

      <Route path="/" element={<SplashScreen />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />

      <Route path="/terms-conditions" element={<LegalPage type="terms" />} />

      <Route path="/user-type" element={<UserType />} />

      <Route
        path="/citizen-dashboard"
        element={<CitizenDashboard />}
      />
      <Route
  path="/citizen-login"
  element={<CitizenLogin />}
/>
<Route path="/report-crime" element={<ReportCrime />} />
<Route path="/report-details" element={<ReportDetails />} />
<Route path="/my-complaints" element={<MyComplaints />} />
    <Route
  path="/citizen-complaint-details"
  element={<CitizenComplaintDetails />}
/>
<Route
  path="/citizen-signup"
  element={<CitizenSignup />}
/>
<Route
  path="/citizen-profile"
  element={<CitizenProfile />}
/>
<Route
path="/track-status"
element={<TrackStatus />}
/>
<Route
  path="/ai-chat"
  element={<AIChat />}
/>
<Route
  path="/officer-login"
  element={<OfficerLogin />}
/>
<Route
  path="/officer-dashboard"
  element={<OfficerDashboard />}
/>
<Route
  path="/assigned-cases"
  element={<AssignedCases />}
/>
<Route
  path="/officer-complaint-details"
  element={<OfficerComplaintDetails />}
/>
<Route
  path="/officer-statistics"
  element={<OfficerStatistics />}
/>
<Route
  path="/officer-profile"
  element={<OfficerProfile />}
/>
<Route
  path="/admin-login"
  element={<AdminLogin />}
/>
<Route
  path="/admin-dashboard"
  element={<AdminDashboard />}
/>
<Route
  path="/manage-users"
  element={<ManageUsers />}
/>
<Route
  path="/manage-officers"
  element={<ManageOfficers />}
/>
<Route
  path="/edit-officer"
  element={<EditOfficer />}
/>
<Route
  path="/add-officer"
  element={<AddOfficer />}
/>
<Route
  path="/officer-details/:id"
  element={<OfficerDetails />}
/>
<Route
  path="/admin-reports"
  element={<AdminReports />}
/>
<Route
  path="/categories"
  element={<Categories />}
/>
<Route
  path="/admin-profile"
  element={<AdminProfile />}
/>
<Route
  path="/admin-statistics"
  element={<AdminStatistics />}
/>
<Route
  path="/verify-otp"
  element={<VerifyOtp />}
/>
<Route
  path="/notifications"
  element={<AllNotifications />}
/>
<Route
  path="/feedback-details"
  element={<FeedbackDetails />}
/>
</Routes>

  );
}

export default App;
