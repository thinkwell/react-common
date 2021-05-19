export default function ConvertAttributes( type, opts ) {
  return (editor) => {
    // Allow type elements in the model.
    editor.model.schema.register( type, opts);

    // Allow type elements in the model to have all attributes.
    editor.model.schema.addAttributeCheck( context => {
        if ( context.endsWith( type ) ) {
            return true;
        }
    } );

    // The view-to-model converter converting a view type with all its attributes to the model.
    editor.conversion.for( 'upcast' ).elementToElement( {
        view: type,
        model: ( viewElement, { writer: modelWriter } ) => {
            return modelWriter.createElement( type, viewElement.getAttributes() );
        }
    } );

    // The model-to-view converter for the type element (attributes are converted separately).
    editor.conversion.for( 'downcast' ).elementToElement( {
        model: type,
        view: type
    } );

    // The model-to-view converter for type attributes.
    // Note that a lower-level, event-based API is used here.
    editor.conversion.for( 'downcast' ).add( dispatcher => {
        dispatcher.on( 'attribute', ( evt, data, conversionApi ) => {
            // Convert type attributes only.
            if ( data.item.name != type ) {
                return;
            }

            const viewWriter = conversionApi.writer;
            const viewDiv = conversionApi.mapper.toViewElement( data.item );

            // In the model-to-view conversion we convert changes.
            // An attribute can be added or removed or changed.
            // The below code handles all 3 cases.
            if ( data.attributeNewValue ) {
                viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, viewDiv );
            } else {
                viewWriter.removeAttribute( data.attributeKey, viewDiv );
            }
        } );
    } );
  }
}
