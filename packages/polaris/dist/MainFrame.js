import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useContext } from 'react';
import { Frame, TopBar, Loading } from '@shopify/polaris';
import { SearchContext, PagingContext, Util, useEffect } from '@thinkwell/react.common';
export default function MainFrame(props) {
    const [searchValue, setSearchValue] = useContext(SearchContext);
    const [page_info, previous_page_info, next_page_info, setPageInfo] = useContext(PagingContext);
    const [loading, setLoading] = useState(props.loading);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    useEffect(() => { setLoading(props.loading); }, [props.loading]);
    const navigateTo = (href, opts) => {
        if (href) {
            let path = `/${href}`;
            const state = Util.getParam(window.location.href, 'state');
            if (opts && opts.withContext == 'url') {
                const page_info = Util.getParam(window.location.href, 'page_info');
                if (page_info) {
                    path = Util.setParam(path, 'page_info', page_info);
                }
                const query = Util.getParam(window.location.href, 'query');
                if (query) {
                    path = Util.setParam(path, 'query', query);
                }
            }
            else if (opts && opts.withContext) {
                if (page_info) {
                    path = Util.setParam(path, 'page_info', page_info);
                }
                if (searchValue) {
                    path = Util.setParam(path, 'query', encodeURIComponent(searchValue));
                }
            }
            if (props.navigate) {
                props.navigate(path);
                setMobileNavigationActive(false);
            }
            else {
                window.location.assign(path);
            }
        }
    };
    if (props.navigateToRef) {
        props.navigateToRef.current = navigateTo;
    }
    const handleSearchFieldChange = useCallback((value) => {
        setPageInfo('');
        setSearchValue(value);
        props.onSearchChange && props.onSearchChange(value);
    }, []);
    const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);
    const searchFieldMarkup = (props.withoutSearch ? null : _jsx("div", { onKeyDown: props.onSearchKeyPress, children: _jsx(TopBar.SearchField, { onChange: handleSearchFieldChange, value: decodeURIComponent(searchValue), placeholder: props.searchPlaceHolder || "Search" }) }));
    const topBarMarkup = (_jsx(TopBar, { showNavigationToggle: props.showNavigationToggle, userMenu: props.userMenu, searchResultsVisible: props.searchResultsVisible, searchField: searchFieldMarkup, searchResults: props.searchResults, onSearchResultsDismiss: props.onSearchResultsDismiss, onNavigationToggle: toggleMobileNavigationActive }));
    return (_jsx("div", { className: `${mobileNavigationActive ? 'mobile-nav-active' : 'mobile-nav-hidden'}`, "data-href": props.href, children: _jsxs(Frame, { topBar: topBarMarkup, navigation: props.navigation, showMobileNavigation: mobileNavigationActive, onNavigationDismiss: toggleMobileNavigationActive, children: [loading ? _jsx(Loading, {}) : null, props.children] }) }));
}
