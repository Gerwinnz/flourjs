<?php

	// Establish paths
	$flour_root_path = dirname(__dir__, 1);
	$flour_src_path = $flour_root_path . '/src/';
	$flour_dist_path = $flour_root_path . '/dist/';

	$flour_output_file = $flour_dist_path . 'flour.js';


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

	touch($flour_output_file);


	// Traverse our src files
	function concat_path_files($path, $dest)
	{
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

	concat_path_files($flour_src_path, $flour_output_file);


	$response = 
	[
		'root' => $flour_root_path,
		'src' => $flour_src_path,
		'dist' => $flour_dist_path,
		'dist_contents' => $dist_contents
	];



	echo json_encode($response);
