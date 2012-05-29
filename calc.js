
var utils = {
	inArray : function (arr, val) {
		return (arr.indexOf(val) != -1);
	}
},
validChar = function(e){
	//library of codes
	var valid = [8,13,35,36,37,39,42,43,45,46,47,48,49,50,51,52,53,54,55,56,57],
		method = [42,43,45,47],
		equal = [13],
		code = e.keyCode,
		value = cal.display.innerText.replace(/^[0]+/g, '');
	//check for a valid key code
	if(utils.inArray(valid, code)){

		//Dont allow multple decimal points
		if(/[.]+[0-9]*[.]+/g.test(value + '.') && code === 46){ e.preventDefault();}

		// lets see if its a method or enter
		if((utils.inArray(method, code) || utils.inArray(equal, code)) && !(code === 45 && value === '') ){

			// if its a method update the method
			if(utils.inArray(method, code)){



				var legend = {
					47 : '/',
					45 : '-',
					43 : '+',
					42 : '*'
				};
				cal.changeMethod(legend[code]);
			// if its enter	
			}else if(utils.inArray(equal, code)){
				//get total
				cal.equals(parseFloat(value));
			}
			e.preventDefault();
		}else{
			cal.display.innerText = value;
		}

	}else{
		e.preventDefault();
	}

};

var calc = function(){
	this.number = null;
	this.method = '+';
	this.display = document.querySelectorAll('.display')[0];
	this.mock = document.querySelectorAll('.mock-display')[0];
	this.btns = document.querySelectorAll('.btn');
};

calc.prototype.changeMethod = function(method){
	this.method = method;

	// when a modifier is hit remove text in display and set number in display to number
	this.number = parseFloat(this.display.innerText);
	this.show('0');
};

calc.prototype.show = function(number){

	this.mock.innerText = (isNaN(number)) ? 'oh' : number;
	this.mock.className = this.mock.className + ' show'; 

	setTimeout(function(){
		cal.mock.className = cal.mock.className.replace(' show', ''); 
		cal.display.innerText = (isNaN(number)) ? 'no!' : number;
		cal.setCursor();
	},200);

};

calc.prototype.equals = function(number){

	number = (isNaN(number)) ? 0 : number;

	switch(this.method){
		case '+' :
			this.number = this.number + number;
			break;
		case '-' :
			this.number = this.number - number;
			break;
		case '*' :
			this.number = this.number * number;
			break;
		case '/' :
			this.number = this.number / number;
			break;
	}

	this.show(this.number);

};

calc.prototype.clear = function(){
	cal.number = 0;
	cal.show('0');
};

calc.prototype.backspace = function(){
	cal.display.innerText = cal.display.innerText.substring(0, cal.display.innerText.length - 1); 
};

calc.prototype.events = function(){

	var btn = {

		click : function(){
			var valid = true;
			var e = {
				keyCode : parseFloat(this.dataset.code),
				preventDefault : function(){ valid = false;},
				char : this.dataset.char
			};

			
			validChar(e);
			//check if valid mock prevent default will stop this
			if(valid){
				cal.display.innerText = cal.display.innerText.replace(/^[0]+/g, '') + e.char;
				cal.display.scrollLeft = cal.display.scrollLeft + 50;

			}

		},
		mousedown : function(e){
			this.className = (/pressed/.test(this.className)) ? this.className : this.className + ' pressed';
		},
		mouseup : function(e){
			this.className = (/pressed/.test(this.className)) ? this.className.replace(' pressed', '') : this.className;
		}

	};

	this.setCursor();

	this.display.addEventListener('keypress', validChar, false);
	document.querySelector('.clear').addEventListener('click', this.clear, false);
	document.querySelector('.backspace').addEventListener('click', this.backspace, false);
	var i = 0;

	while(i < this.btns.length){
		this.btns[i].addEventListener('click', btn.click, true);

		this.btns[i].addEventListener('mousedown', btn.mousedown, true);

		this.btns[i].addEventListener('mouseup', btn.mouseup, true);

		i += 1;
	}
};

calc.prototype.setCursor = function() {
    this.display.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(this.display);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(this.display);
        textRange.collapse(false);
        textRange.select();
    }
};

calc.prototype.build = function(){

	if(window.innerHeight < 360){
		var bottom = document.querySelectorAll('.bottom-tab')[0],
			html = document.getElementsByTagName('html')[0],
			body = document.getElementsByTagName('body')[0];

		window.onload = function(){

			html.style.height = window.innerHeight + 'px';
			html.style.overflow = 'hidden';
			body.style.height = window.innerHeight + 'px';
			body.style.overflow = 'hidden';
			bottom.className = bottom.className + ' panel';
			cal.mock.style.width = (window.innerWidth - 40) + 'px';

		}

	};

	this.events();


};


var cal = new calc();
cal.build();
