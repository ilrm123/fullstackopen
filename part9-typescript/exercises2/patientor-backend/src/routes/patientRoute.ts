import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.post('/', (req, res) => {
    const { name, dateOfBirth, gender, occupation } = req.body;
    const addedPatient = patientService.addPatient(
      name,
      dateOfBirth,
      gender,
      occupation,
    );

    res.json(addedPatient);
  });

export default router;
