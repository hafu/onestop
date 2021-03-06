import React from 'react'
import PropTypes from 'prop-types'
import GranuleListLegend from './GranuleListLegend'
import Button from '../../common/input/Button'
import ListView from '../../common/ui/ListView'
import GranuleListResultContainer from './GranuleListResultContainer'
import {identifyProtocol} from '../../../utils/resultUtils'
import {boxShadow} from '../../../style/defaultStyles'
import Meta from '../../helmet/Meta'

const styleCenterContent = {
  display: 'flex',
  justifyContent: 'center',
}

const styleGranuleListWrapper = {
  maxWidth: '80em',
  width: '80em',
  boxShadow: boxShadow,
  marginRight: '3px',
  marginLeft: '1px',
  backgroundColor: 'white',
  color: '#222',
}

const styleShowMore = {
  margin: '1em auto 1.618em auto',
}
const styleShowMoreFocus = {
  outline: '2px dashed #5C87AC',
  outlineOffset: '.118em',
}

export default class GranuleList extends React.Component {
  isGranuleSelected = itemId => {
    const {selectedGranules} = this.props
    const checkIt = Object.keys(selectedGranules).includes(itemId)
    return checkIt
  }

  handleCheckboxChange = (itemId, item) => {
    const {selectGranule, deselectGranule} = this.props
    return checkbox => {
      if (checkbox.checked) {
        selectGranule(item, itemId)
      }
      else {
        deselectGranule(itemId)
      }
    }
  }

  handleSelectAll = () => {
    const {results, selectVisibleGranules} = this.props
  }

  propsForResult = (item, itemId) => {
    const {featuresEnabled} = this.props

    return {
      showLinks: true,
      showTimeAndSpace: true,
      handleCheckboxChange: this.handleCheckboxChange,
      checkGranule: this.isGranuleSelected(itemId),
      featuresEnabled: featuresEnabled,
    }
  }

  render() {
    const {
      loading,
      results,
      returnedHits,
      totalHits,
      selectCollection,
      fetchMoreResults,
      collectionTitle,
    } = this.props

    // keep track of used protocols in results to avoid unnecessary legend keys
    const usedProtocols = new Set()
    _.forEach(results, value => {
      //

      _.forEach(value.links, link => {
        // if(link.linkFunction.toLowerCase() === 'download' || link.linkFunction.toLowerCase() === 'fileaccess') {
        return usedProtocols.add(identifyProtocol(link))
        // }
      })
    })

    const showMoreButton =
      returnedHits < totalHits ? (
        <Button
          text="Show More Results"
          onClick={() => fetchMoreResults()}
          style={styleShowMore}
          styleFocus={styleShowMoreFocus}
        />
      ) : null

    return (
      <div style={styleCenterContent}>
        <Meta
          title={`Files for Collection ${collectionTitle}`}
          formatTitle={true}
          robots="noindex"
        />

        <div style={styleGranuleListWrapper}>
          <GranuleListLegend usedProtocols={usedProtocols} />
          <ListView
            items={results}
            loading={!!loading}
            resultsMessage={'Collection Files'}
            shown={returnedHits}
            total={totalHits}
            onItemSelect={selectCollection}
            ListItemComponent={GranuleListResultContainer}
            GridItemComponent={null}
            propsForItem={this.propsForResult}
          />
          {showMoreButton}
        </div>
      </div>
    )
  }
}

GranuleList.propTypes = {
  loading: PropTypes.number.isRequired,
  results: PropTypes.object.isRequired,
  totalHits: PropTypes.number.isRequired,
  returnedHits: PropTypes.number.isRequired,
}
