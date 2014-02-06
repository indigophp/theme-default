/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// CKEDITOR.plugins.add( 'bootstrap',
// {   
//    requires : ['richcombo'],
//    init : function( editor )
//    {
//       var config = editor.config,
//          lang = editor.lang.format;

//       var tags = [];
//       tags[0]=["{{ bootstrap:alert style=%27info%27 }} My Content {{ /bootstrap:alert }}", "Alert", "Alert"];
//       tags[1]=["{{ bootstrap:align position=%27left%27 }} My Content {{ /bootstrap:align }}", "Align", "Align"];
//       tags[2]=["{{ bootstrap:badge style=%27%27 }} My Content {{ /bootstrap:badge }}", "Badge", "Badge"];
//       tags[3]=["{{ bootstrap:carousel slug=%27Gallery Slug%27 }}", "Carousel", "Carousel"];
//       tags[4]=["{{ bootstrap:collapse title=%27My Title%27 }} My Content  {{ /bootstrap:collapse }}", "Collapse", "Collapse"];
//       tags[5]=["{{ bootstrap:emphasis style=%27%27 }} My Content  {{ /bootstrap:emphasis }}", "Emphasis", "Emphasis"];
//       tags[6]=["{{ bootstrap:hero }} My Content  {{ /bootstrap:hero }}", "Hero", "Hero"];
//       tags[7]=["{{ bootstrap:label style=%27%27 }} My Content {{ /bootstrap:label }}", "Label", "Label"];
//       tags[8]=["{{ bootstrap:lead }} My Content  {{ /bootstrap:lead }}", "Lead", "Lead"];
//       tags[9]=["{{ bootstrap:row }} {{ bootstrap:span size=%27%27 }} My Content  {{ /bootstrap:span }} {{ /bootstrap:row }}", "Row - Span", "Row - Span"];
//       tags[10]=["{{ bootstrap:tabheaderwrap }}<p>{{ bootstrap:tabheader title=%27Tab One%27 active=%27true%27 }}</p><p>{{ bootstrap:tabheader title=%27Tab Two%27 }}</p><p>{{ /bootstrap:tabheaderwrap }}</p><p>{{ bootstrap:tabcontentwrap }}</p><p>{{ bootstrap:tabcontent title=%27Tab One%27 active=%27true%27 }}Tab one contents goes here{{ /bootstrap:tabcontent }}</p><p>{{ bootstrap:tabcontent title=%27Tab Two%27 }} Tab two contents goes here{{ /bootstrap:tabcontent }}</p><p>{{ /bootstrap:tabcontentwrap }}</p>", "Tabs", "Tabs"];
//       tags[11]=["{{ bootstrap:well }} My Content  {{ /bootstrap:well }}", "Well", "Well"];

//       editor.ui.addRichCombo( 'bootstrap',
//          {
//             label : "Bootstrap",
//             title :"Bootstrap",
//             voiceLabel : "Bootstrap",
//             className : 'cke_format',
//             multiSelect : false,

//             panel :
//             {
//                css : [ config.contentsCss, CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ],
//                voiceLabel : lang.panelVoiceLabel
//             },

//             init : function()
//             {
//                this.startGroup( "Bootstrap" );
//                for (var this_tag in tags){
//                   this.add(tags[this_tag][0], tags[this_tag][1], tags[this_tag][2]);
//                }
//             },

//             onClick : function( value )
//             {         
//                editor.focus();
//                editor.fire( 'saveSnapshot' );
//                editor.insertHtml(unescape(value));
//                editor.fire( 'saveSnapshot' );
//             }
//          });
//    }
// });


CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	config.removeDialogTabs = 'image:advanced;link:advanced';

	config.contentsCss = CKEDITOR.basePath + '../../css/bootstrap.min.css';
};
