db = db.getSiblingDB('demo');

db.createCollection('patients');

var genders = ['male', 'female'];
var minYear = 1960;
var maxYear = 2020;
var batchSize = 1000;
var totalRecords = 150000;

function generateYesOrNo() {
    return (Math.random() <= 0.05) ? "yes" : "No";
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFloat(start, end) {
    const decimalPlaces = 1;
    const randomFloat = Math.random() * (end - start) + start;
    return parseFloat(randomFloat.toFixed(decimalPlaces));
}

function generateRandomPatientValues(patient_id, key, startDate, endDate, count) {
    const values = [];
    for (let i = 0; i < count; i++) {
        const randomDate = getRandomDate(startDate, endDate);
        values.push({
            _id: patient_id + "_" + i,
            patient_id: patient_id,
            values: {
                "systolic": getRandomFloat(100, 140),
                "diastolic": getRandomFloat(60, 100)
            },
            datetime: randomDate,
            key: key
        });
    }

    db.patient_values.insertMany(values);
    print(count + " " + key + " inserted")

}


for (var batchStart = 0; batchStart < totalRecords; batchStart += batchSize) {
    var batchEnd = Math.min(batchStart + batchSize, totalRecords);

    var batchInsert = [];
    for (var i = batchStart; i < batchEnd; i++) {
        var randomGender = genders[Math.floor(Math.random() * genders.length)];
        var randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        var randomMonth = Math.floor(Math.random() * 12) + 1;
        var randomDay = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity

        batchInsert.push({
            _id: batchStart + i,
            general_consent: generateYesOrNo(),
            dateOfBirth: new Date(randomYear, randomMonth - 1, randomDay),
            sex: randomGender
        });
    }
    print(batchStart + " patients inserted")
    generateRandomPatientValues(batchStart, "pv.ta", new Date("2020-01-01"), new Date("2021-01-01"), 1000);

    db.patients.insertMany(batchInsert);
}

print("Creating index on sex")
db.patients.createIndex({
    sex: 1
});

print("Creating index on dateOfBirth")
db.patients.createIndex({
    dateOfBirth: 1
});


print("Creating index on patient values")
db.patient_values.createIndex({
    key: 1
});

print("Done")