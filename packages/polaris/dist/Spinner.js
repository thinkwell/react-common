import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner as SpinnerPolaris } from '@shopify/polaris';
export default function Spinner(props) {
    const size = props.size || "small";
    return (_jsxs("span", { className: `spinner spinner-${size} ${!props.children ? 'no-content' : ''}`, children: [_jsx("span", { className: `${props.active ? 'active' : ''}`, children: props.children }), props.active ? _jsx("span", { className: "image", title: "spinner", children: _jsx(SpinnerPolaris, { size: size }) }) : null] }));
}
