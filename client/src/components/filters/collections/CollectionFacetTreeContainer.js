import {connect} from 'react-redux'
import FacetTree from '../facet/FacetTree'

import {withRouter} from 'react-router'

const mapStateToProps = state => {
  return {
    loading: state.search.loading,
  }
}

const CollectionFacetTreeContainer = withRouter(
  connect(mapStateToProps)(FacetTree)
)

export default CollectionFacetTreeContainer
