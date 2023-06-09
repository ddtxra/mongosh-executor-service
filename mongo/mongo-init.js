db = db.getSiblingDB('demo');

db.createCollection('patients');

var genders = ['male', 'female'];
var minYear = 1960;
var maxYear = 2020;
var batchSize = 1000;
var totalRecords = 150000;

print("Starting");

function generateYesOrNo() {
    return (Math.random() <= 0.05) ? "yes" : "no";
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFloat(start, end) {
    const decimalPlaces = 1;
    const randomFloat = Math.random() * (end - start) + start;
    return parseFloat(randomFloat.toFixed(decimalPlaces));
}

function generateRandomName(alphabet, minNameLength, maxNameLength) {

  const nameLength = Math.floor(Math.random() * (maxNameLength - minNameLength + 1)) + minNameLength;

  let randomFamilyName = "";
  for (let i = 0; i < nameLength; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    randomFamilyName += randomLetter;
  }

  return randomFamilyName;
}

function generateRandomEmail(name) {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  const email = name.toLowerCase() + "@" + domain;
  return email;
}

function generateRandomCanton() {
  const cantons = [
    "Zurich",
    "Bern",
    "Lucerne",
    "Uri",
    "Schwyz",
    "Obwalden",
    "Nidwalden",
    "Glarus",
    "Zug",
    "Fribourg",
    "Solothurn",
    "Basel-Stadt",
    "Basel-Landschaft",
    "Schaffhausen",
    "Appenzell Ausserrhoden",
    "Appenzell Innerrhoden",
    "St. Gallen",
    "Graubünden",
    "Aargau",
    "Thurgau",
    "Ticino",
    "Vaud",
    "Valais",
    "Neuchâtel",
    "Geneva",
    "Jura"
  ];

  const randomIndex = Math.floor(Math.random() * cantons.length);
  const randomCanton = cantons[randomIndex];

  return randomCanton;
}

function getRandomCountry() {
  const countries = [
    "Andorra",
    "Austria",
    "Belgium",
    "Denmark",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Iceland",
    "Ireland",
    "Italy",
    "Liechtenstein",
    "Luxembourg",
    "Malta",
    "Monaco",
    "Netherlands",
    "Norway",
    "Portugal",
    "Spain",
    "Sweden",
    "Switzerland",
    "United Kingdom (UK)"
  ];

  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

function generateRandomPatientValues(patient_id, key, startDate, endDate, count) {
    const values = [];
    for (let i = 0; i < count; i++) {
        const randomDate = getRandomDate(startDate, endDate);
        values.push({
            _id: patient_id + "_" + i,
            patient_id: patient_id,
            values: {
                "systolic": getRandomFloat(100, 160),
                "diastolic": getRandomFloat(40, 100)
            },
            datetime: randomDate,
            key: key
        });
    }
    return values;
}

var edsCounter = 1;
var patientIdCounter = 1;
const medicalServices = ["Intensive Care", "Emergency", "Cardiology", "Radiology", "Neurology"];

function generateMedicalServiceAssignments(numPassages) {
    const assignments = [];
    const numUnits = Math.min(numPassages, medicalServices.length);

    // Shuffle the medical services array
    const shuffledServices = medicalServices.slice();
    for (let i = shuffledServices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledServices[i], shuffledServices[j]] = [shuffledServices[j], shuffledServices[i]];
    }

    // Assign medical services to units
    for (let i = 0; i < numUnits; i++) {
        const unitMnemo = `UNIT-${String.fromCharCode(65 + i)}`;
        const medicalService = shuffledServices[i];
        assignments.push({ unitMnemo, medicalService });
    }

    // Assign remaining units randomly to medical services
    for (let i = numUnits; i < numPassages; i++) {
        const unitMnemo = `UNIT-${String.fromCharCode(65 + i)}`;
        const medicalService = medicalServices[Math.floor(Math.random() * medicalServices.length)];
        assignments.push({ unitMnemo, medicalService });
    }

    return assignments;
}

function generatePassages(eds, beginDate, endDate, numPassages, assignments) {
    const passages = [];
    let currentDate = new Date(beginDate);

    for (let i = 0; i < numPassages; i++) {
        const passage = {
            _id: `${eds._id}_passage${i + 1}`,
            begin_date: new Date(currentDate),
            end_date: null,
            care_unit: {
                mnemo: assignments[i].unitMnemo
            },
            sermed: {
                label: assignments[i].medicalService
            }
        };

        // Generate a random duration for the passage in minutes (between 1 and 1440 minutes)
        const durationInMinutes = Math.floor(Math.random() * 1440) + 1;

        // Update the end date based on the duration
        const endDateInMillis = currentDate.getTime() + durationInMinutes * 60000;
        passage.end_date = new Date(endDateInMillis);

        passages.push(passage);

        // Update the current date for the next passage
        const daysToAdd = Math.floor(Math.random() * 19) + 2;
        currentDate.setDate(currentDate.getDate() + daysToAdd);
    }

    // Set the endDate of the last passage to match the endDate of the EDS
    passages[numPassages - 1].end_date = endDate;

    return passages;
}

function generateEDS(beginDate, patient_id) {
    const eds = {
        _id: "eds_" + edsCounter++,
        begin_date: beginDate,
        end_date: null,
        patient_id: patient_id,
        type_code: Math.random() < 0.5 ? "HOSP." : "AMBU.",
        passages: []
    };

    // Calculate the random number of days to add between 2 and 90 days
    const daysToAdd = Math.floor(Math.random() * 89) + 2;

    // Create a new Date object based on the beginDate and add the calculated days
    const endDate = new Date(beginDate);
    const durationInMinutes = Math.floor(Math.random() * 1440) + 1;
    endDate.setDate(endDate.getDate() + daysToAdd);

    const numPassages = Math.floor(Math.random() * 5) + 1;
    const assignments = generateMedicalServiceAssignments(numPassages);

    // Generate passages
    const passages = generatePassages(eds, beginDate, endDate, numPassages, assignments);

    // Update the endDate of the EDS to match the endDate of the last passage
    eds.end_date = passages[numPassages - 1].end_date;

    eds.passages = passages;

    return eds;
}

for (var batchStart = 0; batchStart < totalRecords; batchStart += batchSize) {
    var batchEnd = Math.min(batchStart + batchSize, totalRecords);

    var batchInsert = [];
    var values = [];
    var edss = [];

    for (var i = batchStart; i < batchEnd; i++) {
        var randomGender = genders[Math.floor(Math.random() * genders.length)];
        var randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        var randomMonth = Math.floor(Math.random() * 12) + 1;
        var randomDay = Math.floor(Math.random() * 30) + 1; // Assuming all months have 30 days for simplicity

        var patient_id = "pat_" + patientIdCounter++;

        var last_name = generateRandomName("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3, 5);
        var first_name = generateRandomName("abcdefghijklmnopqrstuvwxyz", 4, 8);

        var country = getRandomCountry();

        batchInsert.push({
            _id: patient_id,
            last_name: last_name,
            first_name: first_name.charAt(0).toUpperCase() + first_name.slice(1),
            email: generateRandomEmail(first_name.substring(0, 3) + "." + last_name.substring(0, 3)),
            canton: (country == "Switzerland") ? generateRandomCanton() : null,
            country: country,
            origin: getRandomCountry(),
            general_consent: generateYesOrNo(),
            birth_datetime: new Date(randomYear, randomMonth - 1, randomDay),
            sex: randomGender
        });

        var patientValuesGenerated = generateRandomPatientValues(patient_id, "pv.ta", new Date("2020-01-01"), new Date("2021-01-01"), 3);
        patientValuesGenerated.forEach(function(pv){
            var eds = generateEDS(pv.datetime, pv.patient_id);
            edss.push(eds);
            pv.eds_id = eds._id;
        })

        values = values.concat(patientValuesGenerated);

    }

    db.patient_values.insertMany(values);
    db.patients.insertMany(batchInsert);
    db.eds.insertMany(edss);

    print(batchStart + " patients created");

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