<?php

	include_once('vendor/minifier.php');
	

	// Check post
	if(!isset($_POST['version']))
	{
		die();
	}

	$version = $_POST['version'];
	$change_log_blocks = 
	[
		'added' => 'Added',
		'changed' => 'Changed',
		'deprecated' => 'Deprecated',
		'removed' => 'Removed',
		'fixed' => 'Fixed',
		'security' => 'Security'
	];


	// Establish paths - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$flour_root_path = dirname(__dir__, 1);
	$flour_src_path = $flour_root_path . '/src/';
	$flour_dist_path = $flour_root_path . '/dist/';
	$flour_versions_path = $flour_root_path . '/versions/';
	$flour_version_path = $flour_root_path . '/versions/' . $version;
	$flour_manifest_path = $flour_root_path . '/manifest.json';
	$flour_change_log_path = $flour_root_path . '/changelog.md';

	$flour_manifest = json_decode(file_get_contents($flour_manifest_path), true);

	$flour_output_file = $flour_dist_path . 'flour-' . $version . '.js';
	$flour_output_minified_file = $flour_dist_path . 'flour-' . $version . '.min.js';


	// Create dirs in case they don't exist - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	if(!is_dir($flour_dist_path))
	{
		mkdir($flour_dist_path);
	}

	if(!is_dir($flour_versions_path))
	{
		mkdir($flour_versions_path);
	}


	// Empty our dist - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$dist_contents = scandir($flour_dist_path);
	foreach($dist_contents as $item) 
	{
		if($item == '.' || $item == '..')
		{
			continue;
		}

		unlink($flour_dist_path . $item);
	}



	// Traverse our src files
	function concat_path_files($path, $dest)
	{
		if(!file_exists($dest))
		{
			touch($dest);
		}

		$contents = scandir($path);
		$path_dirs = [];

		foreach($contents as $item)
		{
			$item_path = $path . $item;

			if($item == '.' || $item == '..')
			{
				continue;
			}

			if(is_dir($item_path))
			{
				$path_dirs[] = $item_path;
				continue;
			}

			$item_contents = file_get_contents($item_path);
			file_put_contents($dest, $item_contents, FILE_APPEND);
		}

		
		foreach($path_dirs as $child_path)
		{
			concat_path_files($child_path . '/', $dest);
		}
	}



	// Kick off the concatanation of our src files - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	concat_path_files($flour_src_path, $flour_output_file);



	// Minify - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$minified = \JShrink\Minifier::minify(file_get_contents($flour_output_file));
	file_put_contents($flour_output_minified_file, $minified);



	// Write updated manifest - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$flour_manifest['version'] = $_POST['version'];
	$flour_manifest['build_date'] = date('Y-m-d H:i:s');
	file_put_contents($flour_manifest_path, json_encode($flour_manifest));



	// Create changelog entry - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	if(!is_file($flour_change_log_path))
	{
		touch($flour_change_log_path);
	}

	
	$change_log_entry = '## [' . $version . '] - ' . date('Y-m-d') . PHP_EOL;

	if(isset($_POST['general']) && strlen($_POST['general']) > 0)
	{
		$change_log_entry .= $_POST['general'] . PHP_EOL;
	}

	foreach($change_log_blocks as $block => $block_title)
	{
		if(isset($_POST[$block]) && strlen($_POST[$block]) > 0)
		{
			$change_log_entry .= PHP_EOL . '### ' . $block_title . PHP_EOL;
			$change_log_entry .= $_POST[$block] . PHP_EOL;
		}
	}

	$change_log_contents = file_get_contents($flour_change_log_path);
	$change_log_entry .= PHP_EOL . PHP_EOL . PHP_EOL;

	file_put_contents($flour_change_log_path, $change_log_entry . $change_log_contents);



	// Create version directory with change log entry - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	mkdir($flour_version_path);
	file_put_contents($flour_version_path . '/changelog.md', $change_log_entry);
	copy($flour_output_file, $flour_version_path . '/flour.js');



	// Response - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$response = 
	[
		'status' => 'success',
		'version' => $version
	];

	// IF JSON BODY - json_decode(file_get_contents('php://input'))

	echo json_encode($response);

