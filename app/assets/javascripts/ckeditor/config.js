CKEDITOR.editorConfig = function( config ) {
  config.extraPlugins += (config.extraPlugins.length == 0 ? '' : ',') + 'ckeditor_wiris,base64image,autogrow';
  config.removePlugins = 'resize,elementspath';
  config.allowedContent = true;

  config.autoParagraph = false;
  config.height = '50px';
  //config.width = '100%'; 

  // Toolbar
  config.toolbar = [
  	{name: 'document', items: ['Source']},
    {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
    {name: 'insert', items: ['base64image', 'Table', 'HorizontalRule', 'SpecialChar']},
    {name: 'equationeditor', items: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_CAS']}
  ];
  config.toolbarCanCollapse = true;
  config.toolbarStartupExpanded = false;

  config.autoGrow_onStartup = true;
  config.autoGrow_minHeight = 50;
  config.autoGrow_maxHeight = 1000;

  //font: Symbola

};