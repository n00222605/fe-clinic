import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { Select, Button, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates"; // Corrected import

import "../../styling/create.css"; // Correct styling

const Create = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const form = useForm({
        initialValues: {
            appointment_date: null,
            doctor_id: "",
            patient_id: "",
        },
        validate: {
            appointment_date: (value) => (value ? null : "Appointment date is required"),
            doctor_id: (value) => (value ? null : "Please select a doctor"),
            patient_id: (value) => (value ? null : "Please select a patient"),
        },
    });

    useEffect(() => {
        // Fetch doctors and patients for the dropdowns
        axios
            .get("https://fed-medical-clinic-api.vercel.app/doctors", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setDoctors(res.data))
            .catch((err) => console.error("Error fetching doctors:", err));

        axios
            .get("https://fed-medical-clinic-api.vercel.app/patients", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPatients(res.data))
            .catch((err) => console.error("Error fetching patients:", err));
    }, [token]);

    const handleSubmit = () => {
        // Convert doctor_id and patient_id to numbers
        const submissionValues = {
            ...form.values,
            doctor_id: Number(form.values.doctor_id),
            patient_id: Number(form.values.patient_id),
        };

        axios
            .post("https://fed-medical-clinic-api.vercel.app/appointments", submissionValues, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log("Appointment created:", res.data);
                navigate(`/appointments/${res.data.id}`);
            })
            .catch((err) => {
                console.error("Error creating appointment:", err);

                // Handle validation errors returned by the API
                if (err.response?.status === 422) {
                    const errors = err.response.data.error.issues;
                    form.setErrors(
                        Object.fromEntries(errors.map((error) => [error.path[0], error.message]))
                    );
                }
            });
    };


    return (
        <div className="create-form-container">
            <h1>Create Appointment</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <DatePicker
                    label="Appointment Date"
                    withAsterisk
                    placeholder="Pick a date"
                    {...form.getInputProps("appointment_date")}
                />
                <Select
                    label="Doctor"
                    withAsterisk
                    placeholder="Select a doctor"
                    data={doctors.map((doctor) => ({
                        value: doctor.id.toString(),
                        label: `Dr. ${doctor.first_name} ${doctor.last_name}`,
                    }))}
                    {...form.getInputProps("doctor_id")}
                />
                <Select
                    label="Patient"
                    withAsterisk
                    placeholder="Select a patient"
                    data={patients.map((patient) => ({
                        value: patient.id.toString(),
                        label: `${patient.first_name} ${patient.last_name}`,
                    }))}
                    {...form.getInputProps("patient_id")}
                />
                <Button mt={20} type="submit">
                    Create Appointment
                </Button>
            </form>
        </div>
    );
};

export default Create;
