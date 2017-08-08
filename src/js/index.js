$(function() {
	// Activate the first tutorial section and disable appropiate buttons for first and last element
	$('section article').first().addClass('active').find('a.previous').addClass('disabled');
	$('section article').last().find('a.next').addClass('disabled');

	$('a.execute').click(function(e) {
		e.preventDefault();

		$('iframe').attr(
			'src', 'preview.html?q=' + LZString.compressToEncodedURIComponent(
				($(this).parent().siblings('textarea.before').val() || '') +
				$(this).parent().siblings('.CodeMirror')
					.get(0).CodeMirror.getValue() +
				($(this).parent().siblings('textarea.after').val() || '')
			)
		);
	});

	$('a.qr').click(function(e) {
		e.preventDefault();

		open(
			kjua({
				fill: '#000',
				size: 0.3 * $(window).width(),
				text: window.location.href.split('/').slice(0, -1).concat(
					$('iframe').attr('src') + '&v'
				).join('/')
			}).src,
			'',
			'toolbar=no,location=no,status=no,menubar=no,' +
			'scrollbars=no,resizable=no, titlebar=no,' +
			'width=' + 0.3 * $(window).width() + ',' +
			'height=' + 0.3 * $(window).width()
		);
	});

	$('textarea[data-mode]').each(function() {
		CodeMirror.fromTextArea(this, {
			lineWrapping: true,
			indentWithTabs: true,
			smartIndent: false,
			autoRefresh: true
		});
	});

	$('a.execute').first().click();

	$('a.next').click(function(e) {
		e.preventDefault();

		$(this)
			.parents().eq(2).removeClass('active')
			.next().addClass('active').find('a.execute').click();
	});

	$('a.previous').click(function(e) {
		e.preventDefault();

		$(this)
			.parents().eq(2).removeClass('active')
			.prev().addClass('active').find('a.execute').click();
	});
});
