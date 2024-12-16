import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { TextInput, Select, Text, Button } from "@mantine/core";

import "../../styling/edit.css";

const Edit = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "General Practitioner",
    },
    validate: {
      first_name: (value) =>
        value.length > 2 && value.length < 255 ? null : "First name must be between 2 and 255 characters",
      last_name: (value) =>
        value.length > 2 && value.length < 255 ? null : "Last name must be between 2 and 255 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length === 10 ? null : "Phone number must be 10 digits"),
    },
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(
          `https://fed-medical-clinic-api.vercel.app/doctors/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        form.setValues(res.data); // Initialize the form with fetched data
        setIsFormInitialized(true); // Ensure initialization happens only once
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };

    if (!isFormInitialized) {
      fetchDoctorData();
    }
  }, [id, token, form, isFormInitialized]);

  const handleSubmit = async () => {
    try {
      await axios.patch(
        `https://fed-medical-clinic-api.vercel.app/doctors/${id}`,
        form.values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/`, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const errors = err.response.data.error.issues;
        form.setErrors(
          Object.fromEntries(errors.map((error) => [error.path[0], error.message]))
        );
      }
      if (
        err.response?.data.message ===
        "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.email"
      ) {
        form.setFieldError("email", "Email must be unique.");
      }
      if (
        err.response?.data.message ===
        "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.phone"
      ) {
        form.setFieldError("phone", "Phone number must be unique.");
      }
    }
  };

  const specialisations = [
    "Podiatrist",
    "Dermatologist",
    "Pediatrician",
    "Psychiatrist",
    "General Practitioner",
  ];

  return (
    <div className="edit-form-container">
      <h1>Edit Doctor</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="First Name"
          name="first_name"
          {...form.getInputProps("first_name")}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          name="last_name"
          {...form.getInputProps("last_name")}
        />
        <Select
          withAsterisk
          label="Specialisation"
          name="specialisation"
          placeholder="Pick one"
          data={specialisations.map((specialisation) => ({
            value: specialisation,
            label: specialisation,
          }))}
          {...form.getInputProps("specialisation")}
        />
        <TextInput
          withAsterisk
          label="Email"
          name="email"
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="Phone"
          name="phone"
          {...form.getInputProps("phone")}
        />
        <Button mt={20} type="submit">
          Update
        </Button>
      </form>
    </div>
  );
};

export default Edit;
