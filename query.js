var iterable = db.coinmarket.find().limit(2000);

iterable.forEach(i => printObjectInJSON(i))

function printObjectInJSON(object){
    print(JSON.stringify(object))
}