<?php
/*  DeleteUser.php
Request format:
{
    "userId": User UUID to delete, permanently.
    "password": User's password to confirm they want this. 
}

Response format:
{
    "error": blank if success, else describes the problem.  
}
*/

    // Get environment variables.
    $env = parse_ini_file("../.env");

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $id = $inData["userId"];
    $pass = $inData["password"];


    // Access the database with API credentials. 
    //                  localhost   mysql api user     mysql api pass   db name
	$conn = new mysqli("localhost", $env["API_USER"], $env["API_PASS"], $env["API_DB"]);
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Verify this user is actually the one by checking password. 
    $stmt = $conn->prepare("SELECT * FROM Users WHERE UUID=? AND Password=?");
    $stmt->bind_param("ss", $id, $pass);
    $stmt->execute();
    $result = $stmt->get_result();
    if(!($result->fetch_assoc())) // If result is null:
    {
        respondWithError("Incorrect user/password.");
        $stmt->close();
        $conn->close();
        return;
    }
    $stmt->close();

    // Delete the user.
    $stmt = $conn->prepare("DELETE FROM Users WHERE UUID=? AND Password=?");
    $stmt->bind_param("ss", $id, $pass);
    $stmt->execute();
    if($conn->affected_rows == 0) // Nothing was actually deleted.
    {
        respondWithError("User deletion failed.");
        $stmt->close();
        $conn->close();
        return;
    }
    $stmt->close();

    // Delete all the contacts belonging to that user.
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserUUID=?");
    $stmt->bind_param("s", $id);
    if($stmt->execute()) // If query succeeded:
    {
        respondWithInfo();
    }
    else
    {
        respondWithError("Deleted user's contacts could not be deleted.");
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