/****************************************************************
*   Suzanne Kersten
*	12/19/2017
*	Generates output based on Discord's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO:
*****************************************************************/
//Parses through the text given, looking for discord-specific
//	ways of formatting.
function discordDecipher(allText) {
    //parse the two names used
    var names = parseDiscordNames(allText);
    var leftName = names[0], rightName = names[1];		//the names of the two rpers
    if (isDebug) console.log("Left Name: " + leftName + " |Right Name: " + rightName);
	setLeftName(names[0]);
	setRightName(names[1]);
	generateUsernameHeaders();
	
    for (var i = 0; i < allText.length - 30; i++){
		var sub = allText.substring(i, i + 29);
		if (isDiscordDate(sub)){
			console.log("found date: I: " + i + " | " + sub);
		}
	}
	
} //end of telegramDecipher


//**************************
//Guesses the left and right person from the text given: Basically looks for the first two messages and guesses from there
//returns left and right name as a 2-slot array: left, then right.
function parseDiscordNames(allText) {
    var leftName = "";
    var rightName = "";

	/*
	<p><strong>QueenSuzy</strong>-12/11/2017</p><p><em>gasp!!</em></p><p>how are you??</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>I&rsquo;m ok</p><p>You??</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>I&#39;m alright, kinda meh</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>aww</p><p>eat chocolate</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>I don&#39;t have any!</p><p>wait</p><p>no I do</p><p>I have a snickers ice cream</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>good</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>yee3e</p><p>December 19, 2017</p><p><strong>Sapphykinz</strong>-Today at 9:38 AM</p><p>Slurp</p><p><strong>QueenSuzy</strong>-Today at 5:47 PM</p><p>slrrrpp</p>
	*/
	
	
	var pattern = /<p><strong>\w*<\/strong>-/;
	
    //guess left name, then see if we're right.
    var i = 7;
    for (; i < allText.length - 30; i++) {
		//see is there is a strong before, /strong after, and that there's a date after the -
        leftName = allText.substring(i, (allText.indexOf("-", i) - 9));
		console.log("IsDiscordDate: " + isDiscordDate(allText.substring(i + leftName.length + 9, i + leftName.length + 29)) +"Left Name:" + leftName);
        if (parseHTMLElements(allText, i - 8) == "strong"
		  && parseHTMLElements(allText, i + (leftName.length)) == "/strong"
		  && isDiscordDate(allText.substring(i + leftName.length + 10, i + leftName.length + 40))){
			//leftName = leftName.substring(0, leftName.length - 8);
            break;
		}
    }
	
	i = i + leftName.length;
	
	for (; i < allText.length - 30; i++) {
		rightName = allText.substring(i, allText.indexOf("-", i));
		//console.log(allText.indexOf("-") + "| " + i + "| " + rightName);  
		if (rightName != leftName
		  && parseHTMLElements(allText, i - 8) == "strong"
		  && parseHTMLElements(allText, i + (rightName.length - 9)) == "/strong"
		  && isDiscordDate(allText.substring(i + rightName.length + 1, i + rightName.length + 29))){
			break;
		 }
	}

    return [leftName, rightName];
}

function isDiscordDate(date){
	var dayOfWeek = "(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)"
	var fullPattern = "(Yesterday|Today|Last " + dayOfWeek + ") at \\d:\\d\\d (A|P)M";
	var discordDate = new RegExp(fullPattern);
	
	var normalDate = /\d\d\/\d\d\/\d\d\d\d/;
	
	if (date.search(discordDate) == 0
		|| date.search(normalDate) == 0){
			return true;
		}
	return false;
}

function isDiscordHeaderAtPos(alltext, position){
	if (parseHTMLElements(allText, position) == "strong"
		  && parseHTMLElements(allText, position + leftName.length) == "/strong"
		  && allText.charAt(position + leftName.legnth + 8) == '-'
		  && isDiscordDate(allText.substring(i + leftName.length + 8, i + leftName.length + 29))){        
            
		}
}