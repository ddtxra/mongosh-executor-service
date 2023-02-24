if(typeof count == 'undefined') {
    count = 0;
} else count++;

var iterable = db.coinmarket.find().limit(2000);

function printObjectInJSON(object){
    object.count = count;
    print(JSON.stringify(object))
}

iterable.forEach(i => printObjectInJSON(i))
