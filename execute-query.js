var res = execute(parameters)
var firstElem = true;

print("[")
res.forEach(function(r){
    if(!firstElem){
        print(",")
    }else {
        firstElem = false;
    }
    print(JSON.stringify(r, null, 2))
});
print("]")
