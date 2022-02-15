<?php

	$params = $_REQUEST;
	$response = [
		'status' => 'success',
		'pay_load' => $params
	];

	echo json_encode($response);