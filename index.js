const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT || 4004

let db = [{
    "id": 1,
    "label": "Call Mom",
    "dueDate": "tomorrow",
    "done": false,
    "priority": "high"
}, {
    "id": 2,
    "label": "Buy milk",
    "dueDate": "tomorrow",
    "done": false,
    "priority": "high"
}];

let nextId = 3;



/*
-get /
-get /items
-get /items/:id
-post /items        body{}
-put /items/:id     body{}
-delete /items/:id
 */

//test to make sure everything is working correctly
app.get('/', function(req, res){
    res.json('Best Todo App');
})

app.get('/items', function(req, res){
    console.log('GET /items');
    
    //excercise for hw
    //use .map() hof to convert every item in db array to simpler copy of only has the asterisked items

    let simplifiedDB = db.map(db => ({
        'id': db.id, 
        'label': db.label, 
        'done': db.done
    }));
    console.log(simplifiedDB);
    res.json(simplifiedDB);
    //res.json(db);
    //for testing use res.json(db) if havent finished converting
})

app.get('/items/:id', function(req, res){
    console.log('Get /items/', req.params)

    //need parseInt for it to work
    let id = parseInt(req.params.id);

    let found = db.find(item=> item.id === id)  

    res.json(found);
})

app.post('/items', function(req, res){
    console.log('POST /items/', req.body);

    let dataIn = req.body;
    let newId = nextId;
    nextId++; 

    //if they sent id, override it
    dataIn.id = newId;

    //checks if label is provided
    if(!dataIn.label){
        res.sendStatus(400);
        return;
    }
    if(dataIn.done != true){
        dataIn.done = false;
    }

    db.push(dataIn);
    res.send('new item posted');


})


//PUT /items/:id body{}
//if id is inlcuded in the body, replace it with the id that is passed in on the path param
//this should update an existing item from our db
//should look similar to post but not pushing anything
app.put('/items/:id', function(req, res){
    console.log('PUT /items/', req.body);

    let dataIn = req.body;
    let id = req.params.id;

    let found = db.find(db => db.id == id);

    //override id if they entered one in body
    dataIn.id = id;

    if(!dataIn.label){
        dataIn.label = found.label
    }

    //Mark item as not done if anything but true is sent in
    if(dataIn.done !=true){
        dataIn.done = false;
    }
    
    console.log(dataIn);

    // update the item in the database
    let updatedItem = db.findIndex(item => item.id == id);
    db.splice(updatedItem, 1, dataIn);

    res.send('updated');
})

//DELETE  /items/:id
//find the item with the id in the db and remove it
app.delete('/items/:id', function(req, res){
    console.log('DELETE /items/:id', req.params.id);

    let id = parseInt(req.params.id);
    // find the index of the item to be deleted from the list
    let itemIdx = db.findIndex(item => item.id == id);
    //remove the item from the list
    db.splice(itemIdx, 1);
    console.log(db);
    res.send('deleted');
})

//what do we want to track
//* will come back with summary, rest will only come back in detailed version
//*id(number) - every item should have id
//*label/name(string) - the label of the item, what you would write down on a sheet of paper
//*done(boolean) - if true, the task is done
//priority - high/medium/low
//dueDate (date) - the date this task is due









app.listen(port, function(){
    console.log('listening on port', port)
})