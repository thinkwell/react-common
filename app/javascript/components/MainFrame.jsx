import React, { useState, useCallback, useEffect, useContext } from 'react'
import {Frame, TopBar, Card, ActionList, Loading, Navigation} from '@shopify/polaris';
import {ProductsMajor, CustomersMajor, AffiliateMajor, ClockMajor, ReportsMajor} from '@shopify/polaris-icons';
import {SearchContext} from './contexts/Search'

export default function MainFrame(props) {
  const [searchValue, setSearchValue] = useContext(SearchContext);
  const [loading, setLoading] = useState(props.loading);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  useEffect(() => setLoading(props.loading), [props.loading])
  useEffect(() => navigateTo(props.href), [props.href])

  const navigateTo = (href) => {
    if (href) {
      setLoading(true)
      window.location.href = `/${href}`
    }
  };

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
    props.withoutSearch ? null : <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder={props.searchPlaceHolder || "Search"}
    />
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
    <div className={`${mobileNavigationActive ? 'mobile-nav-active' : 'mobile-nav-hidden'}`}>
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
