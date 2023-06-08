//gets 5 adults patients
function execute(match, limit) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var adultThreshold = new Date(currentYear - 18, currentDate.getMonth(), currentDate.getDate());

  var aggQuery = [
    {
      $project: {
        id: "$_id",
        _id: 1,
        last_name: 1,
        first_name: 1,
        age: { $subtract: [currentYear, { $year: "$birth_datetime" }] },
        email: 1,
        canton: 1,
        country: 1,
        origin: 1,
        general_consent: 1,
        birth_datetime: 1,
        sex: 1
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
          match[param.replace("_in", "")] = {$in: (Array.isArray(parameters[param]) ? parameters[param] : parameters[param].split(","))}
      }else {
          match[param] = parameters[param]
      }
  })

  //print(match)

  if(Object.keys(match).length > 0){
       aggQuery.push({$match: match})
  }

  if(parameters.limit) {
      aggQuery.push({$limit: parseInt(parameters.limit)})
  }

  return db.patients.aggregate(aggQuery);

}
