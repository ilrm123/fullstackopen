import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.post('/', (req, res) => {
    const { name, dateOfBirth, gender, occupation, ssn } = req.body;
    const addedPatient = patientService.addPatient(
      name,
      dateOfBirth,
      gender,
      occupation,
      ssn,
    );

    res.json(addedPatient);
});

router.get('/:id', (req, res) => {
  res.send(patientService.getPatient(req.params.id));
});

router.get('/:id/entries', (req, res) => {
  res.send(patientService.getEntries(req.params.id));
});

router.post('/:id/entries', (req, res) => {
  
  if (req.body.type == "Hospital") {
    const { date, type, specialist, diagnosisCodes, description, discharge } = req.body;
    const addedEntry = patientService.addHospitalEntry(
      req.params.id,
      date,
      type,
      specialist,
      description,
      discharge,
      diagnosisCodes
    )

    res.json(addedEntry)
  } else if (req.body.type == "OccupationalHealthcare") {
    const { date, type, specialist, employerName, diagnosisCodes, description, sickLeave } = req.body;
    const addedEntry = patientService.addOccupationalEntry(
      req.params.id,
      date,
      type,
      specialist,
      employerName,
      description,
      sickLeave,
      diagnosisCodes
    )

    res.json(addedEntry)
  } else if (req.body.type == "HealthCheck") {
    const { date, type, specialist, diagnosisCodes, description, healthCheckRating } = req.body;
    const addedEntry = patientService.addHealthCheckEntry(
      req.params.id,
      date,
      type,
      specialist,
      description,
      Number(healthCheckRating),
      diagnosisCodes
    )

    res.json(addedEntry)
  } else {res.json("Invalid request")}

});

export default router;
