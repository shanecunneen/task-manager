const { celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../../playground/math');

// Added in the console.log statements to highlight the way the callbacks work
// i.e. all the test() methods are invoked first before any of the async callbacks 
// are invoked to actually execute the tests
console.log('About to load test 1');
test('Should convert 32 F to 0 C', () => {
    console.log('Doing test 1');
    const result = fahrenheitToCelsius(32);
    expect(result).toBe(0);    
});

console.log('About to load test 2');
test('Should convert 0 C to 32 F', () => {
    console.log('Doing test 2');
    const result = celsiusToFahrenheit(0);
    expect(result).toBe(32); 
});


// One way of testing async code - using 'done'
test('Test Async Function using done - should add 2 numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    });
});

// Another way of testing async code - using 'async/await'
test('Test Async Function - should add 2 numbers', async () => {
    const result = await add(2, 3);
    expect(result).toBe(5);
});