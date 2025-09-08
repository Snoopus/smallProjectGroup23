<!-- SearchContact.php
Request format:
{
    "search": search term used in all fields. 
    "userId": User whose contacts to search through. 
}

Response format:
{
    "results": array of matching contacts.
    "error": blank if success, else describes the problem.
}

-->
<?php

    // Read and parse request JSON. 
	$inData = getRequestInfo();
    $search = $inData["search"]
    $id = $inData["userId"]

    $searchString = "%" . $search . "%"; //SQL uses % as wildcards.

    // Access the database with API credentials. 
    //                  localhost   mysql api user  mysql api pass      db name
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if($conn->connect_error)
	{
		respondWithError($conn->connect_error);
	}	

    // Query the database for anything even close to searchString. 
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? 
                            AND (FirstName LIKE ? 
                            OR LastName LIKE ? 
                            OR Phone LIKE ? 
                            OR Email LIKE ?)");
    $stmt->bind_param("sssss", $id, $searchString, $searchString, $searchString, $searchString);
    $stmt->execute();
    $result = $stmt->get_result();

    // Iterate over each match. 
    $count = 0
    $resultArr = array()
    while($row = $result->fetch_assoc() )
    {
        $count++;
        // Create an array of "arrays" (maps in any other language).
        $resultArr[] = array(
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"],
            "phone" => $row["Phone"],
            "email" => $row["Email"],
            "contactId" => $row["ID"]
        );
    }
    
    // Return all matches as a JSON array. 
    if($count == 0)
    {
        respondWithError("No Records Found");
    }
    else
    {
        respondWithInfo($resultArr)
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResponseInfoAsJson($retValue);
	}
    
    // Function: respondWithInfo
    // Sends response with desired data and a blank error code. 
	function respondWithInfo($results)
	{
		$retValue = '{"results":' . json_encode($results) . ',"error":""}';
		sendResponseInfoAsJson($retValue);
	}

?>