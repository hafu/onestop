import {connect} from 'react-redux'
import FeaturedDatasets from './FeaturedDatasets'
import {
  collectionClearFacets,
  collectionUpdateQueryText,
} from '../../actions/search/CollectionFilterActions'
import {
  triggerSearch,
  showCollections,
} from '../../actions/search/SearchActions'

import {withRouter} from 'react-router'

const mapStateToProps = state => {
  return {
    featured: state.config.featured,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submit: () => {
      dispatch(collectionClearFacets())
      dispatch(triggerSearch())
      dispatch(showCollections(ownProps.history))
    },
    collectionUpdateQueryText: text =>
      dispatch(collectionUpdateQueryText(text)),
  }
}

const FeaturedDatasetsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FeaturedDatasets)
)

export default FeaturedDatasetsContainer
