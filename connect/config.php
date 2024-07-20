<?php
// db.php
$servername = "localhost";
$username = "raisah";
$password = "raisah0812";
$dbname = "raisah_portfolio";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
