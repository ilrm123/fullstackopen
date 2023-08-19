import data from '../data/patients';
import { v1 as uuid } from 'uuid';

import { NonSensitivePatient, SensitivePatient, Gender, Entry, Discharge, SickLeave, HealthCheckRating } from '../types';

const nonSensitivePatients: NonSensitivePatient[] = data as NonSensitivePatient[];
const sensitivePatients: SensitivePatient[] = data as SensitivePatient[];

const getPatients = (): SensitivePatient[] => {
    return sensitivePatients.map(({ id, name, dateOfBirth, gender, occupation, ssn, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      ssn,
      entries,
    }));
};

const addPatient = (name: string, dateOfBirth: string, gender: Gender, occupation: string, ssn: string): SensitivePatient => {
  const id = uuid();

  const newPatient = {
    id: id,
    name,
    dateOfBirth,
    gender,
    occupation,
    ssn,
    entries: []
  };

  nonSensitivePatients.push(newPatient);
  return newPatient;
};

const getPatient = (iidee: string): SensitivePatient => {
  return sensitivePatients.filter((o) => o.id == iidee)[0];
};

const getEntries = (patientId: string): Entry[] => {
  const patientEntries = getPatient(patientId).entries

  return patientEntries
};

const addHospitalEntry = (patientId: string, date: string, type: "Hospital", specialist: string, description: string, discharge: Discharge, diagnosisCodes?: string[]): Entry => {
  const id = uuid();

  const newEntry = {
    id: id,
    date,
    type,
    specialist,
    diagnosisCodes,
    description,
    discharge
  };

  const patientEntries = getPatient(patientId).entries
  patientEntries.push(newEntry)
  
  return newEntry;
};

const addOccupationalEntry = (patientId: string, date: string, type: "OccupationalHealthcare", specialist: string, employerName: string, description: string, sickLeave: SickLeave, diagnosisCodes?: string[]): Entry => {
  const id = uuid();

  const newEntry = {
    id: id,
    date,
    type,
    specialist,
    employerName,
    diagnosisCodes,
    description,
    sickLeave
  };

  const patientEntries = getPatient(patientId).entries
  patientEntries.push(newEntry)
  
  return newEntry;
};

const addHealthCheckEntry = (patientId: string, date: string, type: "HealthCheck", specialist: string, description: string, healthCheckRating: HealthCheckRating, diagnosisCodes?: string[]): Entry => {
  const id = uuid();

  const newEntry = {
    id: id,
    date,
    type,
    specialist,
    diagnosisCodes,
    description,
    healthCheckRating
  };

  const patientEntries = getPatient(patientId).entries
  patientEntries.push(newEntry)
  
  return newEntry;
};

export default {
    getPatients,
    addPatient,
    getPatient,
    addHospitalEntry,
    getEntries,
    addOccupationalEntry,
    addHealthCheckEntry
};
