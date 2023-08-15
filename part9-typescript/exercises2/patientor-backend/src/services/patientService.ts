import data from '../data/patients';
import { v1 as uuid } from 'uuid';

import { Patient } from '../types';

const patients: Patient[] = data as Patient[];

const getPatients = (): Patient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    }));
};

const addPatient = (name: string, dateOfBirth: string, gender: string, occupation: string): Patient => {
  const id = uuid();

  const newPatient = {
    id: id,
    name,
    dateOfBirth,
    gender,
    occupation,
  };

  patients.push(newPatient);
  return newPatient;
};


export default {
    getPatients,
    addPatient
};
