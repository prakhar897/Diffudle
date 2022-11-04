var $keyboardWrapper = $('.virtual-keyboard'),
  $key = $keyboardWrapper.find("input"),
  $key_delete = $('.delete'),
  $key_submit = $('.submit'),
  $outputField = $('.output input'),
  $currentValue = $outputField.val(),
  actionKeys = $(".delete,.submit")


// delete
$key_delete.on('click', function (e) {
  e.preventDefault();
  var promptDivChildrens = document.getElementById('promptDiv').children;

    for (var i = promptDivChildrens.length - 1; i >=0 ; i--) {
      if (promptDivChildrens[i].children[0].children[0] != null && promptDivChildrens[i].children[0].children[0].textContent != "/") {
        promptDivChildrens[i].children[0].innerHTML = "";
        break;
      }
    }
});

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

 function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
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
    if(promptDivChildrens[i].children[0].children[0] == null){
      return;
    }
    guessedPrompt += promptDivChildrens[i].children[0].children[0].textContent;
  }
  console.log(guessedPrompt);

  post('/', {'guessedPrompt': guessedPrompt});
});

// grab current value of typed text
function getCurrentVal() {
  $currentValue = $outputField.val();
}

function _fillPrompts() {
  $key.not(actionKeys).on('click', function (e) {
    e.preventDefault();
    var keyValue = $(this).val().toUpperCase();
    var promptDivChildrens = document.getElementById('promptDiv').children;

    for (var i = 0; i < promptDivChildrens.length; i++) {
      if (promptDivChildrens[i].children[0].children[0] == null) {
        promptDivChildrens[i].children[0].innerHTML += "<p class='diffudle-box-content'>" + keyValue + "</p>";
        break;
      }
    }


  });
}



_fillPrompts();

