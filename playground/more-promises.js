const resolver = (msg, timeout) => new Promise((resolve) => {
    console.log(msg);
    setTimeout(resolve, timeout);
});
resolver('First', 500)
    .then(() => resolver('Second', 5000))
    .then(() => resolver('Third', 3000))
    .then(() => resolver('Fourth', 5000));