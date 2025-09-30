<?php
/*  Login.php
Request format:
{
    "login": Username
    "password": Password
}

Response format:
{
    "userId": User's UUID for other requests.
    "firstName": User's first name.
    "lastName": User's last name.
    "error": blank if success, else describes the problem.  
}
*/

    // Get environment variables.
    $env = parse_ini_file("../.env");

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $user = $inData["login"];
    $pass = $inData["password"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user     mysql api pass   db name
	$conn = new mysqli("localhost", $env["API_USER"], $env["API_PASS"], $env["API_DB"]);
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Query the database this user's entry. 
    $stmt = $conn->prepare("SELECT UUID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
    $stmt->bind_param("ss", $user, $pass);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc())
    {
        respondWithInfo($row['UUID'], $row['FirstName'], $row['LastName']);
    }
    else
    {
        respondWithError("No Records Found");
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
		$retValue = '{"userId":"0","firstName":"","lastName":"","error":"' . $err . '"}';
		sendResponseInfoAsJson($retValue);
	}
    
    // Function: respondWithInfo
    // Sends response with desired data and a blank error code. 
	function respondWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"userId":"' . $id . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResponseInfoAsJson($retValue);
	}

?>