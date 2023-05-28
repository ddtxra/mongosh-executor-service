var res = execute({})
var firstElem = true;

print("[")
res.forEach(function(r){
    if(!firstElem){
        print(",")
    }else {
        firstElem = false;
    }
    print(JSON.stringify(r))
});
print("]")
