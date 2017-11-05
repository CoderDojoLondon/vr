/**
 * Client-side scripts for index.html
 */

'use strict';

$(function() {
	var code;

	// Handle click on execute button
	$('a.execute').click(function(e) {
		e.preventDefault();

		// Compress the new code
		code = LZString.compressToEncodedURIComponent(
			($('article.active textarea.before').val() || '') +
			$('article.active div.CodeMirror').get(0).CodeMirror.getValue() +
			($('article.active textarea.after').val() || '')
		)

		// Update the preview frame with the compressed code
		$('iframe').attr('src', 'preview?q=' + code);
	});

	// Setup textarea with CodeMirror
	$('textarea[data-mode]').each(function() {
		CodeMirror.fromTextArea(this, {
			lineWrapping: true,
			indentWithTabs: true,
			smartIndent: false,
			autoRefresh: true
		});
	});

	var activateArticle = function(article) {
		// If there isn't an article to activate return false
		if(!article.length) return false

		// Execute the code
		article.addClass('active')
			.find('a.execute').click()

		if (article.hasClass('fullscreen'))
			$('.preview').hide()
		else
			$('.preview').show()

		// Update window hash for anchor
		window.location.hash = article.attr('id');

		// Indicate success
		return true
	};

	var changeArticle = function(from, to) {
		var parent = $(from)
			.parents('article').removeClass('active');

		if (to === 'next')
			to = parent.next()
		else if(to === 'prev')
			to = parent.prev()

		// Activate the article
		activateArticle(to)
	};

	// Next button click event
	$('a.next').click(function(e) {
		e.preventDefault();

		changeArticle($(this), 'next')
	});

	// Previous button click event
	$('a.previous').click(function(e) {
		e.preventDefault();

		changeArticle($(this), 'prev')
	});

	// If window.location.hash not set or no article with that ID use first tutorial
	if (
		!window.location.hash ||
		!activateArticle($('section article' + window.location.hash))
	)
		activateArticle($('section article').first());

	// Disable appropiate buttons from first and last tutorial
	$('section article').first().find('a.previous').addClass('disabled');
	$('section article').last().find('a.next').addClass('disabled');

	// Pick a random ID of 5 characters
	var id = Math.random().toString(36).slice(-5);

	// Initialise the socket connection
	var socket = io.connect();

	socket.on('connect', function() {
		// Show the generated ID in the editor
		$('span.peer').text(id);

		// Send the register event with the generated ID
		socket.emit('register', id);
	});

	// Handle pull request from viewer
	socket.on('pull', function(viewer) {
		// Send the push event with the compressed code
		socket.emit('push', viewer, code);
	});
});
