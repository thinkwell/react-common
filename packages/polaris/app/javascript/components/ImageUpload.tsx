import React, { useState, useCallback, useContext } from 'react';
import {DropZone, Banner, List, Thumbnail, LegacyStack, Button} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons'
import {FormContext} from '@thinkwell/react.common';

type FileProps = (Blob | MediaSource) & {
  name: string,
  url: string,
  size: string
}

type Props = {
  name: string | string[],
  label: string,
  value?: FileProps
}

export default function ImageUpload(props:Props) {
  const [acceptedFile, setAcceptedFile] = useState(props.value);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const hasError = rejectedFiles.length > 0;
  const form = useContext(FormContext)

  const clearAcceptedFile = () => {
    setAcceptedFile(null)
    form.onData(props.name)(null)
  }

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setRejectedFiles(_rejectedFiles);
      var reader = new window.FileReader()
      var file = acceptedFiles[0]
      setAcceptedFile(file);
      reader.onload = function () {
        var base64data = reader.result
        form.onData(`${props.name}_data`)(base64data)
      }
      reader.readAsDataURL(file)
    },
    [],
  );

  const uploadedFile = acceptedFile && (
    <LegacyStack>
      <Thumbnail
        size="small"
        alt={acceptedFile.name}
        source={acceptedFile.url || window.URL.createObjectURL(acceptedFile)}
      />
      <div>
        {acceptedFile.name}{' '}
        {acceptedFile.size ? <p>{acceptedFile.size} bytes</p> : null }
      </div>
      <div>
        <Button onClick={clearAcceptedFile} icon={CancelSmallMinor}>Clear</Button>
      </div>
    </LegacyStack>
  );

  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <div>
      {errorMessage}
      <DropZone
        label={props.label || "Image"}
        allowMultiple={false}
        onDrop={handleDropZoneDrop}
        variableHeight={true}
        accept="image/*"
        type="image"
      >
        <DropZone.FileUpload />
      </DropZone>
      {uploadedFile}
    </div>
  )

}
