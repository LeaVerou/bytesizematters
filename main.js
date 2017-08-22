(function(){

var isWin = navigator.platform.indexOf('Win') === 0,
	$ = function(id) {
		return document.getElementById(id);
	},
	$attach = function(obj, props, agressive) {
		for (var prop in props) {
			if (agressive || !(prop in obj) || obj[prop] === undefined) {
				obj[prop] = props[prop];
			}
		}
		
		return obj;
	};

var self = window.ByteTextarea = function() {
	var me = self.textareas[this.id = self.textareas.length] = this;

	this.textarea = document.createElement('textarea');
	this.textarea.setAttribute('wrap', 'off');

	this.textarea.oninput = this.textarea.onkeyup = this.textarea.onclick = function(evt){
		me.updateCount();

		return false;
	};

	this.results = document.createElement('div');
	this.results.className = 'results';

	this.container = document.createElement('form');
	this.container.className = 'container';

	var label = document.createElement('label');
	
	label.appendChild(document.createTextNode('Paste your text here:'));
	label.appendChild(this.textarea);

	if (this.id > 0) {
		this.close = $attach(document.createElement('a'), {
			className: 'close',
			href: '#',
			innerHTML: '&times;',
			onclick: function() {
				if(!me.textarea.value || confirm('There is text here. Are you sure?')) {
					me.destroy();
				}
				
				return false;
			}
		}, true);
		
		this.container.appendChild(this.close);
	}
	
	this.container.appendChild(this.results);
	this.container.appendChild(label);
	
	document.body.insertBefore(this.container, addButton);
	
	this.updateCount();
	
	this.textarea.focus();
}

/*********************************************
 * Instance methods
 *********************************************/
self.prototype = {
	updateCount: function() {
		var text = this.textarea.value;
		
		if (self.ignoreWhitespace) {
			this.results.innerHTML = ByteSize.format(ByteSize.count(text, {
				ignoreWhitespace: true
			}));
		}
		else {
			var sizeUnix = ByteSize.format(ByteSize.count(text)),
				sizeWin = ByteSize.format(ByteSize.count(text, {
					lineBreaks: 2
				}));
				
			this.results.innerHTML = (isWin? sizeWin : sizeUnix) +
							' <span class="shade">(' + (isWin? sizeUnix : sizeWin) + ')</span>';
		}
	},

	destroy: function() {
		this.textarea.onkeyup = this.textarea.onclick = this.close.onclick = null;
		
		document.body.removeChild(this.container);
		
		// Prepare for removal from textareas array: Readjust other ids
		for (var i=this.id+1; i<self.textareas.length; i++) {
			self.textareas[i].id--;
		}
		
		// Remove from textareas array
		self.textareas.splice(this.id, 1);
	}
}

/*********************************************
 * Static methods
 *********************************************/
$attach(self, {
	textareas: [],
	
	ignoreWhitespace: false,
});

var noWhitespaceCheckbox = $('nowhitespace'),
	addButton = $attach(document.createElement('button'), {
		innerHTML: 'Add new',
		onclick: function() {
			new self();
	
			return false;
		}
	}, true);

document.body.insertBefore(addButton, $('copyright'));

new self();

noWhitespaceCheckbox.onclick = function() {
	self.ignoreWhitespace = this.checked;
	
	document.body.className = this.checked? 'nowhitespace' : '';

	for (var i=0; i<self.textareas.length; i++) {
		self.textareas[i].updateCount();
	}
};

noWhitespaceCheckbox.onclick();

})();
