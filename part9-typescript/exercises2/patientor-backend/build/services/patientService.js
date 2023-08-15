"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../data/patients"));
const uuid_1 = require("uuid");
const patients = patients_1.default;
const getPatients = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};
const addPatient = (name, dateOfBirth, gender, occupation) => {
    const id = (0, uuid_1.v1)();
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
exports.default = {
    getPatients,
    addPatient
};
