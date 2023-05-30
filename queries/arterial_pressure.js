//get heart rates
function execute(parameters) {

  return db.patient_values.find({key: "pv.ta"}).limit(100);

}
