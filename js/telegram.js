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
    
    var nameRegExp = new RegExp("<p>(" + leftName + "|" + rightName+  "), \\[\\d{2}.\\d{2}.\\d{2} \\d{2}:\\d{2}\\]");

    //split the entire string based on the header styling
    //starts at 2 because 0 is an empty thing for some reason
    // and all the odd numbers are the the rp'er name
    var splits = allText.split(nameRegExp);
    for (var i = 2; i < splits.length; i+=2){
        createParagraphElement(splits[i], (splits[i-1] == leftName));
    }

} //end of telegramDecipher


//**************************
//Guesses the left and right person from the text given: Basically looks for the first two messages and guesses from there
//returns left and right name as a 2-slot array: left, then right.
function parseTelegramNames(allText) {
    var leftName = "";
    var rightName = "";
    
    //used to grab the name from the header. Easiest to use 
    // a reg expression cause Telegram names have like 
    // no unusable characters, so this is the only 
    // way to foolproof against that.
    var regExp = new RegExp("(.*), \\[\\d{2}.\\d{2}.\\d{2} \\d{2}:\\d{2}\\]")
    var splits = allText.split("<p>");
    
    //start at pos 1 because pos 0 is empty for some reason
    leftName = rightName = regExp.exec(splits[1])[1];
    
    for (var i = 2; rightName == leftName && i < splits.length; i++){
        regExp.lastIndex = 0;
        rightName = regExp.exec(splits[i])[1];
    }
    
    return [leftName, rightName];
}
