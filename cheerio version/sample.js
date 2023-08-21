//this page is about generators : P

function* genFunction(){
    yield "Hello World!";
}

let genObject = genFunction();

console.log(genObject.next());
console.log(genObject.next());

function* loggerator(){
    console.log("running");
    yield 'paused';
    console.log('running again');
    return 'stop';
}

let logger = loggerator();
console.log(logger.next());
console.log(logger.next());

//they are also iterable

function* abcs() {
    yield 'a';
    yield 'b';
    yield 'c';
    yield 'd';
}

for(let letter of abcs()){
    console.log(letter.toUpperCase());
}