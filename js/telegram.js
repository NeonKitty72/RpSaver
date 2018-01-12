/****************************************************************
*   Suzanne Kersten
*	12/18/2017
*	Generates output based on Telegram's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO: Shove checking for if something is a name
*   (IE ungodly long if in the parseNames) into it's own func.
*****************************************************************/
//Parses through the text given, looking for telegram-specific
//	ways of formatting.
function telegramDecipher(allText) {
    //parse the two names used
    var names = parseTelegramNames(allText);
    var leftName = names[0], rightName = names[1];		//the names of the two rpers
    if (isDebug) console.log("Left Name: " + leftName + " |Right Name: " + rightName);
	setLeftName(names[0]);
	setRightName(names[1]);
	generateUsernameHeaders();

    var toOutput = "";									//the text to output
    var left = 1;										//whether to align text left or right
    for (var i = 0; i < allText.length; i++) {


        //Skip over any html tags.
        var posToSkip = skipHTMLElements(allText, i);
        i += posToSkip;
        if (posToSkip != 0) { continue; }

        //make sure it's not the header line
        if (allText.charAt(i) == leftName.charAt(0)
            && allText.charAt(i + leftName.length + 2) == "["		//check for [ after name, plus ,<space>
            && allText.charAt(i + leftName.length + 17) == "]") {	// and the ending ]
            left = true;
            i = i + leftName.length + 24;							//24 is total 'header' text after user's name
        } else if (allText.charAt(i) == rightName.charAt(0)
            && allText.charAt(i + rightName.length + 2) == "["		//same as before, but with right name
            && allText.charAt(i + rightName.length + 17) == "]") {
            left = false;
            i = i + rightName.length + 24;
        }

        //output text, reset vars for next output
        if (parseHTMLElements(allText, i) == "/p" && i + 4 != allText.length) {	//account for last /p
            username = (left ? leftName : rightName);
			createParagraphElement(toOutput, left);		//add the paragraph element
            toOutput = "";	//reset toOutput
        }

        //pick up text until we hit crlf
        if (allText.charAt(i) != "\r" && allText.charAt(i) != "\n") {
            toOutput += allText.charAt(i)
        }
    } //end of for loop

    if (toOutput != "") {
		username = (left ? leftName : rightName);
        createParagraphElement(toOutput, left);						//add the paragraph element
    }
} //end of telegramDecipher


//**************************
//Guesses the left and right person from the text given: Basically looks for the first two messages and guesses from there
//returns left and right name as a 2-slot array: left, then right.
function parseTelegramNames(allText) {
    var leftName = "";
    var rightName = "";

    //guess left name, then see if we're right.
    var i = 3;
    for (; i < allText.length - 1; i++) {
        leftName = allText.substring(i, allText.indexOf(","));
        if (parseHTMLElements(allText, i - 3) == "p"
            && allText.charAt(i + leftName.length + 2) == "["		//check if there's a [ after their name, plus space for , and the space
            && allText.charAt(i + leftName.length + 5) == "."
            && allText.charAt(i + leftName.length + 8) == "."
            && allText.charAt(i + leftName.length + 14) == ":"
            && allText.charAt(i + leftName.length + 17) == "]"
            && parseHTMLElements(allText, i + leftName.length + 18) == "br") {
            i = i + 24; //skip past this name
            break;
        }
    }

    //guess right name, then see if it's good. Starts from where last loop left off
    for (; i < allText.length - 1; i++) {
        rightName = (allText.substring(i, allText.indexOf(",", i)));
        if (rightName == leftName) {
            i = i + 24;
        }
        if (parseHTMLElements(allText, i - 3) == "p"
            && rightName != leftName                                //make sure we didn't just grab the same name
            && allText.charAt(i + rightName.length == ",")
            && allText.charAt(i + rightName.length + 2) == "["		//same as before, but with right name
            && allText.charAt(i + rightName.length + 5) == "."
            && allText.charAt(i + rightName.length + 8) == "."
            && allText.charAt(i + rightName.length + 14) == ":"
            && allText.charAt(i + rightName.length + 17) == "]"
            && allText.charAt(i + rightName.length + 17) == "]"
            && parseHTMLElements(allText, i + rightName.length + 18) == "br") {
            break;
        }
    }
    return [leftName, rightName];
}
