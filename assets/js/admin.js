var IndigoAdmin = (function() {
	'use strict';

	// var console = console ? console : {
	// 	log: function() {}
	// };
	try {
		var Unity = external.getUnityObject(1.0);
	} catch(e) {}

	function pageInit (base_url) {

		console.log('Incorrectly inline styled elements: ', $('[style]:not(.menu-gravatar)'));

		$('.datatables').each(function() {
			var dtInstance = $(this).dataTable({
				"oLanguage": {
					"sUrl": base_url + "translation/datatables.json"
				},
				"sPaginationType": "bs_full",
				"sDom": "<'panel-heading'<'pull-right'f><'pull-left'l><'pull-left'>r<'clearfix'>><'table-responsive't>p",
				"bProcessing": $(this).data('source') ? true : false,
				"bServerSide": $(this).data('source') ? true : false,
				"sAjaxSource": $(this).data('source'),
				"fnInitComplete": function(oSettings, json) {
					var datatable = this;
					// SEARCH - Add the placeholder for Search and Turn this into in-line form control
					var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
					search_input.attr('placeholder', (oSettings && oSettings.oLanguage && oSettings.oLanguage.sSearchPlaceholder) ? oSettings.oLanguage.sSearchPlaceholder : 'Search all fields');
					search_input.addClass('form-control input-sm');
					// LENGTH - Inline-Form control
					var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
					// length_sel.addClass('form-control input-sm');
					length_sel.selectpicker().selectpicker('setStyle', 'btn-sm', 'add');
				},
				"fnServerData": function(sSource, aoData, fnCallback) {
					$.each($(this).data(), function(index, val) {
						aoData.push({'name': index, 'value': val});
					});

					$.ajax( {
						"dataType": 'json',
						"type": "POST",
						"url": sSource,
						"data": aoData,
						"success": function(response, result, xhr) {
							console.log(result);
							fnCallback(response, result, xhr);
						},
						"timeout": 15000,
						"error": function(param) {
							console.log(param);
						}
					} );
				},
			});

			// All select filters should be selectpickers
			dtInstance.find('.filter select').selectpicker();

			// Filter mechanism on filter control change
			dtInstance.find('.filter').each(function() {
				var inputs = $(this).find('input, select');
				inputs.change(function() {
					if ($(this).is('select'))
					{
						dtInstance.fnFilter($(this).val(), inputs.index(this));
					}
					else
					{
						dtInstance.fnFilter(this.value, inputs.index(this));
					}
				});
			});

			// Filter reset mechanism
			dtInstance.find('.filter [type=reset]').click(function() {
				dtInstance.find('.filter select').each(function() {
					$(this).val([]).selectpicker('render');
				});

				dtInstance.find('.filter input').each(function() {
					$(this).val('');
				});

				dtInstance.fnFilterClear();
			});

			// Initial filter values
			// Generates a 'TypeError: c is undefined' which means that by the time of init filtering
			// the DOM of table is not ready yet
			// Ugly solution: save original state of bProcessing, de the initial filtering
			// and restore bProcessing original value
			dtInstance.find('.filter').each(function() {
				var bProcessing = dtInstance.fnSettings().oFeatures.bProcessing;
				dtInstance.fnSettings().oFeatures.bProcessing = false;
				var inputs = $(this).find('input, select');
				inputs.each(function(index, el) {
					if ($(el).val())
					{
						dtInstance.fnFilter($(el).val(), index);
					}
				});
				dtInstance.fnSettings().oFeatures.bProcessing = bProcessing;
			});
		});

		try {
			Unity.init({
				name: "Indigo Admin",
				iconUrl: "https://secure.gravatar.com/avatar/7f3930c2e3af0d6dcb0115e194111898?s=256&d=mm",
				onInit: setUpUnityIntegration
			});
		} catch(e) {}

		console.log('IndigoAdmin pageInit() completed.');
	}

	function exposeMenu(prefix, menu) {
		menu.find(' > li').each(function() {
			var anchor = $(this).find('> a');
			var button = $(this).find('> button');
			if (anchor.length) {
				Unity.addAction(prefix + '/' + $.trim(anchor.text()), function() { anchor[0].click(); });
			} else {
				exposeMenu(prefix + '/' + $.trim(button.text()), $(this).find(' > ul'));
			}
		});
	}

	function setUpUnityIntegration() { // private
		exposeMenu('', $('.side-navigation .primary'));
		$(this).trigger('unityready');
	}

	function setMenuLabel(menuItemId, text, type) {
		type = (typeof type !== 'undefined') ? type : 'primary';
		$('#menu-item-' + menuItemId + ' > .label')
			.removeClass('label-danger')
			.removeClass('label-info')
			.removeClass('label-warning')
			.removeClass('label-default')
			.removeClass('label-primary')
			.addClass('label-' + type)
			.html(text);
	}

	function addFastButton (title, icon, callback) {
		icon = (typeof icon !== 'undefined' && icon !== null && icon !== '') ? '<span class="glyphicon glyphicon-' + icon + '"></span>' : '';
		title = (typeof title !== 'undefined' && title !== null && title !== '') ? title : '';
		if (title + icon == '') {
			console.error('You must supply at least one of title and icon.');
			return;
		}
		var elementHtml = '<li><a href="#">' + icon + ((title != '' && icon != '') ? ' &nbsp; ' : '' ) + title + '</a></li>';
		var element = $(elementHtml);
		element.find('a').click(function() { callback(); return false; });
		element.prependTo('html body div.navbar div.hidden-xs ul.nav');
	}

	function addProxyButton (title, icon, selector) {
		addFastButton(title, icon, function() {
			$(selector)[0].click();
		});
	}

	function displayNotification (title, body, icon) {
		Unity.Notification.showNotification(title, body, icon);
	}

	return {
		pageInit:            pageInit,
		setMenuLabel:        setMenuLabel,
		addFastButton:       addFastButton,
		addProxyButton:      addProxyButton,
		displayNotification: displayNotification
	};

}());