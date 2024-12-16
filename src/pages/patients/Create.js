import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { TextInput, Text, Button } from "@mantine/core";

import "../../styling/create.css"; // Ensure this points to your CSS file

const Create = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
    },
    validate: {
      first_name: (value) =>
        value.length > 2 && value.length < 255 ? null : "First name must be between 2 and 255 characters",
      last_name: (value) =>
        value.length > 2 && value.length < 255 ? null : "Last name must be between 2 and 255 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) => (value.length === 10 ? null : "Phone number must be 10 digits"),
      date_of_birth: (value) =>
        value ? null : "Date of birth is required",
      address: (value) =>
        value.length > 2 && value.length < 255 ? null : "Address must be between 2 and 255 characters",
    },
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`https://fed-medical-clinic-api.vercel.app/patients`, form.values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      navigate(`/patients/${res.data.id}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        const errors = err.response.data.error.issues;
        form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
      }

      if (err.response?.data.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.email") {
        form.setFieldError("email", "Email must be unique.");
      }
      if (err.response?.data.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: patients.phone") {
        form.setFieldError("phone", "Phone number must be unique.");
      }
    }
  };

  return (
    <div className="create-form-container">
      <h1>Create Patient</h1>
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
        <TextInput
          withAsterisk
          label="Date of Birth (YYYY-MM-DD)"
          name="date_of_birth"
          {...form.getInputProps("date_of_birth")}
        />
        <TextInput
          withAsterisk
          label="Address"
          name="address"
          {...form.getInputProps("address")}
        />
        <Button mt={20} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Create;
