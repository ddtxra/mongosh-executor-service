//gets 5 adults patients
function execute(match, limit) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var adultThreshold = new Date(currentYear - 18, currentDate.getMonth(), currentDate.getDate());

  var aggQuery = [
    {
      $project: {
        id: "$_id",
        sex: 1,
        age: { $subtract: [currentYear, { $year: "$dateOfBirth" }] },
        dateOfBirth: 1,
        general_consent: 1
      }
    }
  ];

  var match = {};
  Object.keys(parameters).filter(p => p != "limit").forEach(function(param){
      if(param == "age"){
          match[param] = Number(parameters[param])
      }else if(param == "age_gte"){
          match[param.replace("_gte", "")] = {$gte: Number(parameters[param])}
      }else if(param == "age_lte"){
          match[param.replace("_lte", "")] = {$lte: Number(parameters[param])}
      }else if(param == "age_gt"){
          match[param.replace("_gt", "")] = {$gt: Number(parameters[param])}
      }else if(param == "age_lt"){
          match[param.replace("_lt", "")] = {$lt: Number(parameters[param])}
      }else if(param == "id_in"){
          match[param.replace("_in", "")] = {$in: parameters[param].split(",")}
      }else {
          match[param] = parameters[param]
      }
  })

  if(Object.keys(match).length > 0){
       aggQuery.push({$match: match})
  }

  if(parameters.limit) {
      aggQuery.push({$limit: parseInt(parameters.limit)})
  }

  return db.patients.aggregate(aggQuery);

}
