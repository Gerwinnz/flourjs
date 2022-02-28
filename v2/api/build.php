<?php

	include_once('vendor/minifier.php');
	


	// Establish paths
	$flour_root_path = dirname(__dir__, 1);
	$flour_src_path = $flour_root_path . '/src/';
	$flour_dist_path = $flour_root_path . '/dist/';

	$flour_manifest = json_decode(file_get_contents($flour_root_path . '/manifest.json'), true);

	$flour_output_file = $flour_dist_path . 'flour.js';
	$flour_output_minified_file = $flour_dist_path . 'flour.min.js';



	// Empty our dist
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



	// Kick off the concatanation of our src files
	concat_path_files($flour_src_path, $flour_output_file);



	// Minify
	$minified = \JShrink\Minifier::minify(file_get_contents($flour_output_file));
	file_put_contents($flour_output_minified_file, $minified);



	// Response
	$response = 
	[
		'root' => $flour_root_path,
		'src' => $flour_src_path,
		'dist' => $flour_dist_path,
		'version' => $flour_manifest['version'],
		'pay_load' => $_POST
	];

	echo json_encode($response);

