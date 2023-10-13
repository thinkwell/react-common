import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Table(props) {
    return (_jsx("table", { children: _jsx("tbody", { children: props.rows.map((row, index) => {
                const value = row.valueLabel || row.value;
                return !!row.value ? _jsxs("tr", { children: [_jsx("th", { style: { textAlign: "left", verticalAlign: "top", padding: "5px" }, children: row.label }), _jsx("td", { style: { textAlign: "left", verticalAlign: "top", padding: "5px", whiteSpace: "pre-wrap" }, children: row.image ? _jsx("img", { src: value }) : value })] }, `${row.label}_${index}`) : null;
            }) }) }));
}
