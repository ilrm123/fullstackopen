import diagnosisData from '../data/diagnoses';

import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnosisData as Diagnose[];

const getDiagnoses = () => {
    return diagnoses;
};


export default {
    getDiagnoses
};
