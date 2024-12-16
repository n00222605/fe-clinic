import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";
import { MantineProvider, AppShell, AppShellHeader, AppShellFooter, AppShellMain } from '@mantine/core';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './styling/Navbar.css';

import Navbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';

import SingleDoctor from "./pages/doctors/SingleDoctor";
import Create from './pages/doctors/Create';
import Edit from './pages/doctors/Edit';

import SingleAppointment from './pages/appointments/SingleAppointment';
import CreateAppointment from './pages/appointments/Create';
import EditAppointment from './pages/appointments/Edit';

import SinglePatient from './pages/patients/SinglePatient';
import CreatePatient from './pages/patients/Create';
import EditPatient from './pages/patients/Edit';

export const UserContext = createContext();

const App = () => {
    return (
        <div>
            <AuthProvider>
                <MantineProvider withGlobalStyles withNormalizeCSS>
                    <Router>
                        <AppShell
                            padding="md"
                            header={
                                <AppShellHeader height={60} p="xs">
                                    Clinic Manager
                                </AppShellHeader>
                            }
                            footer={<AppShellFooter height={60} p="xs"></AppShellFooter>}
                        >
                            <div className="custom-navbar">
                                <Navbar />
                            </div>

                            {/* Main Content */}
                            <AppShellMain style={{ marginLeft: "300px" }}>
                                <Routes>
                                    <Route path="/" element={<Home />} />

                                    {/* Protected Routes */}
                                    <Route path="/" element={<ProtectedRoute />}>
                                        {/* Doctor Routes */}
                                        <Route path="/doctors/create" element={<Create />} />
                                        <Route path="/doctors/:id/edit" element={<Edit />} />
                                        <Route path="/doctors/:id" element={<SingleDoctor />} />

                                        {/* Appointment Routes */}
                                        <Route path="/appointments/create" element={<CreateAppointment />} />
                                        <Route path="/appointments/:id/edit" element={<EditAppointment />} />
                                        <Route path="/appointments/:id" element={<SingleAppointment />} />

                                        {/* Patient Routes */}
                                        <Route path="/patients/create" element={<CreatePatient />} />
                                        <Route path="/patients/:id/edit" element={<EditPatient />} />
                                        <Route path="/patients/:id" element={<SinglePatient />} />
                                    </Route>

                                    {/* Authentication Routes */}
                                    <Route path="/login" element={<LoginForm />} />
                                    <Route path="/register" element={<RegisterForm />} />
                                </Routes>
                            </AppShellMain>
                        </AppShell>
                    </Router>
                </MantineProvider>
            </AuthProvider>
        </div>
    );
};

export default App;