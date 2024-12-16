import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex, Loader } from "@mantine/core";
import { useAuth } from "../utils/useAuth";

import '../styling/buttons.css';

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const navigate = useNavigate();
    const msg = useLocation()?.state?.msg || null;

    const axiosInstance = axios.create({
        baseURL: "https://fed-medical-clinic-api.vercel.app",
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
                axiosInstance.get("/doctors"),
                axiosInstance.get("/patients"),
                axiosInstance.get("/appointments"),
            ]);
            setDoctors(doctorsRes.data);
            setPatients(patientsRes.data);
            setAppointments(appointmentsRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const deleteDoctor = async (id) => {
        try {
            await axiosInstance.delete(`/doctors/${id}`);
            setDoctors((prev) => prev.filter((doc) => doc.id !== id));
        } catch (e) {
            console.error("Error deleting doctor:", e);
        }
    };

    const deletePatient = async (id) => {
        try {
            await axiosInstance.delete(`/patients/${id}`);
            setPatients((prev) => prev.filter((pat) => pat.id !== id));
        } catch (e) {
            console.error("Error deleting patient:", e);
        }
    };

    const deleteAppointment = async (id) => {
        try {
            await axiosInstance.delete(`/appointments/${id}`);
            setAppointments((prev) => prev.filter((app) => app.id !== id));
        } catch (e) {
            console.error("Error deleting appointment:", e);
        }
    };

    const formatDate = (timestamp) => new Date(timestamp).toLocaleString();

    const getDoctorName = (id) =>
        doctors.find((doc) => doc.id === id)?.first_name + " " +
        doctors.find((doc) => doc.id === id)?.last_name;

    const getPatientName = (id) =>
        patients.find((pat) => pat.id === id)?.first_name + " " +
        patients.find((pat) => pat.id === id)?.last_name;

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Loader size="lg" />
            </Flex>
        );
    }

    return (
        <div>
            {msg && <Text mb={10} color="red">{msg}</Text>}


            <div className="button-container">
                <Button onClick={() => navigate("/doctors/create")}>
                    Create Doctor
                </Button>
                <Button onClick={() => navigate("/patients/create")}>
                    Add Patient
                </Button>
                <Button onClick={() => navigate("/appointments/create")}>
                    Create Appointment
                </Button>
            </div>

            {/* Doctors Section */}
            <h1>Doctors</h1>
            <SimpleGrid cols={3} mb={20}>
                {doctors.map((doctor) => (
                    <Card shadow="sm" key={doctor.id}>
                        <h2>Dr {doctor.first_name} {doctor.last_name}</h2>
                        <p>Email: {doctor.email}</p>
                        <p>Specialization: {doctor.specialisation}</p>
                        <Flex justify="space-between">
                            <Button onClick={() => navigate(`/doctors/${doctor.id}`)}>View</Button>
                            <Button color="red" onClick={() => deleteDoctor(doctor.id)}>🗑️ Delete</Button>
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Patients Section */}
            <h1>Patients</h1>
            <SimpleGrid cols={3} mb={20}>
                {patients.map((patient) => (
                    <Card shadow="sm" key={patient.id}>
                        <h2>{patient.first_name} {patient.last_name}</h2>
                        <p>Phone: {patient.phone}</p>
                        <p>Address: {patient.address}</p>
                        <Flex justify="space-between">
                            <Button onClick={() => navigate(`/patients/${patient.id}`)}>View</Button>
                            <Button color="red" onClick={() => deletePatient(patient.id)}>🗑️ Delete</Button>
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Appointments Section */}
            <h1>Appointments</h1>
            <SimpleGrid cols={3}>
                {appointments.map((appointment) => (
                    <Card shadow="sm" key={appointment.id}>
                        <h2>{formatDate(appointment.appointment_date)}</h2>
                        <p>Doctor: {getDoctorName(appointment.doctor_id)}</p>
                        <p>Patient: {getPatientName(appointment.patient_id)}</p>
                        <Flex justify="space-between">
                            <Button onClick={() => navigate(`/appointments/${appointment.id}`)}>View</Button>
                            <Button color="red" onClick={() => deleteAppointment(appointment.id)}>🗑️ Delete</Button>
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
};

export default Home;
