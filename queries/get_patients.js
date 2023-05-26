function execute (parameters) {
    var result = db.patients.find({}, {_id: 1, sex: 1}).limit(5).toArray();
    return {
        result: result
    }
}