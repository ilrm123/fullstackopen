"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diagnosisRoute_1 = __importDefault(require("./routes/diagnosisRoute"));
const patientRoute_1 = __importDefault(require("./routes/patientRoute"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
const PORT = 3001;
app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.use('/api/diagnoses', diagnosisRoute_1.default);
app.use('/api/patients', patientRoute_1.default);
app.use('/api/patients/:id', patientRoute_1.default);
app.use('/api/patients/:id/entries', patientRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
