<?php

	$params = $_REQUEST;
	$response = [
		'status' => 'success',
		'pay_load' => $params,
		'extra' => 
		[
			'one' => 
			[
				'foo' => 'bar'
			],
			'two' => 
			[
				'foo' => 'bar'
			]
		]
	];

	echo json_encode($response);

	