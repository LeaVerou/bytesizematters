/**
 * Calculate byte size of a text snippet
 * @author Lea Verou
 * MIT License
 */

(function(){

var crlf = /(\r?\n|\r)/g,
	whitespace = /(\r?\n|\r|\s+)/g;

window.ByteSize = {
	count: function(text, options) {
		// Set option defaults
		options = options || {};
		options.lineBreaks = options.lineBreaks || 1;
		options.ignoreWhitespace = options.ignoreWhitespace || false;
		
		var length = text.length,
			nonAscii = length - text.replace(/[\u0100-\uFFFF]/g, '').length,
		    lineBreaks = length - text.replace(crlf, '').length; 
		
		if (options.ignoreWhitespace) {
			// Strip whitespace
			text = text.replace(whitespace, '');
			
			return text.length + nonAscii;
		}
		else {
			return length + nonAscii + Math.max(0, options.lineBreaks * (lineBreaks - 1));
		}
	},
	
	format: function(count, plainText) {
		var level = 0;
		
		while (count > 1024) {
			count /= 1024;
			level++;
		}
	
		// Round to 2 decimals
		count = Math.round(count*100)/100;
	
		level = ['', 'K', 'M', 'G', 'T'][level];
	
		return (plainText? count : '<strong>' + count + '</strong>') + ' ' + level + 'B';
	}
};

})();