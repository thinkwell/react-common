import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useContext } from 'react';
import { Modal, Link } from '@shopify/polaris';
import Spinner from './Spinner';
import Iframe from 'react-iframe';
import { isSafari } from 'react-device-detect';
export default function IFrameModal(props) {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleChange = () => { setLoading(true); setActive(!active); };
    // shopper#677 : open in new tab on safari
    const activator = _jsx(Link, { external: isSafari, url: isSafari ? props.url : null, onClick: !isSafari ? handleChange : null, children: props.linkTitle });
    return (_jsx("div", { children: _jsx(Modal, { title: props.title || props.linkTitle, activator: activator, open: active, onClose: handleChange, large: props.large, secondaryActions: [{
                    content: 'Close',
                    onAction: handleChange
                }], children: _jsx(Modal.Section, { children: _jsxs("div", { className: `iframe-view-modal`, children: [loading ? _jsx("div", { className: "loader" }) : _jsx("div", {}), _jsx(Iframe, { url: props.url, width: "100%", height: "100%", onLoad: () => setLoading(false) })] }) }) }) }));
}
