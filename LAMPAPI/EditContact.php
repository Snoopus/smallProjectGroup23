<?php
/*  EditContact.php
Request format:
{
    "contactId": The contact to update.
    "firstName": Contact's new first name.
    "lastName" Contact's new last name.
    "phone": Contact's new phone number.
    "email": Contact's new email address.
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
    $id = $inData["contactId"];
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user     mysql api pass   db name
	$conn = new mysqli("localhost", $env["API_USER"], $env["API_PASS"], $env["API_DB"]);
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Update the current row in the table. 
    $stmt = $conn->prepare("UPDATE Contacts 
                            SET FirstName=?,
                                LastName=?,
                                Phone=?,
                                Email=? 
                            WHERE ID=?");
    $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $id);
    $stmt->execute();
    if($conn->affected_rows > 0)
    {
        respondWithInfo();
    }
    else // Nothing was changed.
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