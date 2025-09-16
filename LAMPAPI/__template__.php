<?php
/*  REPLACEME.php
Request format:
{

}

Response format:
{

}
*/

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $var = $inData["lorem"];

    // Access the database with API credentials. 
    //                  localhost   mysql api user  mysql api pass      db name
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Query the database this user's row. 
    $stmt = $conn->prepare("SQL QUERY HERE");
    $stmt->bind_param("s", $var);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc())
    {
        respondWithInfo($row['ID'], $row['firstName'], $row['lastName']);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResponseInfoAsJson($retValue);
	}
    
    // Function: respondWithInfo
    // Sends response with desired data and a blank error code. 
	function respondWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResponseInfoAsJson($retValue);
	}

?>