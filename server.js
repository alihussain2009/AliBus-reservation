
const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ali@2006!Aze3Z",
    database: "bus_reservation"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL successfully!");
});

// GET: View all buses
app.get("/buses", (req, res) => {
    db.query("SELECT * FROM bus", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET: View a bus by ID
app.get("/buses/:id", (req, res) => {
    db.query(
        "SELECT * FROM bus WHERE bus_id = ?",
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(404).json({ message: "Bus not found" });
            }

            res.json(results[0]);
        }
    );
});

// POST: Insert a new bus
app.post("/buses", (req, res) => {
    const {
        bus_id,
        service_number,
        starting_place,
        destination,
        departure_date,
        departure_time,
        total_seats
    } = req.body;

    const sql = `
        INSERT INTO bus (
            bus_id, service_number, starting_place,
            destination, departure_date, departure_time, total_seats
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        bus_id,
        service_number,
        starting_place,
        destination,
        departure_date,
        departure_time,
        total_seats
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Bus inserted successfully!",
            bus_id: result.insertId || bus_id
        });
    });
});

// PUT: Update a bus
app.put("/buses/:id", (req, res) => {
    const {
        service_number,
        starting_place,
        destination,
        departure_date,
        departure_time,
        total_seats
    } = req.body;

    const sql = `
        UPDATE bus
        SET service_number = ?,
            starting_place = ?,
            destination = ?,
            departure_date = ?,
            departure_time = ?,
            total_seats = ?
        WHERE bus_id = ?
    `;

    const values = [
        service_number,
        starting_place,
        destination,
        departure_date,
        departure_time,
        total_seats,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bus not found or no changes made" });
        }

        res.json({ message: "Bus updated successfully!" });
    });
});

// DELETE: Delete a bus
app.delete("/buses/:id", (req, res) => {
    db.query(
        "DELETE FROM bus WHERE bus_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Bus not found" });
            }

            res.json({ message: "Bus deleted successfully!" });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
