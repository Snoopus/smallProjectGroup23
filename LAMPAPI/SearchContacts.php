<?php
	$inData = getRequestInfo();
	
	$searchResults = array();
	$searchCount = 0;

	// $conn = new mysqli("localhost", "TheBeast", "We_LoveCOP4331", "COP4331"); // TAKE ME OUT!!!
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Search across all relevant fields
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND 
							 (FirstName LIKE ? OR LastName LIKE ? OR 
							  Phone LIKE ? OR Email LIKE ?)");
		
		$searchTerm = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $inData["userId"], $searchTerm, $searchTerm, $searchTerm, $searchTerm);
		$stmt->execute();
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$searchCount++;
			// Build an array of contact objects
			$contact = array(
				"FirstName" => $row["FirstName"],
				"LastName" => $row["LastName"],
				"Phone" => $row["Phone"],
				"Email" => $row["Email"],
				"ID" => $row["ID"]
			);
			$searchResults[] = $contact;
		}
		
		if($searchCount == 0)
		{
			returnWithError("No Records Found");
		}
		else
		{
			returnWithInfo($searchResults);
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>