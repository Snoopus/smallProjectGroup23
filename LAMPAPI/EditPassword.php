<?php
/*  EditPassword.php
Request format:
{
    "userId": User whose password to change.
    "oldPassword": Old (current) password.
    "newPassword": New password to change to. 
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
    $oldPass = $inData["oldPassword"];
    $newPass = $inData["newPassword"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user     mysql api pass   db name
	$conn = new mysqli("localhost", $env["API_USER"], $env["API_PASS"], $env["API_DB"]);
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Verify this user is actually the one by checking password. 
    $stmt = $conn->prepare("SELECT * FROM Users WHERE ID=? AND Password=?");
    $stmt->bind_param("ss", $id, $oldPass);
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

    // Update the username. 
    $stmt = $conn->prepare("UPDATE Users SET Password=? WHERE ID=?");
    $stmt->bind_param("ss", $newPass, $id);
    $stmt->execute();
    if($conn->affected_rows > 0)
    {
        respondWithInfo();
    }
    else // Nothing was changed.
    {
        respondWithError("Password update failed.");
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