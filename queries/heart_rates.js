//get heart rates
function execute(match, limit) {

    return db.patient_values.aggregate([{
        $match: {
            key: "pv.temperature"
        }
    }, {
        $match: match
    }, {
        $limit: limit
    }]).limit(100);

}