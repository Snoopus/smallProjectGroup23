<!-- AddContact.php
Request format:
{
    "firstName": 
    "lastName": 
    "phone": 
    "email": 
    "userId": User this contact will belong to.
}

Response format:
{
    "error": blank if success, else describes the problem.
}

-->
<?php

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
    $userId = $inData["userId"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user  mysql api pass      db name
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Insert the new contact.
    $stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserId) VALUES(?,?,?,?,?)");
	$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId);
    if($stmt->execute()) // If query succeeded:
    {
        respondWithInfo();
    }
    else
    {
        respondWithError("Contact insertion failed.");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResponseInfoAsJson($retValue);
	}
    
    // Function: respondWithInfo
    // Sends response with desired data and a blank error code. 
	function respondWithInfo()
	{
		$retValue = '{"error":""}';
		sendResponseInfoAsJson($retValue);
	}

?>