/****************************************************************
*   Suzanne Kersten
*	1/12/2017
*	Generates output based on Discord's way of formatting
*   text when it's copy/pasted into a textbox.
*
*   TODO: account for italics and bolding and strikethrough.
*****************************************************************/
//Functions
//  constructor                 basically main
//  setupRegularExpressions     does what it says in the title. Leaves HeaderRegExp for parseNames.
//  parseDiscordNames           does what it says in the title.
//
//private vars:
//  allText -			the text given by the user.
//  fullDatePattern -	regular expression in string form for all forms of discord date (after the -)
//  discordDateRegExp - regular expression that gets generic discord headers and saves the found username when used with exec.
//  leftName -			the first name found in the input text.
//  rightName -         the next name found in the input text that isn't the same as the leftName.
//  headerRegExp -		a regular expression with the two names built in

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
        
        //used in checking for "divider dates" discord puts on different days
        var month = "(?:January|February|March|April|May|June|July|August|September|October|November|December)";
        this.inMessageDateRegExp = new RegExp(month + " \\d{1,2}, \\d{4}");
	}

	//figures out the chatter's usernames and stores them as local variables and in a special regular expression.
	// adds local vars:leftName, rightName, headerRegExp
	parseDiscordNames(){
		var result = this.allText.match(this.discordDateRegExp);
		//console.log(result);

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

	//generates the output for an RP using discord's method. 
	// preconditions: Basically allText has been set, regular expressions setup, and discord names setup.
	// postconditions: Adds text of rp to the html page.
	generateOutput(){        
        //split all the text to just the sections from each rper
        var splits = this.allText.split(this.headerRegExp);
        
        for (var i = 2; i < splits.length; i+=2){
            //Discord gives posts in "sets" by each user
            // so we need to split each "set" into each individual post a user made
            var secondSplits = splits[i].split("</p><p>");
            for (var j = 0; j < secondSplits.length; j++){
                //sends in the actual post and the username from the original split array
                createParagraphElement(secondSplits[j], (splits[i-1] == this.leftName));
            }
        }
	}
}
