/****************************************************************
*   Suzanne Kersten
*	12/18/2017
*	Helper functions for generating RP's, such as santizing
*   html input and creating properly formatted html p tags.
*
*   TODO: make way for user to choose to skip over certain
*   html tags, like em and bold.
*****************************************************************/
//basically, a menu that chooses what style to expect the input as
// based on the user's radio button choice.
function makeItNoice() {
    
	var testString = "<p>Suzy/BigVixie, [05.03.18 15:01]<br />(Mrrph &nbsp;I&#39;m feeling a bit tired, gotta dissapear for a bit. I&#39;ll let you know when I&#39;m free again)</p><p>Fiona Fox, [05.03.18 15:01]<br />((Okay ❤️ Hope your trip has been pleasant so far~))</p><p>Suzy/BigVixie, [05.03.18 15:45]<br />((yeah, I just felt a bit overwhelmed with rp stuff))</p><p>Fiona Fox, [05.03.18 15:46]<br />That&#39;s okay &lt;3 I can always dial it back a bit if you need me to.</p><p>Suzy/BigVixie, [05.03.18 16:55]<br />naah, you&#39;re fine! I just have been talking with several people and I feel tethered, like ai can&#39;t really do anything cause people are gonna be waiting on responses from me</p><p>Fiona Fox, [05.03.18 16:56]<br />Ahh, I see~</p><p>Fiona Fox, [05.03.18 21:07]<br />Hey again~ I was curious if you were a bit more free now.</p><p>Suzy/BigVixie, [05.03.18 21:10]<br />I am, sorry for just kinda dissapearing</p><p>Fiona Fox, [05.03.18 21:10]<br />You&#39;re fine ❤️</p><p>Suzy/BigVixie, [05.03.18 21:10]<br />I feel like a bad lol</p><p>Suzy/BigVixie, [05.03.18 21:10]<br />how you feeling?</p><p>Fiona Fox, [05.03.18 21:11]<br />I&#39;m doing alright myself.</p><p>Suzy/BigVixie, [05.03.18 21:14]<br />goood. &lt;43</p><p>Suzy/BigVixie, [05.03.18 21:14]<br />&lt;3</p><p>Fiona Fox, [05.03.18 21:15]<br />If you&#39;re up for it I&#39;d enjoy continuing, but if you&#39;d rather do it another day, that&#39;s fine too~</p>"
	CKEDITOR.instances.rp.setData(testString);

    var allText = CKEDITOR.instances.rp.getData();		//Text that is in the user input textArea


	if (isDebug) console.log(allText);
    document.getElementById("rpOutput").innerHTML = "";	//reset current generated rp

    //get what chat client the user chose
    var messenger = document.getElementsByName("messengerRadioList");
    if (messenger[0].checked) {			//user chose telegram
        telegramDecipher(allText);
    } else if (messenger[1].checked) {  //user chose discord
        let discord = new discordDecipher(allText);
    } else if (messenger[2].checked) {	//user chose other
		otherDecipher(allText);
	}

    activateSaveButton();		//make the save button available
}

//****************** create username headers ******************
function generateUsernameHeaders(){
	//left header
	var leftHeaderElement = document.createElement("h2");
	leftHeaderElement.setAttribute("class", "leftUsernameHeader");
	var t = document.createTextNode(leftName);
	leftHeaderElement.appendChild(t);

	//right header
	var rightHeaderElement = document.createElement("h2");
	rightHeaderElement.setAttribute("class", "rightUsernameHeader");
	var t2 = document.createTextNode(rightName);
	rightHeaderElement.appendChild(t2);

	//div to hold it all in place
	var div = document.createElement("div");
	div.setAttribute("class", "usernameHeaders");
	div.appendChild(leftHeaderElement);
	div.appendChild(rightHeaderElement);
	document.getElementById("rpOutput").appendChild(div);
}

//****************** setup leftName and rightName ******************
//keeps track of the leftName and rightName so that it can be used
// in setting up paragraph elements.
var leftName = "";
var rightName = "";
function setLeftName(username){
	leftName = htmlDecode(username);
}
function setRightName(username){
	rightName = htmlDecode(username);
}

//****************** Other ******************
//basically just do basic formatting based on newlines and nothing else.
// most basic format.
function otherDecipher(allText) {
    var left = true;
    var toOutput = "";
    for (var i = 0; i < allText.length; i++) {

        //Skip over any html tags.
        var posToSkip = skipHTMLElements(allText, i);
        i += posToSkip;
        if (posToSkip != 0) { continue; }

        //output text, reset vars for next output
        if (parseHTMLElements(allText, i) == "/p" && i + 4 != allText.length) {
            createParagraphElement(toOutput, left); //set up text to display
            toOutput = "";
            left = !left;
        }

        //pick up text until we hit crlf
        if (allText.charAt(i) != "\r" && allText.charAt(i) != "\n")
            toOutput += allText.charAt(i)
    }
    //one last output to grab the last response
    createParagraphElement(toOutput, left);
}

//****************** Helper for parsing HTML from input ******************
//Determines if part of the string is an html element or not.
// If HTML element is found, returns a string of element name without brackets.
//	IE, <p> returns p, </strong> returns /strong.
// If nothing is found, returns NONE
function parseHTMLElements(text, position) {
    if (text.substring(position, position + 3) == "<p>") { return "p"; }
    else if (text.substring(position, position + 4) == "</p>") { return "/p"; }
    else if (text.substring(position, position + 6) == "<br />") { return "br"; }
    else if (text.substring(position, position + 8) == "<strong>") { return "strong"; }
    else if (text.substring(position, position + 9) == "</strong>") { return "/strong"; }
    else if (text.substring(position, position + 4) == "<em>") { return "em"; }
    else if (text.substring(position, position + 5) == "</em>") { return "/em"; }
    else return "NONE";
}

//****************** Santize HTML content ******************
// Sanitizes HTML content, returning only the text used.
// from https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript/34064434#34064434
function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

//****************** skip HTML elements ******************
//if an html element is found, it retuns how many spaces would need to be skipped to get to
// the end of that element. Otherwise, returns 0.
function skipHTMLElements(text, position) {
    //Skip over any html tags.
    var parseHTMLResult = parseHTMLElements(text, position);
    if (parseHTMLResult != "NONE" && parseHTMLResult != "/p") {
        return parseHTMLResult.length + 1; // 1 accounts for end >
    }
    return 0;
}

//****************** Create Paragraph Element ******************
//takes in the text to put in the paragraph element and whether the paragraph is on left or right
//returns the created paragraph element.
function createParagraphElement(text, isLeft) {
    text = htmlDecode(text);

    var paragraphElement = document.createElement("p");
    paragraphElement.setAttribute("class", isLeft ? "leftRP" : "rightRP");
    paragraphElement.setAttribute("style", "height:auto;");
    paragraphElement.setAttribute("ondblclick", "editElem(this);");

    var t = document.createTextNode(text);
    paragraphElement.appendChild(t);
    
	document.getElementById("rpOutput").appendChild(paragraphElement);
}
