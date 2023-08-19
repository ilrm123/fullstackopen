"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../data/patients"));
const uuid_1 = require("uuid");
const nonSensitivePatients = patients_1.default;
const sensitivePatients = patients_1.default;
const getPatients = () => {
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
const addPatient = (name, dateOfBirth, gender, occupation, ssn) => {
    const id = (0, uuid_1.v1)();
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
const getPatient = (iidee) => {
    return sensitivePatients.filter((o) => o.id == iidee)[0];
};
const getEntries = (patientId) => {
    const patientEntries = getPatient(patientId).entries;
    return patientEntries;
};
const addHospitalEntry = (patientId, date, type, specialist, description, discharge, diagnosisCodes) => {
    const id = (0, uuid_1.v1)();
    const newEntry = {
        id: id,
        date,
        type,
        specialist,
        diagnosisCodes,
        description,
        discharge
    };
    const patientEntries = getPatient(patientId).entries;
    patientEntries.push(newEntry);
    return newEntry;
};
const addOccupationalEntry = (patientId, date, type, specialist, employerName, description, sickLeave, diagnosisCodes) => {
    const id = (0, uuid_1.v1)();
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
    const patientEntries = getPatient(patientId).entries;
    patientEntries.push(newEntry);
    return newEntry;
};
const addHealthCheckEntry = (patientId, date, type, specialist, description, healthCheckRating, diagnosisCodes) => {
    const id = (0, uuid_1.v1)();
    const newEntry = {
        id: id,
        date,
        type,
        specialist,
        diagnosisCodes,
        description,
        healthCheckRating
    };
    const patientEntries = getPatient(patientId).entries;
    patientEntries.push(newEntry);
    return newEntry;
};
exports.default = {
    getPatients,
    addPatient,
    getPatient,
    addHospitalEntry,
    getEntries,
    addOccupationalEntry,
    addHealthCheckEntry
};
