

flour.view.add('http', function()
{
	var view = this;

	var getInfo = flour.http.get('http://localhost/flourjs/v2/:name');

	view.init = function()
	{
		view.state.set('response', '');
		view.state.set('error', false);
		view.state.set('post_data', {
			name: 'flourjs',
			size: '11kb',
			awesome: true
		});
	}

	view.handleButtonClick = function(event, el)
	{
		var postData = view.state.get('post_data');

		getInfo(postData).then(function(response){
			view.state.set('error', false);
			view.state.set('response', response);
		}).catch(function(error){
			view.state.set('response', '');
			view.state.set('error', 'Fetch response returned a ' + error.status + ' ' + error.statusText);
		});


		// Alternative callback methods
		//
		// getInfo(postData, 
		// {
		// 	success: function(response)
		// 	{
		// 		view.state.set('error', false);
		// 		view.state.set('response', response);
		// 	},
		// 	error: function(error)
		// 	{
		// 		view.state.set('response', '');
		// 		view.state.set('error', 'Fetch response returned a ' + error.status + ' ' + error.statusText);
		// 	},
		// 	done: function(d)
		// 	{
		// 		console.log('it is done', d);
		// 	}
		// });
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

		<div f-show="!error">
			<card-box name="Post response:">
			<div slot="extra">
				<pre f-text="response"></pre>
			</div>
		</div>

		<alert-box level="error" title="An error occurred." f-show="error">
			<p f-text="error"></p>
		</alert-box>

		<button f-on="click handleButtonClick">Fetch</button>
	
	`;

});