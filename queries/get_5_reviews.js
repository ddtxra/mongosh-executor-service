function execute (parameters) {
    var result = db.listingsAndReviews.find({}, {_id: 1, name: 1}).limit(5).toArray();
    return {
        result: result
    }
}