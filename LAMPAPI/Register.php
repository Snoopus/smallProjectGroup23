<!-- Register.php
Request format:
{
	"firstName": 
	"lastName": 
	"login": new user's username, must be unique.
	"password": new user's password.
}

Response format:
{
	"userId": newly added user ID to make other requests with.
	"error": blank if success, else describes the problem.
}

-->
<?php

    // Read and parse request JSON. 
	$inData = getRequestInfo();
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user  mysql api pass      db name
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Deny if login already exists
	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
	$stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->fetch_assoc()) // If result is not null:
    {
        respondWithError("Username already exists.");
		$stmt->close();
    	$conn->close();
		return;
    }
	$stmt->close();

	// Insert the new user. 
	$stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
	if($stmt->execute()) // If query succeeded:
	{
		$id = $conn->insert_id;
		returnWithInfo($id);
	}
	else
	{
		respondWithError("User insertion failed.")
	}

    // Clean up.
    $stmt->close();
    $conn->close();
	

    // Function: getRequestInfo
    // Deserializes the request JSON into an associative array.
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // Function: sendResponseInfoAsJson
    // Sends the response JSON, given as a string by $obj. 
	function sendResponseInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
    // Function: respondWithError
    // Sends response with error code and no useful data.
	function respondWithError($err)
	{
		$retValue = '{"userId":0,"error":"' . $err . '"}';
		sendResponseInfoAsJson($retValue);
	}
    
    // Function: respondWithInfo
    // Sends response with desired data and a blank error code. 
	function respondWithInfo($id)
	{
		$retValue = '{"userId":' . $id . ',"error":""}';
		sendResponseInfoAsJson($retValue);
	}

?>