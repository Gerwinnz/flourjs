<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Flour JS</title>
		<base href="http://localhost/flourjs/v2/" />

		<link rel="stylesheet" type="text/css" href="app/style.css">
		
		<script type="text/javascript" src="src/app.js"></script>
		<script type="text/javascript" src="src/util.js"></script>
		<script type="text/javascript" src="src/view.js"></script>
		<script type="text/javascript" src="src/state.js"></script>
		<script type="text/javascript" src="src/block.js"></script>
		<script type="text/javascript" src="src/router.js"></script>
		<script type="text/javascript" src="src/pub_sub.js"></script>
		<script type="text/javascript" src="src/binding.js"></script>
		<script type="text/javascript" src="src/template.js"></script>
		<script type="text/javascript" src="src/custom_element.js"></script>

		<script type="text/javascript" src="src/blocks/if.js"></script>
		<script type="text/javascript" src="src/blocks/list.js"></script>

		<script type="text/javascript" src="src/bindings/on.js"></script>
		<script type="text/javascript" src="src/bindings/ref.js"></script>
		<script type="text/javascript" src="src/bindings/text.js"></script>
		<script type="text/javascript" src="src/bindings/view.js"></script>
		<script type="text/javascript" src="src/bindings/value.js"></script>
		<script type="text/javascript" src="src/bindings/options.js"></script>
	</head>
	<body>
		<template id="f-template.list">
			<div>
				<p>There are <span f-text="items_count"></span> items.</p>
				
				<div style="padding: 8px 0;">
					{{#list items}}
						<div style="position: relative; padding: 16px; background-color: #fff; margin:  8px 0; border-radius: 8px;">
							<div style="display: flex; align-items: center;">
								<div style="flex: 1; font-size: 18px;"><span f-text="name"></span></div>
								<div style="flex: 1;">
									Count: <span f-text="count"></span>
									<button class="secondary" f-on="click handleListItemIncrementCountClick" data-id={{id}}>+</button>
								</div>
								<div>
									<button class="secondary" f-on="click handleMoveItemUpClick" data-id={{id}}>
										<i class="fas fa-chevron-up"></i>
									</button>
									<button class="secondary" f-on="click handleMoveItemDownClick" data-id={{id}}>
										<i class="fas fa-chevron-down"></i>
									</button>
									<button class="secondary" f-on="click handleListItemRemoveClick" data-id={{id}}>
										<i class="fas fa-trash"></i>
									</button>
								</div>
							</div>

							<div style="padding: 4px; margin-top: 4px; background-color: #f5f5f5; border-radius: 4px;">
								

								<div style="display: flex; margin-top: 4px;">
									<input type="text" placeholder="New item name..." f-value="new_tag_name" style="padding: 0 4px; flex: 1; border: none; margin-right: 4px;" />
									<button class="secondary" f-on="click handleAddItemTagClick" data-id="{{id}}">Add</button>
								</div>
							</div>
						</div>
					{{/list}}
				</div>

				<div class="flex-row">
					<input type="text" f-value="new_item_name" f-on="keydown handleNameFieldKeypress,focus handleNameFieldFocus" f-ref="name_field" />
					<button class="button" f-on="click handleAddItemClick">Add item</button>
					<button class="button" f-on="click handleSetItemsClick">Set items</button>
					<div style="flex: 1;"></div>
					<button class="button" f-on="click render">Re-render</button>
				</div>
			</div>
		</template>

		<template id="f-template.form">
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

				<card-box name="${name}" style="flex: 1; margin-left: 16px;">
					<ul slot="extra">
						<li>Type: <span f-text="type"></span></li>
						<li>Email: <span f-text="email"></span></li>
						<li>Pet: <span f-text="pet"></span></li>
					</ul>
				</card-box>
			</div>
		</template>


		<div id="app"></div>
		
		<script type="text/javascript" src="app/views/app.js"></script>
		<script type="text/javascript" src="app/views/form.js"></script>
		<script type="text/javascript" src="app/views/home.js"></script>
		
		<script type="text/javascript" src="app/views/blocks.js"></script>
		<script type="text/javascript" src="app/views/block_if.js"></script>
		<script type="text/javascript" src="app/views/block_list.js"></script>

		<script type="text/javascript" src="app/views/binders.js"></script>
		<script type="text/javascript" src="app/views/binder_types.js"></script>

		<script type="text/javascript" src="app/views/components.js"></script>

		<script type="text/javascript" src="app/components/card.js"></script>
		
		<script type="text/javascript" src="app/index.js"></script>

		<script src="https://kit.fontawesome.com/6d564ceef0.js" crossorigin="anonymous"></script>
	</body>
</html>