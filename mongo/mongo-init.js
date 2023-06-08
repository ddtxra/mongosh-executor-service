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


for (var batchStart = 0; batchStart < totalRecords; batchStart += batchSize) {
    var batchEnd = Math.min(batchStart + batchSize, totalRecords);

    var batchInsert = [];
    var values = [];
    for (var i = batchStart; i < batchEnd; i++) {
        var randomGender = genders[Math.floor(Math.random() * genders.length)];
        var randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
        var randomMonth = Math.floor(Math.random() * 12) + 1;
        var randomDay = Math.floor(Math.random() * 30) + 1; // Assuming all months have 30 days for simplicity

        var patient_id = "pat_" + (batchStart + i);

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

        values = values.concat(generateRandomPatientValues(patient_id, "pv.ta", new Date("2020-01-01"), new Date("2021-01-01"), 3));

    }

    db.patient_values.insertMany(values);
    db.patients.insertMany(batchInsert);

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