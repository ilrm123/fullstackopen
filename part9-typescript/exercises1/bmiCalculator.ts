export const calculateBmi = (height: number, weight: number) => {
    const bmi = (weight / (height**2))*10000;

    if (bmi < 25 && bmi >= 18.5) {
        return "Normal (healthy weight)";
    } else if (bmi >= 25) {
        return "Overweight";
    } else if (bmi < 18.5) {
        return "Underweight";
    } else {
        return "Invalid values for height and weight!";
    }
};

if (process.argv.length > 2) {

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const h: number = Number(process.argv[2]);

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const w: number = Number(process.argv[3]);

    console.log(calculateBmi(h, w));

}