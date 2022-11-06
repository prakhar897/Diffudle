var $keyboardWrapper = $('.virtual-keyboard'),
	$key = $keyboardWrapper.find("input"),
	$key_delete = $('.delete'),
	$key_submit = $('.submit'),
	$outputField = $('.output input'),
	actionKeys = $(".delete,.submit")


// delete
$key_delete.on('click', function (e) {
	e.preventDefault();
	var startingEmptyBoxes = document.getElementsByClassName('diffudle-empty-box');

	for (var i = startingEmptyBoxes.length - 1; i >= 0; i--) {
		if (startingEmptyBoxes[i].children.length > 0) {
			startingEmptyBoxes[i].innerHTML = "";
			break;
		}
	}
});

function post(path, params, method = 'post') {

	const form = document.createElement('form');
	form.method = method;
	form.action = path;

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const hiddenField = document.createElement('input');
			hiddenField.type = 'hidden';
			hiddenField.name = key;
			hiddenField.value = params[key];

			form.appendChild(hiddenField);
		}
	}

	document.body.appendChild(form);
	form.submit();
}

// submit
$key_submit.on('click', function (e) {
	e.preventDefault();
	var promptDivChildrens = document.getElementById('promptDiv').children;
	var guessedPrompt = "";
	for (var i = 0; i < promptDivChildrens.length; i++) {
		if (promptDivChildrens[i].children[0].children[0] == null) {
			return;
		}
		guessedPrompt += promptDivChildrens[i].children[0].children[0].innerText;
	}
	console.log(guessedPrompt);

	post('/', { 'guessedPrompt': guessedPrompt });
});

function _fillPrompts() {
	$key.not(actionKeys).on('click', function (e) {
		e.preventDefault();
		var keyValue = $(this).val().toUpperCase();

		var startingEmptyBoxes = document.getElementsByClassName('diffudle-empty-box');

		for (var i = 0; i < startingEmptyBoxes.length; i++) {
			if (startingEmptyBoxes[i].children.length == 0) {
				startingEmptyBoxes[i].innerHTML += "<p class='diffudle-box-content'>" + keyValue + "</p>";
				break;
			}
		}


	});
}



_fillPrompts();

