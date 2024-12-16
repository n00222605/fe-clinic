import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

import "../../styling/singledoctor.css";

const SingleDoctor = () => {
    const { token } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setDoctor(res.data))
            .catch((err) => console.error(err));
    }, [id, token]);

    if (!doctor) {
        return (
            <div className="single-doctor-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="single-doctor-container">
            <h1>{doctor.first_name}</h1>
            <h2>{doctor.last_name}</h2>
            <p>Specialisation: {doctor.specialisation}</p>
            <h2>{doctor.email}</h2>
            <h2>{doctor.phone}</h2>
            <Link className="edit-link" to={`/doctors/${id}/edit`}>
                Edit Doctor
            </Link>
        </div>
    );
};

export default SingleDoctor;
