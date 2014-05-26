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
			var aoSearchCols = [];
			var aoColumns = [];
			var controls = [];
			$(this).find('.filter:first').children('[data-filter]').each(function(index, el) {
				var control = $(el).data('control') ? $(el).data('control') : undefined;
				var filter = $(el).data('filter');
				var val;

				switch(filter) {
					case 'text':
					case 'number':
					case 'date':
						if(control === undefined) {
							control = 'input:first';
						}
						break;
					case 'select':
						if(control === undefined) {
							control = 'select:first';
						}
						break;
					case 'none':
					case false:
					case '':
					case 'null':
					case null:
					case undefined:
						var val = false;
						control = false;
						filter = 'none';
						break;
					case 'range':
						if(control === undefined) {
							control = 'input:nth-child(1), input:nth-child(2)';
						}

						val = [];

						$(el).find(control).each(function(index, el) {
							val[index] = $(el).val();
						});
						break;
				}

				if (val === undefined) {
					val = $(el).find(control).val();
				}

				controls[index] = {
					'control': control,
					'filter': filter
				};

				// Column options
				aoColumns[index] = {
					'bSearchable': ! $(el).hasClass('no-search'),
					'bSortable': ! $(el).hasClass('no-sort'),
					'sFilter': $(el).data('filter')
				};

				aoSearchCols[index] = val ? {'sSearch': JSON.stringify(val)} : null;

				$.extend(aoColumns[index], $(el).data('options'));
			});

			// Is this a table? If not find the first table
			if ($(this).is('table')) {
				var table = this;
			} else {
				var table = $(this).find('table:first').get();
			}

			var dtInstance = $(table).dataTable({
				"oLanguage": {
					"sUrl": base_url + "translation/datatables.json"
				},
				"sPaginationType": "bs_full",
				"sDom": "<'panel-heading'<'pull-right'f><'pull-left'l><'pull-left'>r<'clearfix'>><'table-responsive't>p",
				"bProcessing": $(this).data('source') ? true : false,
				"bServerSide": $(this).data('source') ? true : false,
				"sAjaxSource": $(this).data('source'),
				"aoSearchCols": aoSearchCols,
				"aoColumns": aoColumns.length > 0 ? aoColumns : null,
				"aaSorting": $(this).data('sorting') ? $(this).data('sorting') : [],
				"fnInitComplete": function(oSettings, json) {
					var datatable = this;
					// SEARCH - Add the placeholder for Search and Turn this into in-line form control
					var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
					search_input.attr('placeholder', (oSettings && oSettings.oLanguage && oSettings.oLanguage.sSearchPlaceholder) ? oSettings.oLanguage.sSearchPlaceholder : 'Search all fields');
					search_input.addClass('form-control input-sm');
					// LENGTH - Inline-Form control
					var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
					// length_sel.addClass('form-control input-sm');
					length_sel.selectpicker({
						"width": "auto"
					}).selectpicker('setStyle', 'btn-sm', 'add');
				},
				"fnServerData": function(sSource, aoData, fnCallback, oSettings) {
					$.each($(this).data(), function(index, val) {
						aoData.push({'name': index, 'value': val});
					});

					$.each(oSettings.aoColumns, function(index, val) {
						aoData.push({'name': 'sFilter_'+index, 'value': val.sFilter});
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
			// (Assuming that all filter groups are identical to the others)
			$.each(controls, function(index, el) {
				if (el.filter !== 'none') {
					var c = filters.children('[data-filter]:nth-child(' + (index+1) + ')').find(el.control);

					// Do the filtering
					switch(el.filter) {
						case 'text':
						case 'number':
						case 'date':
							c.change(function() {
								dtInstance.fnFilter(JSON.stringify($(this).val()), index);
							}).on('reset', function() {
								$(this).val('');
							}).on('keypress keyup paste change', function(event) {
								c.val($(this).val());
							});;
							break;
						case 'select':
							c.on('change', function() {
								dtInstance.fnFilter(JSON.stringify($(this).val()), index);
								c.val($(this).val()).selectpicker('refresh');
							}).on('reset', function() {
								$(this).val([]).selectpicker('refresh');
							});
							break;
						case 'range':
							var odd = c.filter(':odd');
							var even = c.filter(':even');

							odd.change(function(event) {
								var val = [
									even.eq($(this).index()).val(),
									$(this).val()
								];
								dtInstance.fnFilter(JSON.stringify(val), index);
							}).on('keypress keyup paste change', function(event) {
								odd.val($(this).val());
							});

							even.change(function(event) {
								var val = [
									$(this).val(),
									odd.eq($(this).index()).val()
								];
								dtInstance.fnFilter(JSON.stringify(val), index);
							}).on('keypress keyup paste change', function(event) {
								even.val($(this).val());
							});

							c.on('reset', function() {
								$(this).val('');
							});
							break;
					}

					$(filters).find('[type=reset]').click(function() {
						c.trigger('reset');
					});
				}
			});

			// Filter and sorting reset mechanism (reset table)
			$(this).find('[type=reset]').click(function() {
				dtInstance.fnFilterClear();
				// dtInstance.fnSortNeutral();
			});
		}); // end .datatables each

		$('.datetime').each(function() {
			$(this).datetimepicker({
				'language' : 'hu-HU',
				icons: {
					time: "fa fa-clock-o",
					date: "fa fa-calendar",
					up: "fa fa-arrow-up",
					down: "fa fa-arrow-down"
				}
			});
		});

		$('.date').each(function() {
			$(this).datetimepicker({
				pickTime: false,
				'language' : 'hu-HU',
				icons: {
					date: "fa fa-calendar",
					up: "fa fa-arrow-up",
					down: "fa fa-arrow-down"
				}
			});
		});

		$('.ckedit').each(function() {
			$(this).ckeditor({
				'language' : 'hu-HU',
			});
			CKEDITOR.on('instanceReady', function(event) {
				$('.cke_toolgroup:has(.cke_button__find, .cke_button__qrc, .cke_button__about), .cke_button__anchor, .cke_button__mathjax, .cke_button__cut, .cke_button__paste, .cke_button__copy, .cke_button__pastetext, .cke_button__pastefromword, .cke_button__pastefromword + .cke_toolbar_separator, .cke_button__table, .cke_button__horizontalrule, .cke_button__specialchar').addClass('hidden-xs');
			});
		});

		$('.selectpicker').each(function() {
			$(this).selectpicker();
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
		icon = (typeof icon !== 'undefined' && icon !== null && icon !== '') ? '<span class="' + icon + '"></span>' : '';
		title = (typeof title !== 'undefined' && title !== null && title !== '') ? title : '';
		if (title + icon == '') {
			console.error('You must supply at least one of title and icon.');
			return;
		}

		if (typeof callback == "string") {
			var elementHtml = '<li><a href="' + callback + '">' + icon + ((title != '' && icon != '') ? ' &nbsp; ' : '' ) + title + '</a></li>';
			var element = $(elementHtml);
		} else {
			var elementHtml = '<li><a href="#">' + icon + ((title != '' && icon != '') ? ' &nbsp; ' : '' ) + title + '</a></li>';
			var element = $(elementHtml);
			element.find('a').click(function() { callback(); return false; });
		}

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
