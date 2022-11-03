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

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    guessedPrompt: guessedPrompt
  }));
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

