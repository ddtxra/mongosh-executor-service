var all_variables_at_start_script = Object.getOwnPropertyNames(globalThis);
//print("Variables count in beginning " + Object.getOwnPropertyNames(globalThis).length)

function hello(){

if(typeof mfcount == 'undefined') {
    var mfcount = 0;
} else mfcount++;

var iterable = db.coinmarket.find().limit(2000);

function printObjectInJSON(object){
    object.mfcount = mfcount;
    print(JSON.stringify(object))
}

iterable.forEach(i => printObjectInJSON(i))

}

hello()

//print("Variables count now " + Object.getOwnPropertyNames(globalThis).length)

for(const name of Object.getOwnPropertyNames(globalThis)) {
    if(all_variables_at_start_script.indexOf(name) == -1) {
        print("clearing variable: " + name);
        delete globalThis[name]
    }
}

//print("Variables count at the end " + Object.getOwnPropertyNames(globalThis).length)
//print(globalThis["count"])