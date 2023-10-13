import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useContext } from 'react';
import { DropZone, Banner, List, Thumbnail, Stack, Button } from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { FormContext } from '@thinkwell/react.common';
export default function ImageUpload(props) {
    const [acceptedFile, setAcceptedFile] = useState(props.value);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const hasError = rejectedFiles.length > 0;
    const form = useContext(FormContext);
    const clearAcceptedFile = () => {
        setAcceptedFile(null);
        form.onData(props.name)(null);
    };
    const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles, _rejectedFiles) => {
        setRejectedFiles(_rejectedFiles);
        var reader = new window.FileReader();
        var file = acceptedFiles[0];
        setAcceptedFile(file);
        reader.onload = function () {
            var base64data = reader.result;
            form.onData(`${props.name}_data`)(base64data);
        };
        reader.readAsDataURL(file);
    }, []);
    const uploadedFile = acceptedFile && (_jsxs(Stack, { children: [_jsx(Thumbnail, { size: "small", alt: acceptedFile.name, source: acceptedFile.url || window.URL.createObjectURL(acceptedFile) }), _jsxs("div", { children: [acceptedFile.name, ' ', acceptedFile.size ? _jsxs("p", { children: [acceptedFile.size, " bytes"] }) : null] }), _jsx("div", { children: _jsx(Button, { onClick: clearAcceptedFile, icon: CancelSmallMinor, children: "Clear" }) })] }));
    const errorMessage = hasError && (_jsx(Banner, { title: "The following images couldn\u2019t be uploaded:", status: "critical", children: _jsx(List, { type: "bullet", children: rejectedFiles.map((file, index) => (_jsx(List.Item, { children: `"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.` }, index))) }) }));
    return (_jsxs("div", { children: [errorMessage, _jsx(DropZone, { label: props.label || "Image", allowMultiple: false, onDrop: handleDropZoneDrop, variableHeight: true, accept: "image/*", type: "image", children: _jsx(DropZone.FileUpload, {}) }), uploadedFile] }));
}
