<?php
	
	// Establish paths
	$flour_root_path = dirname(__dir__, 1);



	// Extract manifest
	$flour_manifest = json_decode(file_get_contents($flour_root_path . '/manifest.json'), true);



	// Response
	$response = 
	[
		'version' => $flour_manifest['version']
	];



	// Echo
	echo json_encode($response);

