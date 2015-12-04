/*
_ .-') _            (`\ .-') /`            _  .-')            _ .-') _    .-')    
        ( (  OO) )            `.( OO ),'           ( \( -O )          ( (  OO) )  ( OO ).  
 .-----. \     .'_         ,--./  .--.  .-'),-----. ,------.  ,--.     \     .'_ (_)---\_) 
/  -.   \,`'--..._)  .-')  |      |  | ( OO'  .-.  '|   /`. ' |  |.-') ,`'--..._)/    _ |  
'-' _'  ||  |  \  '_(  OO) |  |   |  |,/   |  | |  ||  /  | | |  | OO )|  |  \  '\  :` `.  
   |_  < |  |   ' (,------.|  |.'.|  |_)_) |  |\|  ||  |_.' | |  |`-' ||  |   ' | '..`''.) 
.-.  |  ||  |   / :'------'|         |   \ |  | |  ||  .  '.'(|  '---.'|  |   / :.-._)   \ 
\ `-'   /|  '--'  /        |   ,'.   |    `'  '-'  '|  |\  \  |      | |  '--'  /\       / 
 `----'' `-------'         '--'   '--'      `-----' `--' '--' `------' `-------'  `-----'  
*/

    'use strict';

    if (typeof console  != "undefined"){
        if (typeof console.log !== 'undefined'){
            console.olog = console.log;
        }else{
            console.olog = function() {};
        }
    } 
        
    console.log = function(message) {
        console.olog(message);
        $('#console').append('<p>' + message + '</p>');
        $('#console').prop('scrollTop', $('#console').prop('scrollHeight') );
    };

    console.error = console.debug = console.info =  console.log

	var app = function(){
        try {
            this.bindings();
            this.cleanup();
        }
        catch(err) {/*console.log(err)*/}
        this.firebaseScene = null;
        this.version = 1;          
		return this;
	};
	var App = App || {};
	 	