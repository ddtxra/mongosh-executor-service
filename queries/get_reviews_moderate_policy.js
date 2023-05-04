function execute (parameters) {
    var result = db.listingsAndReviews.find({cancellation_policy: "moderate"}, {_id: 1, name: 1}).limit(20).toArray();

    return {
        result: result
    }
}