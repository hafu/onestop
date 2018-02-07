import {connect} from 'react-redux'
import FacetFilter from './FacetFilter'
import {toggleFacet} from '../../actions/SearchParamActions'
import {buildKeywordHierarchyMap} from '../../utils/keywordUtils'

import {
  clearCollections,
  triggerSearch,
} from '../../actions/SearchRequestActions'

const mapStateToProps = state => {
  return {
    facets: buildKeywordHierarchyMap(
      state.domain.results.facets,
      state.behavior.search.selectedFacets
    ),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleFacet: (category, facetName, selected) => {
      dispatch(toggleFacet(category, facetName, selected))
    },
    submit: () => {
      dispatch(clearCollections())
      dispatch(triggerSearch())
    },
  }
}

const FacetFilterContainer = connect(mapStateToProps, mapDispatchToProps)(
  FacetFilter
)

export default FacetFilterContainer
