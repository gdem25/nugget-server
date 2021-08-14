const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const { json } = require("body-parser");
const { response } = require("express");
const Auth = require("./controllers/auth");
const RequiredClasses = require("./controllers/requiredClasses")
const Transcript = require("./controllers/transcript")
const EnrolledClasses = require("./controllers/enrolledClasses")
const psql = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "test",
        database: "nuggetportal",
    },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    psql
        .select("*")
        .from("students")
        .then((resp) => res.json(resp))
        .catch((err) => res.json(err));
});

app.post("/signin", (req,res) => {Auth.handleSignIn(req,res,psql)} );


app.put("/signin",(req,res) => Auth.updateStudentMajor(req,res,psql) );


app.post ("/required",(req,res) => RequiredClasses.insertClassesToDB(req,res,psql) );

app.get("/allclasses", (req,res) => RequiredClasses.getAllClasses(req,res,psql) );

app.get("/required",(req,res) => RequiredClasses.getRequiredClasses(req,res,psql) )

app.post("/transcript", (req,res) => Transcript.postToTranscript(req,res,psql)  )

app.get("/transcript", (req,res) =>  Transcript.getStudentTranscript(req,res,psql) )

app.post("/enrolled",(req,res) => EnrolledClasses.postToEnrolled(req,res,psql) )

app.get("/enrolled", (req,res) =>  EnrolledClasses.getEnrolledClasses(req,res,psql) )

app.delete("/enrolled", (req,res) => EnrolledClasses.deleteFromEnrolled(req,res,psql) )


app.listen(3001, () => {
    console.log(" listening to port 3001 ");
});