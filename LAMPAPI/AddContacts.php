<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];
	
	// $color = $inData["color"];
	// $userId = $inData["userId"];

	// $conn = new mysqli("localhost", "TheBeast", "We_LoveCOP4331", "COP4331"); // TAKE ME OUT!!!
	$conn = new mysqli("localhost", "projectUser", "Userproject9876!", "COP4331"); UNCOMMENT ME!!!
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $phone, $email);
		
		// $stmt = $conn->prepare("INSERT into Colors (UserId,Name) VALUES(?,?)");
		// $stmt->bind_param("ss", $userId, $color);
		
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>