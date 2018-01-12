/****************************************************************
*   Suzanne Kersten
*	1/11/2017
*	Generates output based on Discord's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO:
*****************************************************************/
//Functions
// 	constructor 				basically main
// 	setupRegularExpressions		does what it says in the title. Leaves HeaderRegExp for parseNames.
//	parseDiscordNames			does what it says in the title.
//	
//private vars:
//	allText - 			the text given by the user.
// 	fullDatePattern - 	regular expression in string form for all forms of discord date (after the -)
// 	discordDateRegExp - regular expression that gets generic discord headers and saves the found username when used with exec.
// 	leftName -			the first name found in the input text.
// 	rightName -			the next name found in the input text that isn't the same as the leftName.
// 	headerRegExp -		a regular expression with the two names built in

class discordDecipher{
	//basically runs all the things needed to actually parse discord text, just like a main!
	// adds local vars: allText
	constructor(allText){
		this.allText = allText;
		this.setupRegularExpressions();		
		
		//setup stuff
		this.parseDiscordNames();
		this.generateOutput();
		
	}
	
	//create the basic regular expressions used to parse for generic header dates wihtout usernames.
	// adds local vars: fullDatePattern, discordDateRegExp	
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
	// adds local vars:leftName, rightName, headerRegExp	
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
	
	//generates the output for an RP using discord's method. Basically, for every char in allText, see if 
	// it's a header or a html element and deal with it, else add it to an output buffer.
	// preconditions: Basically allText has been set, regular expressions setup, and discord names setup.
	// postconditions: Adds text of rp to the html page.
	generateOutput(){
		var toOutput = "";
		var isLeft = true;
		var isHeader = 0;
		var posToSkip = 0;
		
		//main loop
		for (var i = 0; i < this.allText.length; i++){
			//check for header
			isHeader = this.isDiscordDateAtPos(i);
			if (isHeader != 0){
				if (toOutput != ""){
					createParagraphElement(toOutput, isLeft);		//add the paragraph element
				}
				
				toOutput = "";	//reset toOutput
				if 		(isHeader[1] == this.leftName) isLeft = true;
				else if (isHeader[1] == this.rightName) isLeft = false;
				if (isDebug) console.log("found header:" + isHeader);
				i += isHeader[0].length;
			}
			
			//skip over html tags
			posToSkip = skipHTMLElements(this.allText, i);
			i += posToSkip;
			if (posToSkip != 0) { continue; }
			
			//check and see if there's a new message by the same user
			if (parseHTMLElements(this.allText, i) == "p" && toOutput != ""){
				createParagraphElement(toOutput, isLeft);
				toOutput = "";
			}
			
			//add the current character to the output buffer
			toOutput += this.allText.charAt(i);
		}
		
		//generate last paragraph element if needed.
		if (toOutput != ""){
			createParagraphElement(toOutput, isLeft);
		}

	}
	
	//figures out if there's a discord date at a passed-in position based on the headerRegExp var.
	// position - 	The position in this.allText to check for if it's a discord date.
	// return - 	The header found at the position. If no header found, returns 0.
	isDiscordDateAtPos(position){
		var substring = this.allText.substr(position, this.allText.length - position);
		if (substring.search(this.headerRegExp) == 0){
			return this.headerRegExp.exec(substring);
		}
		else return 0;
	}
}