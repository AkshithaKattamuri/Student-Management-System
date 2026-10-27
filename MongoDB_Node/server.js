const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);


// ==================================================
// GET - Retrieve all students
// ==================================================

app.get("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db("Akshitha");
        const collection = db.collection("students");

        const students =
            await collection.find({}).toArray();

        res.json(students);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error connecting to MongoDB"
        });
    }
});


// ==================================================
// POST - Add a new student
// ==================================================

app.post("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db("Akshitha");
        const collection = db.collection("students");

        const {
            name,
            age,
            course,
            marks,
            cgpa
        } = req.body;


        // ------------------------------------------
        // NAME VALIDATION
        // ------------------------------------------

        if (!name || name.trim() === "") {

            return res.status(400).json({
                message: "Name is required"
            });
        }

        const studentName = name.trim();


        if (
            studentName.length < 2 ||
            studentName.length > 50
        ) {

            return res.status(400).json({
                message:
                    "Name must be between 2 and 50 characters"
            });
        }


        // ------------------------------------------
        // AGE VALIDATION
        // ------------------------------------------

        if (
            !Number.isInteger(age) ||
            age < 1 ||
            age > 100
        ) {

            return res.status(400).json({
                message:
                    "Age must be an integer between 1 and 100"
            });
        }


        // ------------------------------------------
        // COURSE VALIDATION
        // ------------------------------------------

        if (
            !course ||
            course.trim() === ""
        ) {

            return res.status(400).json({
                message: "Course is required"
            });
        }


        // ------------------------------------------
        // MARKS VALIDATION
        // ------------------------------------------

        if (
            typeof marks !== "number" ||
            marks < 0 ||
            marks > 100
        ) {

            return res.status(400).json({
                message:
                    "Marks must be between 0 and 100"
            });
        }


        // ------------------------------------------
        // CGPA VALIDATION
        // ------------------------------------------

        if (
            typeof cgpa !== "number" ||
            cgpa < 0 ||
            cgpa > 10
        ) {

            return res.status(400).json({
                message:
                    "CGPA must be between 0 and 10"
            });
        }


        // ------------------------------------------
        // CHECK DUPLICATE NAME
        // ------------------------------------------

        const existingStudent =
            await collection.findOne({
                name: studentName
            });


        if (existingStudent) {

            return res.status(409).json({
                message: "Username already exists"
            });
        }


        // ------------------------------------------
        // INSERT STUDENT
        // ------------------------------------------

        const result =
            await collection.insertOne({

                name: studentName,

                age: age,

                course: course.trim(),

                marks: marks,

                cgpa: cgpa
            });


        res.status(201).json({

            message:
                "Student added successfully",

            insertedId:
                result.insertedId

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error adding student"

        });
    }
});


// ==================================================
// PUT - Update student
// ==================================================

app.put("/students/:name", async (req, res) => {

    try {

        await client.connect();

        const db = client.db("Akshitha");
        const collection = db.collection("students");

        const studentName =
            req.params.name;


        const {
            age,
            marks,
            course,
            cgpa
        } = req.body;


        // ------------------------------------------
        // CHECK STUDENT EXISTS
        // ------------------------------------------

        const existingStudent =
            await collection.findOne({
                name: studentName
            });


        if (!existingStudent) {

            return res.status(404).json({

                message:
                    "Student not found"

            });
        }


        // ------------------------------------------
        // AGE VALIDATION
        // ------------------------------------------

        if (
            age !== undefined &&
            (
                !Number.isInteger(age) ||
                age < 1 ||
                age > 100
            )
        ) {

            return res.status(400).json({

                message:
                    "Age must be an integer between 1 and 100"

            });
        }


        // ------------------------------------------
        // MARKS VALIDATION
        // ------------------------------------------

        if (
            marks !== undefined &&
            (
                typeof marks !== "number" ||
                marks < 0 ||
                marks > 100
            )
        ) {

            return res.status(400).json({

                message:
                    "Marks must be between 0 and 100"

            });
        }


        // ------------------------------------------
        // COURSE VALIDATION
        // ------------------------------------------

        if (
            course !== undefined &&
            (
                !course ||
                course.trim() === ""
            )
        ) {

            return res.status(400).json({

                message:
                    "Course cannot be empty"

            });
        }


        // ------------------------------------------
        // CGPA VALIDATION
        // ------------------------------------------

        if (
            cgpa !== undefined &&
            (
                typeof cgpa !== "number" ||
                cgpa < 0 ||
                cgpa > 10
            )
        ) {

            return res.status(400).json({

                message:
                    "CGPA must be between 0 and 10"

            });
        }


        // ------------------------------------------
        // CHECK AT LEAST ONE FIELD
        // ------------------------------------------

        if (
            age === undefined &&
            marks === undefined &&
            course === undefined &&
            cgpa === undefined
        ) {

            return res.status(400).json({

                message:
                    "Provide at least one field to update"

            });
        }


        // ------------------------------------------
        // CREATE UPDATE OBJECT
        // ------------------------------------------

        const updateFields = {};


        if (age !== undefined) {

            updateFields.age = age;

        }


        if (marks !== undefined) {

            updateFields.marks = marks;

        }


        if (course !== undefined) {

            updateFields.course =
                course.trim();

        }


        if (cgpa !== undefined) {

            updateFields.cgpa = cgpa;

        }


        // ------------------------------------------
        // UPDATE DATABASE
        // ------------------------------------------

        await collection.updateOne(

            {
                name: studentName
            },

            {
                $set: updateFields
            }

        );


        // ------------------------------------------
        // GET UPDATED STUDENT
        // ------------------------------------------

        const updatedStudent =
            await collection.findOne({
                name: studentName
            });


        // ------------------------------------------
        // SEND UPDATED STUDENT TO REACT
        // ------------------------------------------

        res.json({

            message:
                "Student updated successfully",

            student:
                updatedStudent

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error updating student"

        });
    }
});


// ==================================================
// DELETE - Delete a student
// ==================================================

app.delete("/students/:name", async (req, res) => {

    try {

        await client.connect();

        const db = client.db("Akshitha");
        const collection = db.collection("students");


        const result =
            await collection.deleteOne({

                name:
                    req.params.name

            });


        if (
            result.deletedCount === 0
        ) {

            return res.status(404).json({

                message:
                    "Student not found"

            });
        }


        res.json({

            message:
                "Student deleted successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error deleting student"

        });
    }
});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});