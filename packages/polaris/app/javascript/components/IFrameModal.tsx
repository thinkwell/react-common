import React, { useState, useContext } from 'react';
import { Modal, Link } from '@shopify/polaris'
import Spinner from './Spinner'
import Iframe from 'react-iframe'
import { isSafari } from 'react-device-detect';

type Props = {
  url: string,
  linkTitle: string,
  title: string,
  large: boolean
}

export default function IFrameModal(props:Props) {
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = () => { setLoading(true); setActive(!active) }

  // shopper#677 : open in new tab on safari
  const activator = <Link external={isSafari} url={isSafari ? props.url : null} onClick={!isSafari ? handleChange : null}>{props.linkTitle}</Link>;

  return (<div>
    <Modal
      title={props.title || props.linkTitle}
      activator={activator}
      open={active}
      onClose={handleChange}
      large={props.large}
      secondaryActions={[{
        content: 'Close',
        onAction: handleChange
      }]}
    >
    <Modal.Section>
      <div className={`iframe-view-modal`} >
      { loading ? <div className="loader" /> : <div /> }
      <Iframe
      url={props.url}
      width="100%"
      height="100%"
      onLoad={() => setLoading(false)}
      />
      </div>
    </Modal.Section>
  </Modal>
  </div>)
}
