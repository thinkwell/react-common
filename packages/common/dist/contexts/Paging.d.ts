import React from 'react';
type PagingContextType = [PagingInfoProps, boolean, boolean, (PageInfoProps: any) => void, (string: any) => void, (string: any) => void];
declare const PagingContext: React.Context<PagingContextType>;
declare const PagingProvider: (props: any) => JSX.Element;
export { PagingContext, PagingProvider };
export interface PagingInfoProps {
}
