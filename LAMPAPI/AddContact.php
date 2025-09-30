<?php
/*  AddContact.php
Request format:
{
    "firstName": Contact's first name.
    "lastName": Contact's last name.
    "phone": Contact's phone number.
    "email": Contact's email address.
    "userId": UserUUID this contact will belong to.
}

Response format:
{
    "error": blank if success, else describes the problem.
}
*/

	require "./GenerateUUID.php";

    // Get environment variables.
    $env = parse_ini_file("../.env");

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
    $userId = $inData["userId"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user     mysql api pass   db name
	$conn = new mysqli("localhost", $env["API_USER"], $env["API_PASS"], $env["API_DB"]);
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Ensure associated User exists.
    $stmt = $conn->prepare("SELECT * FROM Users WHERE UUID=?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if(!($result->fetch_assoc())) // If result is null:
    {
        respondWithError("No user by that id.");
		$stmt->close();
    	$conn->close();
		return;
    }
    $stmt->close();

    // Generate unique, not sequential, id. 
    $uuid = uuidv4();

    // Insert the new contact.
    $stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserUUID,UUID) VALUES(?,?,?,?,?,?)");
	$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userId, $uuid);
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