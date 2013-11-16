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

			// Custom initial filter and column options
			var filter = []
			var column = []
			var aodata = []
			$(this).find('.filter:first').children().each(function(index, el) {
				// Do initial filtering
				var val = $(el).find('input, select').val();
				if (val)
				{
					filter.push({'sSearch': val});
				}
				else
				{
					filter.push(null);
				}

				// Column options
				var options = $(el).data('options');
				if (options) {
					column[index] = options;
				}
				else
				{
					column[index] = {};
				}

				// Special classes to disable search and sort
				if ($(el).hasClass('no-search')) {
					column[index].bSearchable = false;
				}

				if ($(el).hasClass('no-sort')) {
					column[index].bSortable = false;
				}
			});

			var dtInstance = $(this).dataTable({
				"oLanguage": {
					"sUrl": base_url + "translation/datatables.json"
				},
				"sPaginationType": "bs_full",
				"sDom": "<'panel-heading'<'pull-right'f><'pull-left'l><'pull-left'>r<'clearfix'>><'table-responsive't>p",
				"bProcessing": $(this).data('source') ? true : false,
				"bServerSide": $(this).data('source') ? true : false,
				"sAjaxSource": $(this).data('source'),
				"aoSearchCols": filter,
				"aoColumns": column,
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

			// Find filters
			var filters = dtInstance.find('.filter');

			// Filter mechanism on filter control change
			// Filter syn mechanism across the same inputs, selects
			// (Assuming that all filter elements are identical to the others)
			filters.each(function() {
				var oFilter = filters.not(this);
				// Do the filtering
				$(this).children().each(function(index, el) {
					$(el).find('input').on('keypress keyup paste change', function() {
						oFilter.children().eq(index).find('input').val($(this).val());
					}).change(function() {
						dtInstance.fnFilter($(this).val(), index);
					});

					$(el).find('select').on('change', function() {
						oFilter.children().eq(index).find('select').val($(this).val()).selectpicker('refresh');
					}).change(function() {
						dtInstance.fnFilter($(this).val(), index);
					});
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