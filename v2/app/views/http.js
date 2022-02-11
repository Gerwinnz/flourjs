

flour.view.add('http', function()
{
	var view = this;

	var getInfo = flour.http.add('/info/:name',
	{
		method: 'get',
		format: 'json'
	});

	view.init = function()
	{
		view.state.set('post_data', {
			name: 'flourjs',
			size: '11kb',
			awesome: true
		});
	}

	view.handleButtonClick = function(event, el)
	{
		var postData = view.state.get('post_data');
		getInfo(postData).then(() => {

		});
	};



	/*
	|
	|	Template
	|
	*/
	view.templateHTML = 
	`
		<h1>Simple http mechanism</h1>

		<div>
			<card-box name="Options:">
				<div slot="extra">
					<div class="form__line">
						<label>name</label>
						<input type="text" f-value="post_data.name" />
					</div>
					<div class="form__line">
						<label>size</label>
						<input type="text" f-value="post_data.size" />
					</div>
					<div class="form__line">
						<label>awesome</label>
						<input type="checkbox" f-value="post_data.awesome" />
					</div>
				</div>
			</card-box>
		</div>

		<div>
			<card-box name="Post data:">
				<div slot="extra">
					<pre f-text="post_data | json"></pre>
				</div>
			</card-box>
		</div>

		<div>
			<card-box name="Post response:">
			<div slot="extra">
				<pre></pre>
			</div>
		</div>

		<alert-box level="error" title="An error occurred.">
			<p>Yeah weird, it looks like something went wrong. This is how you can fix it and stuff...</p>
		</alert-box>

		<button f-on="click handleButtonClick">Fetch</button>
	
	`;

});