import React, { useState, useEffect as useEffectReact, useCallback, useContext } from 'react'
import {Frame, TopBar, Card, ActionList, Loading, Navigation} from '@shopify/polaris';
import {ProductsMajor, CustomersMajor, AffiliateMajor, ClockMajor, ReportsMajor} from '@shopify/polaris-icons';
import {SearchContext} from './contexts/Search'
import useEffect from './hooks/useEffect'

export default function MainFrame(props) {
  const [searchValue, setSearchValue] = useContext(SearchContext);
  const [loading, setLoading] = useState(props.loading);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  useEffect(() => { setLoading(props.loading) }, [props.loading])

  const navigateTo = (href) => {
    if (href) {
      window.location.assign(`/${href}`)
    }
  };

  if (props.navigateToRef) {
    props.navigateToRef.current = navigateTo
  }

  const handleSearchFieldChange = useCallback((value) => {
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
