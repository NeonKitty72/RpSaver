/****************************************************************
*   Suzanne Kersten
*	3/23/2018
*	Helper functions for generating RP's, such as santizing
*   html input and creating properly formatted html p tags.
*
*****************************************************************/

var allText;
var leftName = "", rightName = "";

//takes in a function that MUST return all the text in 
// an array, where elem 0 is a name, elem 1 is text, 
// elem 2 is name, elem 3 is text, etc, etc
function parseText(doParseText, regExp){
    var messages = doParseText(regExp);
    
    for (var i = 2; i < messages.length; i+=2){
        createParagraphElement(messages[i], messages[i-1] == leftName);
    }
}

function parseNames(doParseNames, regExp){
    var names = doParseNames(regExp);
    
    leftName = names[0];
    rightName = names[1];
    generateUsernameHeaders();
}

function discordParseText(){
    //<p><strong>username</strong>-(Last <dayOfWeek> at XX:XX PM OR XX/XX/XXXX)
    var genericDateHeader = "<p><strong>(\\w*)<\\/strong>-" + "(?:(?:Yesterday|Today|Last (?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)) at \\d{1,2}:\\d{2} (?:A|P)M|\\d{2}/\\d{2}/\\d{4})<\\/p>";
    var headerRegExp = new RegExp(genericDateHeader, "g");
    
    parseNames(function(regExp){
        var result = allText.match(regExp);

        //get the left name
        leftName = regExp.exec(result[0])[1];		//get first name from header text array
        var rightName = leftName;

        //hunt through the rest of the array for the next name that isn't the same as the previously found name.
        var arrayPos = 0;
        do {
            arrayPos++;
            regExp.lastIndex = 0;
            rightName = regExp.exec(result[arrayPos])[1];	//get name from header text array
        } while (rightName === leftName);
        
        return [leftName, rightName];
    }, headerRegExp);
    
    parseText(function(regExp){
        console.log(regExp);
        var splits = allText.split(regExp);
        var fullsplits = [""];
        for (var i = 2; i < splits.length; i += 2) {
            //Discord gives posts in "sets" by each user
            // so we need to split each "set" into each individual post a user made
            var secondSplits = splits[i].split("</p><p>");
            for (var j = 0; j < secondSplits.length; j++) {
                fullsplits.push(splits[i - 1]);
                fullsplits.push(secondSplits[j]);
            }
        }
        
        return fullsplits;
    }, headerRegExp);
    
    
}

function telegramParseText(){
    var headerREString = ", \\[\\d{2}.\\d{2}.\\d{2} \\d{2}:\\d{2}\\]";
    var headerRegExp = new RegExp("(.*)" + headerREString);
    
    parseNames(function(regExp){
        var splits = allText.split("<p>");
        //start at pos 1 because pos 0 is empty for some reason
        leftName = rightName = regExp.exec(splits[1])[1];

        for (var i = 2; rightName == leftName && i < splits.length; i++){
            regExp.lastIndex = 0;
            rightName = regExp.exec(splits[i])[1];
        } 
        
        return [leftName, rightName];
    }, headerRegExp);
    
    headerRegExp = new RegExp("<p>(" + leftName + "|" + rightName+  ")" + headerREString);    
    parseText(function(regExp){
        console.log(allText.split(regExp));
        return allText.split(regExp);
    }, headerRegExp);
}

//basically, a menu that chooses what style to expect the input as
// based on the user's radio button choice.
function makeItNoice() {
    
	var testString = "<p><strong>QueenSuzy</strong>-02/24/2018</p><p>LICK UR TV</p><p><strong>VixieMoondew</strong>-02/24/2018</p><p>w-wha</p><p><strong>QueenSuzy</strong>-02/24/2018</p><p>I dunno</p><p>I had an urge and passed it onto you</p><p><strong>VixieMoondew</strong>-02/24/2018</p><p>I get u</p><p><strong>QueenSuzy</strong>-02/24/2018</p><p>yeah</p><p>I&#39;m just feeling a lil off tonight</p><p><strong>VixieMoondew</strong>-02/24/2018</p><p>I get u</p><p>I got Weird Sleep last night so I get it</p><p><strong>QueenSuzy</strong>-02/24/2018</p><p>yeah same here</p><p>It was a nice rest but like... I need MORE</p>";
	//CKEDITOR.instances.rp.setData(testString);

    allText = CKEDITOR.instances.rp.getData();		//Text that is in the user input textArea


	//if (isDebug) console.log(allText);
    document.getElementById("rpOutput").innerHTML = "";	//reset current generated rp

    //get what chat client the user chose
    var messenger = document.getElementsByName("messengerRadioList");
    if (messenger[0].checked) {			//user chose telegram
        telegramParseText();
        //telegramDecipher(allText);
    } else if (messenger[1].checked) {  //user chose discord
        discordParseText();
        //discordDecipher(allText);
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
        if (allText.charAt(i) != "\r" && allText.charAt(i) != "\n"){
            toOutput += allText.charAt(i);
        }
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
    else {return "NONE";}
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
