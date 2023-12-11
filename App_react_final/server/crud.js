const mongoDBClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/mongodb_demo';

//1 . Connect database
mongoDBClient.connect(url, {useUnifiedTopology: true}, (operationError, dbHandler)=>{
   if (operationError) {
    console.log("Error occurred while connecting database");
   }
   else {
        console.log("Connection established with database")
       /* //Insert operation
        let data = {id : 10, name: "added a new name from Mongo"};
        dbHandler.db('mongodb_demo').collection('names').insertOne(data, (operr, opresult)=>{
            if (operr){
                console.log ("Unable to insert data") 
            }
            else {
                console.log("Data inserted successfully")
                //dbHandler.close()
            }

        })
        //List operation
        dbHandler.db('mongodb_demo').collection('names').find().toArray(operr, opresult)=>{
          if(operr){
            console.log(operr)
          } else {
            for (var i=0; i < operr.length;i++)
                console.log(opresult[i])
          } 
          //dbhHandler.close()
        }
        
        //Fetch operation
        dbHandler.db('mongodb_demo').collection('names').findOne({id: 1}), (operr, opresult)=>{
          if(operr){
            console.log(operr)
          } else {
                console.log(opresult[i])
          } 
          //dbhHandler.close()
        }
        
        //Update Operation
        let newData = {$set: id: 10, name: "added a new name from Mongo"};
        dbHandler.db('mongodb_demo').collection('names').updateOne({data}), newData,(operr, opresult)=>{
            if (operr){
                console.log ("Unable to insert data") 
            }
            else {
                console.log("Data updated successfully")
                //dbHandler.close()
            }
            

        //Delete Operation
        dbHandler.db('mongodb_demo').collection('names').deleteOne({data}), (operr, opresult)=>{
            if (operr){
                console.log ("Unable to delete data") 
            }
            else {
                console.log("Data deleted successfully")
                //dbHandler.close()
            } /*
            
        //dbHandler.close()
   } 
});