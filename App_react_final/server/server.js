const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use('/', express.static('public'));
app.use(cors('localhost:3000'))

const budget = {
    myBudget:[
    {
        title: 'Electronics',
        budget: 300
    },
    {
        title: 'Rent',
        budget: 350
    },
    {
        title: 'Market place',
        budget: 90
    },
    {
        title: 'Parking',
        budget: 30
    },
    {
        title: 'Cab',
        budget: 250
    },
    {
        title: 'Travel',
        budget: 450
    },
    {
        title: 'Other',
        budget: 359
    },
    
]
};
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/budget', (req, res) => {
    res.sendFile("server.json", {root: '.'});
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});