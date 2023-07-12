export interface Diagnose {
    code: string;
    name: string;
    latin?: string;
}

export interface SensitivePatient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
}

export type Patient = Omit<SensitivePatient, 'ssn'>
