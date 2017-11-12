/**
 * Client-side scripts for preview.html
 */

'use strict';

// Create the invader component for extended functionality
AFRAME.registerComponent('invader', {
	tick: function() {
		var scale = this.el.getAttribute('scale');
		var pos = this.el.getAttribute('position');

		if (scale.x == 0 && scale.y == 0 && scale.z == 0) {
			this.el.parentNode.removeChild(this.el);

			if (!document.querySelector('[invader]')) {
				document.querySelector('a-scene').pause();

				if (fullscreen)
					alert('Congratulations! You destroyed the shapes and won.');

				location.reload();
			}
		}

		for (var i in pos)
			if (parseFloat(pos[i]) > 1 || parseFloat(pos[i]) < -1) return false;

		document.querySelector('a-scene').pause();

		if (fullscreen)
			alert('Game over! You got hit by a shape and lost, try again.');

		location.reload();
	}
});

// Default fullscreen mode to false
var fullscreen = false;

var load = function(data) {

	// Create a new a-scene element
	var scene = $('<a-scene ' +
		'wasd-controls="enabled: false" ' +
		'vr-mode-ui="enabled: ' + fullscreen.toString() +
		'"></a-scene').prependTo('body')
			// Decompress code and prepend to body
			.html($('<a-entity></a-entity>').html(
				LZString.decompressFromEncodedURIComponent(data)
			));

	// If fullscreen mode require double click before execution begins
	if (fullscreen) {
		var scene = document.querySelector('a-scene');
		var entity = document.querySelector('a-entity');

		scene.addEventListener('loaded', function() {
			entity.pause();
			scene.addEventListener('dblclick', function() { entity.play() });
		});
	}
};

// See: https://stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
function insertParam(key, value)
{
    var key = encodeURIComponent(key);
		var value = encodeURIComponent(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--)
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&');
}

$(function() {
	// Variable to store GET parameters in the URL
	var params = {};

	// Find all the GET parameters in the URL
	location.search.substr(1).split('&').forEach(function(param) {
		params[param.split('=')[0]] = param.split('=')[1]
	});

	// If the preview page is in an iframe
	if ('frame' in params)
		// Access the parent's code variable and load it (only works since same origin)
		load(window.parent.code)
	// Otherwise obtain code from socket connection to editor used in device mode
	else {
		// Set fullscreen to true
		fullscreen = true;

		var editorID;
		// If the editor ID has already been entered
		if ('editorid' in params) editorID = params['editorid']
		else {
			// Ask the user for the editor ID
			editorID = prompt('Enter the editor ID:')
				// Remove whitespace and makes it lowercase for convenience especially on phones
				.trim().toLowerCase()
			// TODO: Make this work better
			insertParam('editorid', editorID)
		}

		// Initialise the socket connection after asking for ID to ensure we hear the connect event
		var socket = io.connect();

		// When the socket connects to the server
		socket.on('connect', function() {
			// Send pull event with user provided editor ID
			socket.emit('pull', editorID);
		});

		// On the push event use the compressed code
		socket.on('push', load);
	}
});
