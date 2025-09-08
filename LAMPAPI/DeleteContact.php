<?php
/*  DeleteContact.php
Request format:
{
    "contactId": The contact to delete. 
}

Response format:
{
    "error": blank if success, else describes the problem.
}
*/

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $id = $inData["contactId"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user  mysql api pass      db name
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Delete this contact from db. 
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
    $stmt->bind_param("s", $id);
    $stmt->execute();

    if($conn->affected_rows > 0)
    {
        respondWithInfo();
    }
    else // Nothing was actually deleted.
    {
        respondWithError("No contact by that id.");
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