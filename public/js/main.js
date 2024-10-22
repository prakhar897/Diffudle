var $keyboardWrapper = $('.virtual-keyboard'),
	$key = $keyboardWrapper.find("input"),
	$key_delete = $('.delete'),
	$key_submit = $('.submit'),
	$outputField = $('.output input'),
	actionKeys = $(".delete,.submit"),
	$key_hint = $('.hint'),
	$stats_button = $('#stats'),
	$howToPlay_button = $('#howToPlay')


function convertDateToDashFormat(date){
	return date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) +"-"+("0" + date.getDate()).slice(-2);
}

function post(path, params, method) {
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

function deleteEvent(e) {
	e.preventDefault();
	var startingEmptyBoxes = document.getElementsByClassName('diffudle-empty-box');

	for (var i = startingEmptyBoxes.length - 1; i >= 0; i--) {
		if (startingEmptyBoxes[i].innerText != "") {
			startingEmptyBoxes[i].innerHTML = "";
			break;
		}
	}
}

function hintEvent(e) {
	e.preventDefault();
	post("/hint?date="+formattedDate, {}, 'post');
}

function submitEvent(e) {
	e.preventDefault();

	var boxElements = document.querySelectorAll('[id ^= "box-"]');
	var guessedPrompt = "";
	for (var i = 0; i < boxElements.length; i++) {
		if (boxElements[i].innerText == "") {
			return;
		}
		guessedPrompt += boxElements[i].innerText;
	}
	

	post('/?date='+formattedDate, { 'guessedPrompt': guessedPrompt }, 'post');
};

function fillPromptsEvent(e) {
	e.preventDefault();
	var keyValue = $(this).val().toUpperCase();

	var startingEmptyBoxes = document.getElementsByClassName('diffudle-empty-box');

	for (var i = 0; i < startingEmptyBoxes.length; i++) {
		if (startingEmptyBoxes[i].innerText == "") {
			startingEmptyBoxes[i].innerHTML = keyValue;
			break;
		}
	}
}

const setProgressBar = (gameSolvingPercentage) => {
	$('#progressBar').progress({
		percent: gameSolvingPercentage
	});
}


// Keyboard Support
$(document).ready(function(){
	$(document).keyup(function(e){
		e.preventDefault();
		var keyValue = String.fromCharCode(e.which);
		if ((keyValue >= 'a' && keyValue <= 'z') || (keyValue >= 'A' && keyValue <= 'Z')){
			var $keyQuery = $('.virtual-keyboard :input[value=' + keyValue.toUpperCase() + ']');
			$keyQuery.click();
		} else if(e.which == 8){
			$key_delete.click();
		} else if(e.which == 13){
			$key_submit.click();
		}
	});
});

$key_delete.on('click', deleteEvent);
$key_hint.on('click', hintEvent);
$key_submit.on('click', submitEvent);
$key.not(actionKeys).on('click', fillPromptsEvent);


// Popups

$(function(){
	$stats_button.click(function(){
		$(".stats").modal('show');
	});
	$(".stats").modal({
		closable: true
	});
});

$(function(){
	$howToPlay_button.click(function(){
		$(".howToPlay").modal('show');
	});
	$(".howToPlay").modal({
		closable: true
	});
});

var startDate = new Date("2022-11-22");
var endDate = new Date();

$(document).ready(function(){
	$('#please_wait').hide();
});
$('#date_calendar')
  .calendar({
    type: 'date',
	minDate: startDate,
	maxDate: endDate,
	onChange: function (date, text) {
		//Month is 0 indexed. JS is fking stupid. Also leading zero's need to added in date and month.
		var dateISO = convertDateToDashFormat(date);
		post('/archive?date='+dateISO, {}, 'post');
		$('#please_wait').show();
	}
  })
;









