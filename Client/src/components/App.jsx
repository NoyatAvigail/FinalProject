import { useState, createContext, useMemo } from 'react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie'
import Navigation from './Navigation'
import LogIn from './LogIn'
import Register from './Register'
import Home from './Home'
import Info from './Info'
import Volunteers from './Volunteers'
import VolunteerFixedShifts from './volunteers/VolunteerFixedShifts';
import VolunteerProfile from './volunteers/VolunteerProfile';
import VolunteerCertificate from './volunteers/VolunteerCertificate';
import VolunteerShifts from './volunteers/VolunteerShifts';
import VolunteerRequests from './volunteers/VolunteerRequests';
import Contacts from './Contacts'
import ContactPatientInfo from './contacts/ContactPatientInfo';
import ContactRequests from './contacts/ContactRequests';
import ContactNewRequest from './contacts/ContactNewRequest';
import ContactAddPatient from './contacts/ContactAddPatient';
import ContactThanks from './contacts/ContactThanks';
import ContactProfile from './contacts/ContactProfile';
import { CodesProvider } from './Models';
import ErrorPage from './ErrorPage'
import '../style/App.css'

export const CurrentUser = createContext([]);

function App() {
  const initialCurrentUser = useMemo(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [isShowInfo, setIsShowInfo] = useState(0);

  return (
    <CodesProvider>
      <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
        <Navigation currentUser={currentUser} setIsShowInfo={setIsShowInfo} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/volunteer/:id" element={<Volunteers />} />
          <Route path="/volunteer/:id/home" element={<Volunteers />} />
          <Route path="/volunteer/:id/shifts" element={<VolunteerShifts />} />
          <Route path="/volunteer/:id/permanentShifts" element={<VolunteerFixedShifts />} />
          <Route path="/volunteer/:id/requests" element={<VolunteerRequests />} />
          <Route path="/volunteer/:id/profile" element={<VolunteerProfile />} />
          <Route path="/volunteer/:id/certificate" element={<VolunteerCertificate />} />
          <Route path="/contactperson/:id" element={<Contacts />} />
          <Route path="/contactperson/:id/home" element={<Contacts />} />
          <Route path="/contactperson/:id/requests" element={<ContactRequests />} />
          <Route path="/contactperson/:id/new-request" element={<ContactNewRequest />} />
          <Route path="/contactperson/:id/profile" element={<ContactProfile />} />
          <Route path="/contactperson/:id/patient/patient-info" element={<ContactPatientInfo />} />
          <Route path="/contactperson/:id/patient/add-patient" element={<ContactAddPatient />} />
          <Route path="/contactperson/:id/patient/profile" element={<ContactProfile />} />
          <Route path="/contactperson/:id/thanks" element={<ContactThanks />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        {isShowInfo == 1 && <Info setIsShowInfo={setIsShowInfo} />}
      </CurrentUser.Provider>
    </CodesProvider>
  )
}

export default App