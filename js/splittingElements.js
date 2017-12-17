/****************************************************************
*   Suzanne Kersten
*	12/16/2017
*	Sets up a way to double-click on generated elements and
*   edit them, split them into multiple elements, etc.
*
*   TODO: Double check that this works with new parsing methods
*****************************************************************/
var oldText; 		        //the text that was in an rp chat bubble before the user started editing it
var editingText = false;

//start editing an element: Set the text as editable and create a button to save changes and a button
// to delete changes.
function editElem(element) {
    //make sure we're not already editing the element
    if (editingText) {
        alert("you're already editing text!");
        return;
    }

    //set up the element to be editable and look editable
    editingText = true;
    oldText = element.innerText;
    element.setAttribute("id", "editingRpPost");		//make it stand out
    element.setAttribute("contenteditable", "true");	//make the content editable
    element.setAttribute("draggable", "false"); 		//make sure they don't accidentally drag the thing

    //create a panel with buttons to deal with editing text.
    var editControls = setupEditControls();

    element.insertAdjacentElement("afterend", editControls);
}

//make the html elements that control editing
function setupEditControls() {
    var editControls = document.createElement("div");
    editControls.setAttribute("class", "editControl");

    //create the button to save the changes to the text
    var savebtn = document.createElement("button");
    savebtn.appendChild(document.createTextNode("Save Changes"));
    savebtn.setAttribute("type", "button");
    savebtn.setAttribute("onmousedown", "finishEdit(this.parentNode.previousElementSibling);");
    editControls.appendChild(savebtn);

    //create the button to remove the changes to the text
    var cancelbtn = document.createElement("button");
    cancelbtn.appendChild(document.createTextNode("Cancel Changes"));
    cancelbtn.setAttribute("type", "button");
    cancelbtn.setAttribute("onmousedown", "cancelEdit(this.parentNode.previousElementSibling);");
    editControls.appendChild(cancelbtn);

    //create a checkbox for whether to reverse what side all future posts are on after this on/
    // if splitting the post into two posts.
    editControls.innerHTML += "<br />";
    var reverseCheckBox = document.createElement("input");
    reverseCheckBox.setAttribute("id", "reverseCheckBox");
    reverseCheckBox.setAttribute("type", "checkbox");
    reverseCheckBox.checked = true;
    var reverseText = document.createElement("span")
    reverseText.appendChild(reverseCheckBox);
    reverseText.appendChild(document.createTextNode("Reverse future rp posts on split."));
    editControls.appendChild(reverseText);

    return editControls;
}

//save the changes that were made to the post, and then check for splits and clean up tags.
function finishEdit(element) {
    checkForSplit(element);
    element.innerHTML = element.innerText;
    cleanUpFromEditing(element);
}

//cancel the editing. Just reset text, and clean up the tags for moving.
function cancelEdit(element) {
    element.innerHTML = oldText;
    cleanUpFromEditing(element);
}

//reset the inner tags so that the passed in rp post can be used like normal
function cleanUpFromEditing(element) {
    element.setAttribute("contenteditable", "false");	//make the content uneditable again
    element.setAttribute("draggable", "true"); 			//let them drag it again
    if (element.nextElementSibling.getAttribute("class") == "editControl")
        element.parentNode.removeChild(element.nextElementSibling);
    if (element.getAttribute("id") == "editingRpPost")
        element.removeAttribute("id");
    editingText = false;
}

//check for the string {split} in any casing. If it finds it, then add an rp post bubble above
// with all the text UP TO the split, and make the current bubble have all the text AFTER the split.
function checkForSplit(elemToSplit) {
    var splitPos = elemToSplit.innerHTML.search(/{split}/i);

    //if the string was found to be added to the post, then split the post there.
    if (splitPos != -1) {
        //save the value of the checkBox before it's deleted
        var reverseCheckBoxValue = document.getElementById("reverseCheckBox").checked;

        //Make new elem's text out of the text before split and insert it.
        var newElem = elemToSplit.cloneNode(true);
        newElem.innerHTML = elemToSplit.innerText.substring(0, splitPos);
        elemToSplit.insertAdjacentElement("beforebegin", newElem);
        cleanUpFromEditing(newElem);

        //change the text of the html element to everything from after split to the end of the text.
        elemToSplit.innerText = elemToSplit.innerText.substring(splitPos + 7, elemToSplit.innerText.length);

        //change the ordering of all the future posts so it makes more sense.
        if (reverseCheckBoxValue == true) reverseAllFuturePosts(elemToSplit);
    }
}

//recursive function to go through and swap the classes of all the future elements.
function reverseAllFuturePosts(element) {
    if (element == null) return;

    if (element.getAttribute("class") == "leftRP")
        element.setAttribute("class", "rightRP");
    else if (element.getAttribute("class") == "rightRP")
        element.setAttribute("class", "leftRP");

    reverseAllFuturePosts(element.nextElementSibling);
}