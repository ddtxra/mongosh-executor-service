//get heart rates
function execute(parameters) {


  var aggQuery = [
   {$match: {key: "pv.ta"}},
    {
      $project: {
        id: "$_id",
        patient_id: 1,
        systolic_value: "$values.systolic",
        diastolic_value: "$values.diastolic",
        datetime: 1
      }
    }
  ];


  var match = {};
  Object.keys(parameters).filter(p => p != "limit").forEach(function(param){

      //numeric values are formatted
      if(param.startsWith("systolic_value") || param.startsWith("diastolic_value")){
          parameters[param] = Number(parameters[param])
      }

      if(param.endsWith("_gte")){
          match[param.replace("_gte", "")] = {$gte: parameters[param]}
      }else if(param.endsWith("_lte")){
          match[param.replace("_lte", "")] = {$lte: parameters[param]}
      }else if(param.endsWith("_gt")){
          match[param.replace("_gt", "")] = {$gt: parameters[param]}
      }else if(param.endsWith("_lt")){
          match[param.replace("_lt", "")] = {$lt: parameters[param]}
      }else if(param.endsWith("_in")){
          match[param.replace("_in", "")] = {$in: (Array.isArray(parameters[param]) ? parameters[param] : parameters[param].split(","))}
      }else {
          match[param] = parameters[param]
      }

      //print(match)
  })

  if(Object.keys(match).length > 0){
       aggQuery.push({$match: match})
  }

  if(parameters.limit) {
      aggQuery.push({$limit: parseInt(parameters.limit)})
  }

    if(Object.keys(match).length > 0){
       aggQuery.push({$match: match})
  }

  if(parameters.limit) {
      aggQuery.push({$limit: parseInt(parameters.limit)})
  }

  return db.patient_values.aggregate(aggQuery);


}
