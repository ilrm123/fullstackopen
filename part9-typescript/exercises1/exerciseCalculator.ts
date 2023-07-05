interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}


export const calculateExercises = (daily: number[], target: number): Result => {

    const errorThrower = (item : number) => {
        if (isNaN(Number(item))) {
            throw new Error('Some given values are not numbers!');
        }
    };

    daily.map(x => errorThrower(x));

    if (isNaN(target)) {
        throw new Error('Some given values are not numbers!');
    }

    const periodLength = daily.length;
    const trainingDays = daily.filter(x => x != 0).length;
    const totalHours = daily.reduce((a, b) => a+b, 0);
    const average = totalHours/daily.length;
    
    let success = false;

    if (average >= target) {
        success = true;
    }

    let rating = 2;

    if (average >= 4) {
        rating = 3;
    } else if (average <= 2) {
        rating = 1;
    }

    let ratingDescription = "A decent performance";
    
    if (rating == 3) {
        ratingDescription = "Great job!";
    } else if (rating == 1) {
        ratingDescription = "There is much room for improvement";
    }

    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average
    };

};

if (process.argv.length > 2) {
    const dString: string[] = process.argv.slice(3);

    const dNum: number[] = dString.map(x => Number(x));

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const t: number = Number(process.argv[2]);

    console.log(calculateExercises(dNum, t));
}



