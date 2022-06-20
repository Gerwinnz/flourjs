
flour.view.add('form', function()
{
	var view = this;
	view.template = 'form';


	/*
	|
	|	Init
	|
	*/
	view.init = function(params)
	{
		view.state.set('type_options', 
		[
			{ value: 0, label: 'Hobbit' },
			{ value: 1, label: 'Man' },
			{ value: 2, label: 'Goblin' },
			{ value: 3, label: 'Elf' },
			{ value: 4,  label: 'Dwarf' }
		]);

		view.state.set('name', 'Gerwin');
		view.state.set('email', 'gvanroyen@gmail.com');
		view.state.set('type', 3);
		view.state.set('description', 'A human from New Zealand...')
		view.state.set('pet', 'none');
		view.state.set('extra', ['hat','scarf']);
		view.state.set('subscribed', true);
	};



	view.handleFormSubmit = function(event, el)
	{
		event.preventDefault();
		view.trigger('submit', {
			name: view.state.get('name'),
			email: view.state.get('email'),
			type: view.state.get('type')
		});

		view.render();
	};



	view.handleResetClick = function(event, el)
	{
		view.state.set('name', 'Reset name');
	};



	/*
	|
	|	Template
	|
	*/
	view.templateHTML = 
	`
		<div style="display: flex;">
			<form f-on="submit handleFormSubmit" style="flex: 1; margin-right: 16px;">
				<div class="form__line">
					<label>Name</label>
					<input type="search" f-value="name" autocomplete="off" />
				</div>

				<div class="form__line">
					<label>Email</label>
					<input type="text" f-value="email" />
				</div>

				<div class="form__line">
					<label>Type</label>
					<select f-value="type" f-options="type_options"></select>

					<select f-value="type">
						<option>My first option</option>
						{{#list type_options}}
							<option value={{value}}>{{label}}</option>
						{{/list}}
						<option>My last option</option>
					</select>
				</div>

				<div class="form__line">
					<label>Description</label>
					<textarea f-value="description" placeholder="Enter a description..."></textarea>
				</div>

				<div class="form__line">
					<label>Pet</label>
					<div>
						<input id="pet-opt-1" name="pet-option" type="radio" value="none" f-value="pet" />
						<label for="pet-opt-1">None</label>
					</div>
					<div>
						<input id="pet-opt-2" name="pet-option" type="radio" value="cat" f-value="pet" />
						<label for="pet-opt-2">Cat</label>
					</div>
					<div>
						<input id="pet-opt-3" name="pet-option" type="radio" value="dog" f-value="pet" />
						<label for="pet-opt-3">Dog</label>
					</div>
				</div>

				<div class="form__line">
					<label>Optional extras</label>
					<div>
						<input id="extra-opt-1" type="checkbox" value="shoes" f-value="extra" />
						<label for="extra-opt-1">Shoes</label>
					</div>
					<div>
						<input id="extra-opt-2" type="checkbox" value="hat" f-value="extra" />
						<label for="extra-opt-2">Hat</label>
					</div>
					<div>
						<input id="extra-opt-3" type="checkbox" value="gloves" f-value="extra" />
						<label for="extra-opt-3">Gloves</label>
					</div>
					<div>
						<input id="extra-opt-4" type="checkbox" value="scarf" f-value="extra" />
						<label for="extra-opt-4">Scarf</label>
					</div>
				</div>

				<div class="form__line">
					<label>Subscribe</label>
					<div>
						<input id="subscribed-opt" type="checkbox" f-value="subscribed" />
						<label for="subscribed-opt">Subscribed to email list</label>
					</div>
				</div>

				<div class="form__line">
					<button type="submit">Save</button>
					<button type="button" f-on="click handleResetClick">Reset</button>
				</div>
			</form>

			<card-box name="{name}" style="flex: 1; margin-left: 16px;">
				<ul slot="extra">
					<li>Type: <span f-text="type"></span></li>
					<li>Email: <span f-text="email"></span></li>
					<li>Pet: <span f-text="pet"></span></li>
				</ul>
			</card-box>
		</div>
	`;

});