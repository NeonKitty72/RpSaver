/****************************************************************
*   Suzanne Kersten
*	1/12/2017
*	Generates output based on Discord's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO: account for italics and bolding and strikethrough.
*****************************************************************/
{
//basically runs all the things needed to actually parse discord text, just like a main!
function discordDecipher(allText){

    //Last <dayOfWeek> at XX:XX PM OR MMDDYYYY
    var fullDatePattern = "(?:(?:Yesterday|Today|Last (?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)) at \\d{1,2}:\\d{2} (?:A|P)M|\\d{2}/\\d{2}/\\d{4})<\\/p>";
    //username-(Last <dayOfWeek> at XX:XX PM OR XX/XX/XXXX)
    var genericDateHeader = "<p><strong>(\\w*)<\\/strong>-" + fullDatePattern;
    var headerRegExp = new RegExp(genericDateHeader, "g");

    headerRegExp = parseDiscordNames(allText, headerRegExp, fullDatePattern);

    //setup stuff
    //var month = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
    //var inMessageDateRegExp = new RegExp(month + " \\d{1,2}, \\d{4}");
    generateOutput(allText, headerRegExp);

}

var leftName;
//figures out the chatter's usernames and stores them as local variables and in a special regular expression.
function parseDiscordNames(allText, headerRegExp, fullDatePattern){
    var result = allText.match(headerRegExp);

    //get the left name
    leftName = headerRegExp.exec(result[0])[1];		//get first name from header text array
    var rightName = leftName;

    //hunt through the rest of the array for the next name that isn't the same as the previously found name.
    var arrayPos = 0;
    do {
        arrayPos++;
        headerRegExp.lastIndex = 0;
        rightName = headerRegExp.exec(result[arrayPos])[1];	//get name from header text array
    } while (rightName == leftName);

    //generate username headers
    setLeftName(leftName);
    setRightName(rightName);
    generateUsernameHeaders();

    //set up the regular expression for headers based on the
    var header = "<p><strong>(" + leftName+"|"+ rightName + ")<\\/strong>-" + fullDatePattern;
    var newHeaderRegExp = new RegExp(header);
    //console.log("Left Name: " + this.leftName + "| Right Name: " + this.rightName);
    return newHeaderRegExp;
} //end parseDiscordNames

//------------------------------------------------------------------------
//generates the output for an RP using discord's method. 
// preconditions: Basically allText has been set, regular expressions setup, and discord names setup.
// postconditions: Adds text of rp to the html page.
function generateOutput(allText, headerRegExp){        
    //split all the text to just the sections from each rper
    var splits = allText.split(headerRegExp);

    for (var i = 2; i < splits.length; i+=2){
        //Discord gives posts in "sets" by each user
        // so we need to split each "set" into each individual post a user made
        var secondSplits = splits[i].split("</p><p>");
        for (var j = 0; j < secondSplits.length; j++){
            //sends in the actual post and the username from the original split array
            createParagraphElement(secondSplits[j], (splits[i-1] == leftName));
        }
    }
}
}

