db = db.getSiblingDB('demo');

db.createCollection('patients');

var genders = ['male', 'female'];
var minYear = 1910;
var maxYear = 2023;
var batchSize = 1000;
var totalRecords = 150000;

for (var batchStart = 0; batchStart < totalRecords; batchStart += batchSize) {
  var batchEnd = Math.min(batchStart + batchSize, totalRecords);

  var batchInsert = [];
  for (var i = batchStart; i < batchEnd; i++) {
    var randomGender = genders[Math.floor(Math.random() * genders.length)];
    var randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    var randomMonth = Math.floor(Math.random() * 12) + 1;
    var randomDay = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity

    batchInsert.push({
      _id: i,
      dateOfBirth: new Date(randomYear, randomMonth - 1, randomDay),
      sex: randomGender
    });
  }

  db.patients.insertMany(batchInsert);
}

db.patients.createIndex({ sex: 1 });
db.patients.createIndex({ dateOfBirth: 1 });