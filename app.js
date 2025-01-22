// Creation of a Table in the DB Manually  ->
//librarry imports
// mongo connections

const {MongoClient }  = require("mongodb");
const readlineSync = require("readline-sync");

const url = "mongodb://localhost:27017/";
const dbName = "test-db";
const collectionName = "records";

async function connectToDb(){
    const client =new MongoClient(url);
    await client.connect();
    console.log("connected to the database.");
    return client;

}

//Function  to validate and take input - >
// Writing a program to
// Take input from the user
// Apply validations such as
function getValidInput(prompt, validFunction, errorMessage){
    while(true){
        const input = readlineSync.question(prompt);
        if(validFunction(input)){
            return input;
        }
        else{
            console.log(errorMessage);
        }
    }
}

// main login ->
// min or max allowed value
// maximum length
// Perform calculations such as addition
// Take a decision based on a certain value of a field/variable
// Save the data to DB
// Display all the records in a table

async function main(){
    const client =await connectToDb();
    const db =client.db(dbName);
    const collection = db.collection(collectionName);

    const studentName = getValidInput(
        "enter name: ",
        (input)=>input.length>0 && input.length<=30,
        "name must be between 1 and 30 char  !"
    );

    const collegeName = getValidInput(
        "enter college: ",
        (input)=>input.length>0 && input.length<=50,
        "name must be between 1 and 30 char  !"
    );

    const round1Marks =parseFloat(
        getValidInput(
            "enter round-1 marks: ",
            (input)=> !isNaN(input) && input>=0 && input <=10,
            "name must be between 0 and 10!"
        )
    );

    const round2Marks =parseFloat(
        getValidInput(
            "enter round-2 marks: ",
            (input)=> !isNaN(input) && input>=0 && input <=10,
            "name must be between 0 and 10!"
        )
    );

    const round3Marks =parseFloat(
        getValidInput(
            "enter round-3 marks: ",
            (input)=> !isNaN(input) && input>=0 && input <=10,
            "name must be between 0 and 10!"
        )
    );

    

    const technicalRoundMarks =parseFloat(
        getValidInput(
            "enter total marks: ",
            (input)=> !isNaN(input) && input>=0 && input <=20,
            "name must be between 0 and 20!"
        )
    );

    // LOGICS-

    const totalMarks = round1Marks+round2Marks +round3Marks +technicalRoundMarks;
    const result = totalMarks>=35 ? "selected" : "reject";

    // saving the data

    const records ={
        studentName,
        collectionName,
        round1Marks,
        round2Marks,
        round3Marks,
        technicalRoundMarks,
        totalMarks,
        result,
    };

    await collection.insertOne(records);
    console.log("inserted to record.");

    const allRecords = await collection
    .find()
    .sort({totalMarks: -1})
    .toArray();

    let rank = 1;
    for(let i=0;i<allRecords.length ; i++){
        if(i>0 && allRecords[i].totalMarks<allRecords[i-1].totalMarks)rank = i+1;
        allRecords[i].rank = rank;

        await collection.updateOne(
            {_id: allRecords[i]._id},
            {$set : {rank :allRecords[i].rank}}
        );

    }
    


    // for (const record of allRecords){
        
    // }

    console.log("debugging-111");;
    console.table(allRecords);

    await client.close();
    console.log("closed connectio to db.");
}

main().catch(console.error);