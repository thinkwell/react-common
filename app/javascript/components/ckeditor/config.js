export default {
  extraPlugins: 'ckeditor_wiris,base64image,autogrow,editorplaceholder',
  removePlugins: 'resize,elementspath',
  allowedContent: true,
  autoParagraph: false,
  height: '50px',
  // Toolbar
  toolbar: [
  	{name: 'document', items: ['Source']},
    {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
    {name: 'insert', items: ['base64image', 'Table', 'HorizontalRule', 'SpecialChar']},
    {name: 'equationeditor', items: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_CAS']}
  ],
  toolbarCanCollapse: true,
  toolbarStartupExpanded: false,
  autoGrow_onStartup: true,
  autoGrow_minHeight: 50,
  autoGrow_maxHeight: 1000
}
