import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Text } from "@mantine/core";

import '../styling/create.css';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        },
        validate: {
            first_name: (value) => value.length > 2 && value.length < 255 ? null : 'First name must be between 2 and 255 characters',
            last_name: (value) => value.length > 2 && value.length < 255 ? null : 'Last name must be between 2 and 255 characters',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length >= 8 ? null : 'Password must be at least 8 characters long'
        },
    });

    const handleSubmit = () => {
        axios.post('https://fed-medical-clinic-api.vercel.app/register', form.values)
            .then((res) => {
                console.log('Registration successful:', res);

                localStorage.setItem("user", JSON.stringify(res.data.user));

                login(form.values.email, form.values.password);

                navigate("/");
            })
            .catch((err) => {
                console.error("Registration error:", err.response?.data || err);
                if (err.response?.status === 422) {
                    let errors = err.response.data.error.issues;
                    form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])));
                } else {
                    form.setErrors({ email: 'Registration failed. Please try again.' });
                }
            });
    };

    return (
        <div className="create-form-container">
            <h1>Register</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="First Name"
                    name="first_name"
                    {...form.getInputProps('first_name')}
                />
                <TextInput
                    withAsterisk
                    label="Last Name"
                    name="last_name"
                    {...form.getInputProps('last_name')}
                />
                <TextInput
                    withAsterisk
                    label="Email"
                    name="email"
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    name="password"
                    {...form.getInputProps('password')}
                />
                {form.errors.email && (
                    <Text color="red" size="sm">
                        {form.errors.email}
                    </Text>
                )}
                <Button mt={10} type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default RegisterForm;
