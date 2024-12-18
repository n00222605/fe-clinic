import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

import "../../styling/singlepatient.css";

const SinglePatient = () => {
  const { token } = useAuth();
  const [patient, setPatient] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://fed-medical-clinic-api.vercel.app/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setPatient(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id, token]);

  if (!patient) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-patient-container">
      <h1>{patient.first_name}</h1>
      <h2>{patient.last_name}</h2>
      <p>Phone: {patient.phone}</p>
      <p>Email: {patient.email}</p>
      <p>Address: {patient.address}</p>
      <p>Date of Birth: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
      <Link to={`/patients/${id}/edit`} className="edit-link">
        Edit Patient
      </Link>
    </div>
  );
};

export default SinglePatient;
