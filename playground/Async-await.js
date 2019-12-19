const doWork = async() => {
    return 'Shane';
}

doWork().then((result) => {
    console.log(`The result was ${result}`);
}).catch((e) => {
    console.log(e);
});
