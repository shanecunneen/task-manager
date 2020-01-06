function doSomethingAsync(call) {
    console.log(`About to do something async-y: ${call}`);
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 5000);
        //resolve();
    });
 
}

// This calls the doSomethingAysnc() method and will wait until that has completely resolved before moving onto the next "await"
// key to note that it will follow these steps:
// 1) Execute the promise, where the timeout is invoked
// 2) As the console.log('Here now') below is not within an await, it will execute that line
// 3) The timeout will then resolve, meaning that it can then be called for "num 2"
// 4) The subsequent calls are also within an await and so will only be executed once the preceding timeout has been resolved
async function doingStuff() {
    await doSomethingAsync("num 1");
    await doSomethingAsync("num 2");
    await doSomethingAsync("num 3");
    await doSomethingAsync("num 4");

}
 
doingStuff();
console.log('Here now');


// this method uses "then()" functionality where each block is only executed once the promise has resolved
// The result is the exact same as above but just different syntax 
doSomethingAsync("num 1")
.then(() => doSomethingAsync("num 2"))
.then(() => doSomethingAsync("num 3"))
.then(() => doSomethingAsync("num 4"))
.catch(() => console.log('Error'));

console.log('Here now');
