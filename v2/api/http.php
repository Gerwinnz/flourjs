<?php

	$params = $_REQUEST;
	$response = [
		'status' => 'success',
		'pay_load' => $params,
		'extra' => 
		[
			'one' => 
			[
				'foo' => 'hello server!'
			],
			'two' => 
			[
				'foo' => 'bar'
			]
		]
	];

	echo json_encode($response);

	