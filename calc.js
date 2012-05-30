
var utils = {
	inArray : function (arr, val) {
		return (arr.indexOf(val) != -1);
	}
};

var calc = function(){
	this.state = 0;
	this.equal = null;
	this.number = null;
	this.method = '+';
	this.display = document.querySelectorAll('.display')[0];
	this.mock = document.querySelectorAll('.mock-display')[0];
	this.displaywrp = document.querySelectorAll('.display-wrp')[0];
	this.btns = document.querySelectorAll('.btn');
};

calc.prototype.charset = function(e){



	//library of codes
	var _this = (typeof this.display === 'undefined') ? cal : this;
		valid = [8,13,35,36,37,39,42,43,45,46,47,48,49,50,51,52,53,54,55,56,57],
		method = [42,43,45,47],
		equal = [13],
		code = e.keyCode,
		value = _this.display.innerText.replace(/^[0]+/g, '');
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

				_this.changeMethod(legend[code]);
			// if its enter	
			}else if(utils.inArray(equal, code)){
				//get total
				_this.equals(parseFloat(value));
			}
			e.preventDefault();
		}else{
			if(_this.state === 1){
				_this.show(String.fromCharCode(code));
				_this.state = 0;
				e.preventDefault();
			}else{
				_this.display.innerText = value;
			}
		}

	}else{
		e.preventDefault();
	}

};

calc.prototype.changeMethod = function(method){

	if(this.state === 2){

		var value = this.display.innerText.replace(/^[0]+/g, '');
		this.equal = this.equals(parseFloat(value), 'soft');

		console.log(this.equal);

	}else{
	// when a modifier is hit remove text in display and set number in display to number
	this.number = parseFloat(this.display.innerText);

	}

	this.method = method;
	this.methodDisplay(this.method);

	this.show('0');
	this.state = 2;
};

calc.prototype.methodDisplay = function(method){

	var i = 0;
	while(i <this.btns.length){
		if(this.btns[i].dataset['char'] === method){
			// remove before adding to avoid multiple classes on same button
			this.btns[i].className = this.btns[i].className.replace(' current', '') + ' current';
		}else{
			this.btns[i].className = this.btns[i].className.replace(' current', ''); 			
		}
		i += 1;
	}
}

calc.prototype.show = function(number){

	var _this = this;

	this.mock.innerText = (isNaN(number)) ? 'Reset Me Please' : number;
	this.displaywrp.className = this.displaywrp.className + ' show'; 

	setTimeout(function(){
		_this.displaywrp.className = _this.displaywrp.className.replace(' show', ''); 
		_this.display.innerText = (isNaN(number)) ? 'Reset Me' : number;
		_this.setCursor();
	},100);

};

calc.prototype.equals = function(number, method){

	this.state = 1;
	this.methodDisplay(null);

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

	if(method !== 'soft'){
		this.show(this.number);
	}

	return this.number;

};

calc.prototype.clear = function(){

	var _this = cal;

	_this.number = 0;
	_this.show('0');
};

calc.prototype.backspace = function(){

	var _this = cal;

	_this.display.innerText = _this.display.innerText.substring(0, _this.display.innerText.length - 1); 

};

calc.prototype.events = function(){

	var _this = this

	var btn = {

		click : function(){
			var valid = true;
			var e = {
				keyCode : parseFloat(this.dataset.code),
				preventDefault : function(){ valid = false;},
				char : this.dataset.char
			};

			
			_this.charset(e);
			//check if valid mock prevent default will stop this
			if(valid){
				_this.display.innerText = _this.display.innerText.replace(/^[0]+/g, '') + e.char;
				_this.display.scrollLeft = _this.display.scrollLeft + 50;

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

	this.display.addEventListener('keypress', this.charset, false);
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

	var _this = this;

	if(window.innerHeight < 360){
		var bottom = document.querySelectorAll('.bottom-tab')[0],
			html = document.getElementsByTagName('html')[0],
			body = document.getElementsByTagName('body')[0];

		window.onload = function(){

			if(window.innerHeight > 0){ 
				html.style.height = window.innerHeight + 'px';
				html.style.overflow = 'hidden';
				body.style.height = window.innerHeight + 'px';
				body.style.overflow = 'hidden';
				bottom.className = bottom.className + ' panel';
			}
			

		}

	};

	_this.mock.style.width = (window.innerWidth - 40) + 'px';

	this.events();


};


var cal = new calc();
cal.build();
