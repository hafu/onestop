import fetch from 'isomorphic-fetch'

export const INDEX_CHANGE = 'index_change'
export const DATE_SEARCH = 'search'
export const DATE_SEARCH_COMPLETE = 'search_complete'

export const startSearch = (searchText) => {
  return {
    type: DATE_SEARCH,
    searchText
  }
}

export const completeSearch = (searchText, items) => {
  return {
    type: DATE_SEARCH_COMPLETE,
    searchText,
    items
  }
}

export const temporalSearch = (searchText) => {
  return (dispatch, getState) => {
    // if a search is already in flight, let the calling code know there's nothing to wait for
    if (getState().getIn(['search', 'inFlight']) === true) {
      return Promise.resolve()
    }

    dispatch(startSearch(searchText))

    const index = getState().getIn(['search', 'index'])
    const apiRoot = "/api/search"
    const fetchParams = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        queries: [
          {type: 'datetime', value: searchText}
        ]
      })
    }

    return fetch(apiRoot, fetchParams)
            .then(response => response.json())
  .then(json => dispatch(completeSearch(searchText, assignResourcesToMap(json.data))))
  }
}

const assignResourcesToMap = (resourceList) => {
  var map = new Map()
  resourceList.forEach(resource => {
    map.set(resource.id, Object.assign({type: resource.type}, resource.attributes))
})
  return map
}

export const indexChange = (indexText) => {
  return {
    type: INDEX_CHANGE,
    indexText
  }
}
