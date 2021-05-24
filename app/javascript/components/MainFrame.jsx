import React, { useState, useEffect as useEffectReact, useCallback, useContext } from 'react'
import {Frame, TopBar, Card, ActionList, Loading, Navigation} from '@shopify/polaris';
import {ProductsMajor, CustomersMajor, AffiliateMajor, ClockMajor, ReportsMajor} from '@shopify/polaris-icons';
import {SearchContext} from './contexts/Search'
import {PagingContext} from './contexts/Paging'
import Util from './Util'
import useEffect from './hooks/useEffect'

export default function MainFrame(props) {
  const [searchValue, setSearchValue] = useContext(SearchContext);
  const [page_info, previous_page_info, next_page_info, setPageInfo] = useContext(PagingContext);
  const [loading, setLoading] = useState(props.loading);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  useEffect(() => { setLoading(props.loading) }, [props.loading])

  const navigateTo = (href, opts) => {
    if (href) {
      let path = `/${href}`;
      const state = Util.getParam(window.location.href, 'state')
      if (opts && opts.withContext == 'url') {
        const page_info = Util.getParam(window.location.href, 'page_info')
        if (page_info) {
          path = Util.setParam(path, 'page_info', page_info)
        }
        const query = Util.getParam(window.location.href, 'query')
        if (query) {
          path = Util.setParam(path, 'query', query)
        }
      } else if (opts && opts.withContext) {
        if (page_info) {
          path = Util.setParam(path, 'page_info', page_info)
        }
        if (searchValue) {
          path = Util.setParam(path, 'query', searchValue)
        }
      }
      window.location.assign(path)
    }
  };

  if (props.navigateToRef) {
    props.navigateToRef.current = navigateTo
  }

  const handleSearchFieldChange = useCallback((value) => {
    setPageInfo('');
    setSearchValue(value);
    props.onSearchChange && props.onSearchChange(value)
  }, []);

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  const searchFieldMarkup = (
    props.withoutSearch ? null : <div onKeyDown={props.onSearchKeyPress}><TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder={props.searchPlaceHolder || "Search"}
    /></div>
  );

  const topBarMarkup = (<TopBar
    showNavigationToggle
    userMenu={props.userMenu}
    searchResultsVisible={props.searchResultsVisible}
    searchField={searchFieldMarkup}
    searchResults={props.searchResults}
    onSearchResultsDismiss={props.onSearchResultsDismiss}
    onNavigationToggle={toggleMobileNavigationActive}
  />)

  return (
    <div className={`${mobileNavigationActive ? 'mobile-nav-active' : 'mobile-nav-hidden'}`} data-href={props.href}>
      <Frame
        topBar={topBarMarkup}
        navigation={props.navigation}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
      >
        {loading ? <Loading /> : null}
        {props.children}
      </Frame>
    </div>
  );
}
