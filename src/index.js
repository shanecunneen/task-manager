const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Task Manager server is up on port ${port}` );
});