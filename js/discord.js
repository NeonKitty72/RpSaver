/****************************************************************
*   Suzanne Kersten
*	12/29/2017
*	Generates output based on Discord's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO:
*****************************************************************/

class discordDecipher{
	constructor(allText){
		this.allText = allText;
		this.setupRegularExpressions();		
		
		//setup stuff
		this.parseDiscordNames();
		
		
	}
	
	//create the basic regular expressions used to parse for generic header dates wihtout usernames.
	// added local vars:
	// fullDatePattern - 	regular expression in string form for all forms of discord date (after the -)
	// discordDateRegExp - 	regular expression that gets generic discord headers and saves the found username when used with exec.
	setupRegularExpressions(){
		var dayOfWeek = "(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)"
		//Last <dayOfWeek> at XX:XX PM
		var discordDatePattern = "(?:Yesterday|Today|Last " + dayOfWeek + ") at \\d{1,2}:\\d{2} (?:A|P)M";
		//used again in header regular expressions
		this.fullDatePattern = "(?:" + discordDatePattern + "|\\d{2}/\\d{2}/\\d{4})<\\/p>";
		//username-(Last <dayOfWeek> at XX:XX PM OR XX/XX/XXXX)
		var genericDateHeader = "<p><strong>(\\w*)<\\/strong>-" + this.fullDatePattern;
		this.discordDateRegExp = new RegExp(genericDateHeader, "g");
	}
	
	//figures out the chatter's usernames and stores them as local variables and in a special regular expression.
	// added local vars:
	// leftName -				the first name found in the input text.
	// rightName -		the next name found in the input text that isn't the same as the leftName.
	// headerRegExp -		a regular expression with the two names built in
	parseDiscordNames(){		
		var result = this.allText.match(this.discordDateRegExp);
		console.log(result);
		
		//get the left name
		this.leftName = this.discordDateRegExp.exec(result[0])[1];		//get first name from header text array
		//this.leftNameHeaderLength = result[0].length;
		
		//hunt through the rest of the array for the next name that isn't the same as the previously found name.
		var arrayPos = 0;
		do {
			arrayPos++;
			this.discordDateRegExp.lastIndex = 0;
			this.rightName = this.discordDateRegExp.exec(result[arrayPos])[1];	//get name from header text array
		} while (this.rightName == this.leftName);
		//this.rightNameHeaderLength = result[arrayPos].length;
		
		//generate username headers
		setLeftName(this.leftName);
		setRightName(this.rightName);
		generateUsernameHeaders();
		//set up the regular expression for headers based on the 
		var header = "<p><strong>(" + this.leftName+"|"+this.rightName + ")<\\/strong>-" + this.fullDatePattern;
		this.headerRegExp = new RegExp(header);
		console.log("Left Name: " + this.leftName + "| Right Name: " + this.rightName);	

	} //end parseDiscordNames
	
	/*
	isDiscordDateAtPos(position){
		if (this.allText.search(this.discordDateRegExp) == position){
			return true;
		}
		return false;
	} */
}
	/*
	Setup the generic discordDate regExp, but add the <p><strong>(\w*)</strong>-(header)</p>into the mix. 
for every element, starting at 0 and counting up with ice
	if isDiscordDateAtPos with text and i
		result = discordDate.exec(allText);
		set name to result[1];
		i++ 
		break;
	endif
endfor
for every element, continuing where last for loop left off
	if isDiscordDateAtPos with text and i 
		result = discordDate.exec(allText);
		if result[1] is not equal to leftName
			set rightName to result[1]
			i++
			break;
		endif
	endif
endfor

then setup the names as leftName and rightName
this.leftName = leftName;
this.rightName = rightName;
set up header regExp as described above
	















/*
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

	
	<p><strong>QueenSuzy</strong>-12/11/2017</p><p><em>gasp!!</em></p><p>how are you??</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>I&rsquo;m ok</p><p>You??</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>I&#39;m alright, kinda meh</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>aww</p><p>eat chocolate</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>I don&#39;t have any!</p><p>wait</p><p>no I do</p><p>I have a snickers ice cream</p><p><strong>Sapphykinz</strong>-12/11/2017</p><p>good</p><p><strong>QueenSuzy</strong>-12/11/2017</p><p>yee3e</p><p>December 19, 2017</p><p><strong>Sapphykinz</strong>-Today at 9:38 AM</p><p>Slurp</p><p><strong>QueenSuzy</strong>-Today at 5:47 PM</p><p>slrrrpp</p>
	
	
	
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
} */




/*
//**************************
//Guesses the left and right person from the text given: Basically looks for the first two messages and guesses from there
//returns left and right name as a 2-slot array: left, then right.
function parseDiscordNames(allText) {
    var leftName = "";
    var rightName = "";
	
	
	var pattern = /<p><strong>\w*<\/strong>-/;
	
    //guess left name, then see if we're right.
    var i = 0;
    for (; i < allText.length - 30; i++) {
		//see is there is a strong before, /strong after, and that there's a date after the -
        leftName = allText.substring(i, (allText.indexOf("-", i) - 9));
		console.log("IsDiscordDate: " + isDiscordDate(allText.substring(i + leftName.length + 10, i + leftName.length + 29)) +"Left Name:" + leftName + "Discord date substring: " + allText.substring(i + leftName.length + 10, i + leftName.length + 40));
		
        if (parseHTMLElements(allText, i - 8) == "strong"
		  && parseHTMLElements(allText, i + (leftName.length)) == "/strong"
		  && isDiscordDate(allText.substring(i + leftName.length + 10, i + leftName.length + 40))){
			//leftName = leftName.substring(0, leftName.length - 8);
            break;
		}
    }
	
	i = i + leftName.length;
	
	for (; i < allText.length - 30; i++) {
		rightName = allText.substring(i, (allText.indexOf("-", i) - 9));
		console.log("next -: " + allText.indexOf("-", i) + "| " + "i: " + i + "| " + rightName);  
		if (rightName != leftName
		  && parseHTMLElements(allText, i - 8) == "strong"
		  && parseHTMLElements(allText, i + (rightName.length)) == "/strong"
		  && isDiscordDate(allText.substring(i + rightName.length + 10, i + rightName.length + 40))){
			break;
		 }
	}

    return [leftName, rightName];
}

function getDiscordDateRegExp(){
	var dayOfWeek = "(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)"
	var fullPattern = "(?:Yesterday|Today|Last " + dayOfWeek + ") at \\d{1,2}:\\d{2} (?:A|P)M";
	return new RegExp(fullPattern);
}

//Last Monday at 12:52 PM</p><p>
function isDiscordDate(date){
	var discordDate = getDiscordDateRegExp();
	var normalDate = /\d\d\/\d\d\/\d\d\d\d/;
	
	if (date.search(discordDate) == 0
		|| date.search(normalDate) == 0){
			console.log(discordDate.exec(date));
			return true;
		}
	return false;
}

function makeHeaderRegExp(name){
	var base = "<p><strong>" + name + "<\/strong>-(" + getDiscordDateRegExp() + "|\\d{2}/\\d{2}/\\d{4})";
	return new RegExp(base);
}

*/