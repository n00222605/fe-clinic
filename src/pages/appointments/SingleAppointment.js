import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Text } from "@mantine/core";

import "../../styling/singleappointment.css"; // Import the new CSS

const SingleAppointment = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        axios
            .get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setAppointment(res.data);

                const doctorReq = axios.get(
                    `https://fed-medical-clinic-api.vercel.app/doctors/${res.data.doctor_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const patientReq = axios.get(
                    `https://fed-medical-clinic-api.vercel.app/patients/${res.data.patient_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                return Promise.all([doctorReq, patientReq]);
            })
            .then(([doctorRes, patientRes]) => {
                setDoctor(doctorRes.data);
                setPatient(patientRes.data);
            })
            .catch((err) => console.error(err));
    }, [id, token]);

    if (!appointment || !doctor || !patient) {
        return "Loading...";
    }

    return (
        <div className="single-appointment-container">
            <Link to={`/appointments/${id}/edit`} className="edit-link">
                Edit Appointment
            </Link>
            <h1>Appointment Details</h1>
            <Text className="appointment-detail">
                <strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}
            </Text>
            <Text className="appointment-detail">
                <strong>Doctor:</strong> Dr. {doctor.first_name} {doctor.last_name}
            </Text>
            <Text className="appointment-detail">
                <strong>Patient:</strong> {patient.first_name} {patient.last_name}
            </Text>
        </div>
    );
};

export default SingleAppointment;
