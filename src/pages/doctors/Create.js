import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form'
import { TextInput, Select, Text, Button } from "@mantine/core";

import '../../styling/create.css';

const Create = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            specialisation: 'General Practitioner'
        },
        validate: {
            first_name: (value) => value.length > 2 && value.length < 255 ? null : 'First name must be between 2 and 255 characters',
            last_name: (value) => value.length > 2 && value.length < 255 ? null : 'Last name must be between 2 and 255 characters',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => value.length === 10 ? null : 'Phone number must be 10 digits'
        },
    })

    const handleSubmit = () => {
        axios.post(`https://fed-medical-clinic-api.vercel.app/doctors`, form.values, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                navigate(`../${res.data.id}`, { relative: 'path' })
            })
            .catch((err) => {
                console.error(err)

                if (err.response.status === 422) {

                    let errors = err.response.data.error.issues;

                    form.setErrors(Object.fromEntries(errors.map((error) => [error.path[0], error.message])))
                }

                if (err.response.data.message == 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.email') {
                    console.log('Saw a unique constraint error')
                    form.setFieldError('email', 'Email must be unique.');
                }

                if (err.response.data.message == 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: doctors.phone') {
                    form.setFieldError('phone', 'Phone number must be unique.');
                }
            })
    }

    const specialisations = [
        'Podiatrist',
        'Dermatologist',
        'Pediatrician',
        'Psychiatrist',
        'General Practitioner',
    ]

    return (
        <div className="create-form-container">
            <h1>Create a Doctor</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="First name"
                    name="first_name"
                    {...form.getInputProps('first_name')}
                />
                <TextInput
                    withAsterisk
                    label="Last name"
                    name="last_name"
                    {...form.getInputProps('last_name')}
                />
    
                <Select
                    withAsterisk
                    name="specialisation"
                    label="Specialisation"
                    placeholder="Pick one"
                    data={specialisations.map(specialisation => ({
                        value: specialisation,
                        label: specialisation
                    }))}
                    {...form.getInputProps('specialisation')}
                />
    
                <TextInput
                    withAsterisk
                    label="Email"
                    name="email"
                    {...form.getInputProps('email')}
                />
                <TextInput
                    withAsterisk
                    label="Phone"
                    name="phone"
                    {...form.getInputProps('phone')}
                />
    
                <Button mt={10} type="submit">Submit</Button>
            </form>
        </div>
    );
    
}

export default Create;