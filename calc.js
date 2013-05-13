var calc = function(){
	this.state = 0;
	this.equal = null;
	this.number = null;
	this.method = '+';
	this.chain = [];
	this.chainState = 0;
	this.display = document.querySelectorAll('.display')[0];
	this.mock = document.querySelectorAll('.mock-display')[0];
	this.displaywrp = document.querySelectorAll('.display-wrp')[0];
	this.btns = document.querySelectorAll('.btn');
},

customizr = function(){
	var bodycss = [],
		style = document.getElementById('cust'),
		imp = '!important;',
		styles,syntax;
	if(typeof localStorage.background === 'string'){
		syntax = 'background : ' + localStorage.background + imp;
		bodycss.push(syntax);
		styles = document.createTextNode('nav{background-color:'+localStorage.background+imp+'}');
		style.appendChild(styles);
	}else{
		localStorage.background = '#CCCCCC';
	}
	if(typeof localStorage.font === 'string'){
		syntax = 'font-family : ' + localStorage.font + imp;
		bodycss.push(syntax);
	}else{
		localStorage.font = 'monospace';
	}
	if(typeof localStorage.highlight === 'string'){
			styles = document.createTextNode('.btn.current{background:'+localStorage.highlight+imp+'}');
			style.appendChild(styles);
	}else{
		localStorage.highlight = '#FF4E00';
	}

	if(bodycss.length > 0){
		styles = document.createTextNode('body{' + bodycss.join('') + '}');
		style.appendChild(styles);
	}
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
	if(valid.contains(code)){

		//Dont allow multple decimal points
		if(/[.]+[0-9]*[.]+/g.test(value + '.') && code === 46){ e.preventDefault();}

		// lets see if its a method or enter
		if((method.contains(code) || equal.contains(code)) && !(code === 45 && value === '') ){

			// if its a method update the method
			if(method.contains(code)){

				var legend = {
					47 : '/',
					45 : '-',
					43 : '+',
					42 : '*'
				};

				_this.changeMethod(legend[code]);
				_this.addChain(legend[code]);
			// if its enter	
			}else if(equal.contains(code)){
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
			_this.addChain(String.fromCharCode(code));
		}

	}else{
		e.preventDefault();
	}

};
// parse the chain of number for history, need to send this data once parsed to be parsed again to be strore in seesionStorage && eventually localstorage
calc.prototype.parseChain = function(){
	var i = 0,
		bundle = [],
		thisBundle = [];
	// split chain into bundle mainly to link numbers
	while (i < this.chain.length){
		var _this = this.chain[i];
		if(_this.isNum()){
			thisBundle.push(_this);
		}else if(_this.isMod()){
			bundle.push(thisBundle.join(''));
			bundle.push(_this);
			thisBundle.length = 0;
		}
		
		i += 1;
		//join all the bundles
		if(i === this.chain.length && thisBundle.length > 0){
			bundle.push(thisBundle.join(''));
		}
	}
	// leave an array of single variable
	this.chain = bundle;
	// reset array and index
	var _bundle = [],
		__thisBundle = [];
	i = 0;
	while (i < this.chain.length){
		var __this = this.chain[i];
		if(__this === 'b'){
			_bundle.push(__thisBundle.join(' '));
			__thisBundle.length = 0;
		}else{
			__thisBundle.push(__this);
		}
		i += 1;
	}

	var result = {equations:_bundle,chain:this.chain};

	console.log(result);

	// console.log(_bundle);
	sessionStorage.chain = JSON.stringify(result);
	// TODO: need to loop again and chain equations together
	// TODO: take list the flip and display in list.
	

}

calc.prototype.addChain = function(char){

	 this.chain.push(char);

	 this.parseChain();

	 //console.log(this.chain);
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
		this.addChain('=');
		this.addChain(this.number.toString());
		this.addChain('b');
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

	// check if were dealing with a number
	if(_this.chain[_this.chain.length - 1].isNum()){
		// pop last value off chain
		_this.chain.pop();
	}

};

calc.prototype.events = function(){

	var _this = this;

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

	}, next = function(){
		var bod = document.getElementsByTagName('body')[0],
			thisConsole = document.querySelector('.console-wrp ul'),
			make = (function(){
				thisConsole.innerHTML = '';
				var i = 0,
				data = JSON.parse(sessionStorage.chain).equations;
				//Flip data to show newest first
				data.reverse();
				if(data.length === 0){
					thisConsole.innerHTML += '<li>Calculate to Populate</li>';
				}
				while(i < data.length){
					thisConsole.innerHTML += '<li>' + data[i] + '</li>';
					i += 1;
				}
			}());

		bod.className = bod.className.replace('calculator', 'console');
	}, back = function(){
		var bod = document.getElementsByTagName('body')[0];
		bod.className = bod.className.replace('console', 'calculator');
	};

	this.setCursor();

	this.display.addEventListener('keypress', this.charset, false);
	document.querySelector('.clear').addEventListener('click', this.clear, false);
	document.querySelector('.backspace').addEventListener('click', this.backspace, false);
	document.querySelector('.expand').addEventListener('click', next, false);
	document.querySelector('.back-to-cal').addEventListener('click', back, false);
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
		bottom = document.querySelectorAll('.bottom-tab')[0],
		html = document.getElementsByTagName('html')[0],
		body = document.getElementsByTagName('body')[0],
		loading = document.querySelectorAll('.loading-wrp')[0],
		wh = window.innerHeight;


		if(wh < 360){
			wh = 360;
			//compensate for chrome os thinking that its toolbar is part of the innerheight - 30px toolbar
			window.resizeTo(280, 390);
		}

	html.style.height = wh + 'px';
	html.style.overflow = 'hidden';
	body.style.height = wh + 'px';
	body.style.overflow = 'hidden';

	_this.mock.style.width = (window.innerWidth - 40) + 'px';

	this.events();

	loading.className += ' loaded';

};

//Modify the DOM a little
//if its a number
String.prototype.isNum = function(){
	var num = /[0-9]+/,
		dot = /[.]+/;
	
	return (num.test(this) || dot.test(this));
};
// if is a modifier
String.prototype.isMod = function(){
	var mod = /[\/\-\+\*\=b]/;

	return mod.test(this);
};

//Check if in array return boolean
Array.prototype.contains = function(mixed){
	return (this.indexOf(mixed) != -1);
};

var cal = new calc();
cal.build();
customizr();
