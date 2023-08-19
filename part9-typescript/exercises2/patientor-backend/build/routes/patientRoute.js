"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.send(patientService_1.default.getPatients());
});
router.post('/', (req, res) => {
    const { name, dateOfBirth, gender, occupation, ssn } = req.body;
    const addedPatient = patientService_1.default.addPatient(name, dateOfBirth, gender, occupation, ssn);
    res.json(addedPatient);
});
router.get('/:id', (req, res) => {
    res.send(patientService_1.default.getPatient(req.params.id));
});
router.get('/:id/entries', (req, res) => {
    res.send(patientService_1.default.getEntries(req.params.id));
});
router.post('/:id/entries', (req, res) => {
    if (req.body.type == "Hospital") {
        const { date, type, specialist, diagnosisCodes, description, discharge } = req.body;
        const addedEntry = patientService_1.default.addHospitalEntry(req.params.id, date, type, specialist, description, discharge, diagnosisCodes);
        res.json(addedEntry);
    }
    else if (req.body.type == "OccupationalHealthcare") {
        const { date, type, specialist, employerName, diagnosisCodes, description, sickLeave } = req.body;
        const addedEntry = patientService_1.default.addOccupationalEntry(req.params.id, date, type, specialist, employerName, description, sickLeave, diagnosisCodes);
        res.json(addedEntry);
    }
    else if (req.body.type == "HealthCheck") {
        const { date, type, specialist, diagnosisCodes, description, healthCheckRating } = req.body;
        const addedEntry = patientService_1.default.addHealthCheckEntry(req.params.id, date, type, specialist, description, Number(healthCheckRating), diagnosisCodes);
        res.json(addedEntry);
    }
    else {
        res.json("Invalid request");
    }
});
exports.default = router;
