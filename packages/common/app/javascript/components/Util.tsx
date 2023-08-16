const setParam = (uri, key, value) => {
  const re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    let hash =  '';
    if( uri.indexOf('#') !== -1 ){
        hash = uri.replace(/.*#/, '#');
        uri = uri.replace(/#.*/, '');
    }
    const separator = uri.indexOf('?') !== -1 ? "&" : "?";
    return uri + separator + key + "=" + value + hash;
  }
}

import flattenDeep from 'lodash/flattenDeep'
import compact from 'lodash/compact'

export default {
  hideLoader: (selector?: string) => {
    selector = selector || ''
    const loader = document.querySelector(`.thinkwell-content${selector} .loader`)
    if (loader) {
      loader.classList.remove('loader');
    }
  },
  getParam: (uri, key) => {
    const results = new RegExp('[\?&]' + key + '=([^&#]*)').exec(uri);
    return results !== null && results[1] || false;
  },
  setParam: setParam,
  redirect: (result) => {
    let url = result.location || result.redirect_url;
    if(result.message) {
      url = setParam(url, 'message', encodeURIComponent(result.message));
    }
    console.log(`redirecting to ${url}`)
    window.location.replace(url);
  },
  flattenDeep: (objects) => {
    const nodes = []
    function traverse(o) {
        for (var i in o) {
            if (o[i] !== null && typeof(o[i])=="object") {
                //going one step down in the object tree!!
                traverse(o[i]);
            } else {
              nodes.push(o[i])
            }
        }
    }
    traverse(objects)
    return compact(flattenDeep(nodes))
  }
}
