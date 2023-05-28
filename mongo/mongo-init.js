db = db.getSiblingDB('demo');

db.createCollection('patients');

var genders = ['male', 'female'];
var minYear = 1910;
var maxYear = 2023;

for (var i = 0; i < 15000; i++) {
  var randomGender = genders[Math.floor(Math.random() * genders.length)];
  var randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  var randomMonth = Math.floor(Math.random() * 12) + 1;
  var randomDay = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity

  db.patients.insert({
    _id: i,
    dateOfBirth: new Date(randomYear, randomMonth - 1, randomDay),
    sex: randomGender
  });
}