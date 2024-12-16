import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { Select, Button, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import "../../styling/edit.css";

const Edit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
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
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, appointmentRes] = await Promise.all([
          axios.get("https://fed-medical-clinic-api.vercel.app/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://fed-medical-clinic-api.vercel.app/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);

        if (!isFormInitialized) {
          form.setValues({
            appointment_date: new Date(appointmentRes.data.appointment_date),
            doctor_id: appointmentRes.data.doctor_id.toString(),
            patient_id: appointmentRes.data.patient_id.toString(),
          });
          setIsFormInitialized(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id, token, isFormInitialized]);

  const handleSubmit = async () => {
    try {
      const submissionValues = {
        ...form.values,
        appointment_date: form.values.appointment_date
          ? new Date(form.values.appointment_date).toISOString()
          : null,
        doctor_id: Number(form.values.doctor_id),
        patient_id: Number(form.values.patient_id),
      };

      console.log("Submitting values:", submissionValues);

      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/appointment/${id}`,
        submissionValues,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/appointments/${id}`, { replace: true });
    } catch (err) {
      console.error("Error updating appointment:", err);

      if (err.response?.status === 422) {
        const errors = err.response.data.error.issues;
        form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
      }
    }
  };

  return (
    <div className="edit-form-container">
      <h1>Edit Appointment</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <DatePicker
          label="Appointment Date"
          withAsterisk
          placeholder="Select a date"
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
          Update Appointment
        </Button>
      </form>
    </div>
  );
};

export default Edit;
