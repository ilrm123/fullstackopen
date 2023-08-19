import { useParams } from "react-router-dom"
import { useState, SyntheticEvent } from "react";

import axios from "axios";

import { Patient, Entry, Diagnosis } from "../../types";

import patientService from "../../services/patients";

interface ValidationError {
    message: string;
    errors: Record<string, string[]>
  }

interface Props {
    patients : Patient[];
    diagnoses : Diagnosis[];
}

const PatientPage = ({ patients, diagnoses } : Props) => {
    const [entries, setEntries] = useState<Entry[]>([]);

    const id = useParams().id
    const patient = patients.find(n => n.id === id)

    const entryList = patient?.entries.map(e => 
        <li key={e.id}>
            <p>{e.date}: {e.description}</p>
            <p>Diagnosis codes: </p>
            <ul>{e.diagnosisCodes?.map(d => <li key={d}>{d}: {diagnoses.find((n) => n.code == d)?.name}</li>)}</ul>
        </li>
    )

    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [specialist, setSpecialist] = useState('')
    const [diagnosisCodes, setDiagnosisCodes] = useState('')
    const [healthCheckRating, setHealthCheckRating] = useState('')

    const diagnosisCodesSplit = diagnosisCodes.split(',')

    console.log(diagnoses)


    var healthCheckNumber = Number(healthCheckRating)

    if (healthCheckNumber < 0 || healthCheckNumber > 3) {
        healthCheckNumber = 0
    }

    const [message, setMessage] = useState('')

    const addHealthCheckEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const newEntry = {
            type: "HealthCheck",
            date,
            description,
            specialist,
            diagnosisCodes: diagnosisCodesSplit,
            healthCheckRating: healthCheckNumber
        }

        patientService
            .addHealthCheckEntry(id!, newEntry)
            .then(response => {
                setEntries(entries.concat(response))
                setDate('')
                setDescription('')
                setSpecialist('')
                setDiagnosisCodes('')
                setHealthCheckRating('')
            }).catch(error => {
                if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                    if (error.response !== undefined) {
                      setMessage(error.response.data.toString().substring(22));
                    } else {setMessage("An unknown error occurred")}
                  } else {
                    setMessage(error.toString());
                  }
            })
    }

    return (
        <div>
            <b><h1>{patient?.name}</h1></b>
            <br></br>
            <p>DOB: {patient?.dateOfBirth}</p>
            <p>Gender: {patient?.gender}</p>
            <p>Occupation: {patient?.occupation}</p>
            <br></br>
            <h2>Entries</h2>
            
            <ul>
                {entryList}
            </ul>
            <br></br>

            <h3>Add a new Health Check entry:</h3>

            <b><p style={{color: 'red'}}>{message}</p></b>

            <form onSubmit={addHealthCheckEntry}>
                Date:<input value={date} onChange={(e) => setDate(e.target.value)}/>
                <br></br>
                Description:<input value={description} onChange={(e) => setDescription(e.target.value)}/>
                <br></br>
                Specialist:<input value={specialist} onChange={(e) => setSpecialist(e.target.value)}/>
                <br></br>
                Health check rating:<input value={healthCheckRating} onChange={(e) => setHealthCheckRating(e.target.value)}/>
                <br></br>
                Diagnosis codes separated by commas:<input value={diagnosisCodes} onChange={(e) => setDiagnosisCodes(e.target.value)}/>
                <br></br>
                <button type='submit'>Add</button>
            </form>
            
        </div>
    )
}

export default PatientPage;
