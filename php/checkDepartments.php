
<?php

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);

if (mysqli_connect_errno()) {
	
	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;

}	
$query = $conn->prepare('SELECT count(p.id) as departmentCount, d.name as departmentName FROM personnel p LEFT JOIN department d ON ( d.id = p.departmentID) WHERE d.id = ?');

$query->bind_param("i", $_REQUEST['departmentID']);

$query->execute();

if (false === $query) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit;

}

$result = $query->get_result();

   $personnel = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($personnel, $row);

}


if (!$result) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit;

}

   $department = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($department, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $personnel;


mysqli_close($conn);

echo json_encode($output); 

?>