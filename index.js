const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const { json } = require("body-parser");
const { response } = require("express");
const Register = require("./controllers/register");
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

app.post("/register", (req,res) => {Register.handleRegister(req,res,psql)} );


app.listen(3001, () => {
    console.log(" listening to port 3001 ");
});