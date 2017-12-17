/****************************************************************
*   Suzanne Kersten
*	12/16/2017
*	A basic way to save the RP by getting the css from the
*   server and saving the generated output as an HTML doc.
*
*   TODO: Fix problems with saving not looking correct once
*   it's re-opened.
*   - Make a better way for it to get the CSS, update baked-in.
*****************************************************************/
var css;				//used in saving the file: contains css for formatting rp output

//    Make Whatever is stored in rpOutput available to be saved. Get the css from the
//    webpage stored in NeonKitty's GitHub.io page. If that file can't be accessed in 3 seconds,
//    use a baked in version of the css.

function activateSaveButton() {
    var headText
    getFileFromServer("https://sskersten.github.io/stylesheet.css", function (text) { if (text != null) finishActivateSaveButton(text); });
    setTimeout(function () { checkForValidCSSFileOpen() }, 3000);
}

//   If the css file wasn't grabbed from the server, use the baked in css and still activate the save button.
function checkForValidCSSFileOpen() {
    if (document.getElementById("saveBtn").innerHTML == "") {
        alert("Could not access most recent CSS file. Using the baked-in CSS. (You can most likely ignore this and continue on with no problems.)");
        var headText = '#rpOutput{width: 800px;margin: auto;}.leftRP {max-width: 75%;min-width: 40%;background-color: #E9E8F1;font-size: 14px;font-color: #25201C;padding: 10px;margin: 0px;margin-bottom: 4px;border-radius: 10px;float: left;}.rightRP {max-width: 75%;min-width: 40%;background-color: #DCF2D4;font-size: 14px;font-color: #25201C;font-family: Verdana, sans-serif;padding: 10px;margin: 0px;margin-bottom: 4px;border-radius: 10px;float: right;}'
        finishActivateSaveButton(headText);
    }
}

//  Set up the html of the file to save and prepare the save button, actually activating it.
function finishActivateSaveButton(headText) {

    //Set up the basic html of the file to save
    headText = '<html lang="en"><head><title>RP Saver</title><meta charset="UTF-8"><style>' + headText;
    headText = headText + '</style></head><body><div id="rpOutput">';
    var text = document.getElementById("rpOutput").innerHTML;
    //set up the save button to actually save the file
    var saveBtn = document.getElementById("saveBtn");
    saveBtn.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(headText + text + "</div></body></html>"));
    saveBtn.setAttribute('download', "RP.html");
    saveBtn.innerHTML = "Save this as a web page file";

}

//   Gets a file from a server using a basic GET protocol from the specified url.
//   Returns the file contents through a passed in function.
function getFileFromServer(url, doneCallBack) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    function handleStateChange() {
        if (xhr.readyState == 4) {
            doneCallBack(xhr.status == 200 ? xhr.responseText : null);
        }
    }
}
