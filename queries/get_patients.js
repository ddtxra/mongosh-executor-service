//gets 5 adults patients
function execute(parameters) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var adultThreshold = new Date(currentYear - 18, currentDate.getMonth(), currentDate.getDate());

  var result = db.patients.aggregate([
    {
      $match: { dateOfBirth: { $lte: adultThreshold } }
    },
    {
      $project: {
        _id: 1,
        sex: 1,
        age: { $subtract: [currentYear, { $year: "$dateOfBirth" }] },
        dateOfBirth: 1
      }
    },
    {
      $limit: 100
    }
  ]);

  return result;


}
