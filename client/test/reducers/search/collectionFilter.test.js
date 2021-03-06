import Immutable from 'seamless-immutable'
import {
  collectionFilter,
  initialState,
} from '../../../src/reducers/search/collectionFilter'
import {
  collectionUpdateFilters,
  collectionUpdateGeometry,
  collectionRemoveGeometry,
  collectionToggleSelectedId,
  collectionToggleExcludeGlobal,
  collectionClearSelectedIds,
  COLLECTION_TOGGLE_FACET,
} from '../../../src/actions/search/CollectionFilterActions'

describe('The search reducer', function(){
  it('has a default state', function(){
    const initialAction = {type: 'init'}
    const result = collectionFilter(initialState, initialAction)

    expect(result).toEqual({
      queryText: '',
      geoJSON: null,
      startDateTime: null,
      endDateTime: null,
      selectedFacets: {},
      selectedIds: [],
      excludeGlobal: null,
    })
  })

  describe('collectionUpdateFilters cases', function(){
    it('updates all search params', function(){
      const newSearchParams = {
        queryText: 'new',
        geoJSON: {
          type: 'Point',
          geometry: {type: 'Point', coordinates: [ 0, 0 ]},
        },
        startDateTime: '2000-01-01T00:00:00Z',
        endDateTime: '3000-01-01T00:00:00Z',
        selectedFacets: {science: [ 'Oceans' ]},
        selectedIds: [ 'ABCXYZ' ],
        excludeGlobal: true,
      }

      const updateAction = collectionUpdateFilters(newSearchParams)
      const result = collectionFilter(initialState, updateAction)
      expect(result).toEqual(newSearchParams)
    })

    it('defaults to initial state for missing fields', function(){
      const newSearchParams = {
        queryText: 'new',
      }

      const updateAction = collectionUpdateFilters(newSearchParams)
      const result = collectionFilter(initialState, updateAction)
      expect(result).toEqual(Immutable.merge(initialState, newSearchParams))
    })

    it('works for empty or undefined params', function(){
      expect(
        collectionFilter(initialState, collectionUpdateFilters({}))
      ).toEqual(initialState)
      expect(
        collectionFilter(initialState, collectionUpdateFilters(null))
      ).toEqual(initialState)
      expect(
        collectionFilter(initialState, collectionUpdateFilters(undefined))
      ).toEqual(initialState)
    })
  })

  describe('geometry cases', function(){
    const validGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [ 100.0, 0.0 ],
            [ 101.0, 0.0 ],
            [ 101.0, 1.0 ],
            [ 100.0, 1.0 ],
            [ 100.0, 0.0 ],
          ],
        ],
      },
      properties: {
        description: 'Valid test GeoJSON',
      },
    }

    it('updates the state for a new geometry', function(){
      const newGeomAction = collectionUpdateGeometry(validGeoJSON)
      const result = collectionFilter(initialState, newGeomAction)
      expect(result.geoJSON).toEqual(validGeoJSON)
    })

    it('defaults back to initial state for geometry removal', function(){
      const removeGeomAction = collectionRemoveGeometry()
      const result = collectionFilter({geoJSON: validGeoJSON}, removeGeomAction)
      expect(result.geoJSON).toBeNull()
    })
  })

  describe('selected collections cases', function(){
    it('toggles selected collections', function(){
      const toggleA = collectionToggleSelectedId('A')
      const toggleB = collectionToggleSelectedId('B')
      // toggle A --> ['A']
      const addedAResult = collectionFilter(initialState, toggleA)
      expect(addedAResult.selectedIds).toEqual([ 'A' ])
      // toggle B --> ['A', 'B']
      const addedBResult = collectionFilter(addedAResult, toggleB)
      expect(addedBResult.selectedIds).toEqual([ 'A', 'B' ])
      // toggle A --> ['B']
      const removedAResult = collectionFilter(addedBResult, toggleA)
      expect(removedAResult.selectedIds).toEqual([ 'B' ])
    })

    it('can clear existing collection selections', function(){
      const stateWithCollections = Immutable({selectedIds: [ 'ABC' ]})
      const result = collectionFilter(
        stateWithCollections,
        collectionClearSelectedIds()
      )
      expect(result.selectedIds).toEqual([])
    })
  })

  describe('facet cases', function(){
    it('should handle COLLECTION_TOGGLE_FACET w/ facets selected', () => {
      const selectedFacets = {
        science: [ 'Oceans', 'Oceans > Ocean Temperature' ],
        instruments: [
          'Earth Remote Sensing Instruments > Passive Remote Sensing > Spectrometers/Radiometers > Imaging Spectrometers/Radiometers > AVHRR-3 > Advanced Very High Resolution Radiometer-3',
        ],
      }
      const modFacetsAction = {
        type: COLLECTION_TOGGLE_FACET,
        selectedFacets: selectedFacets,
      }

      const reducerResp = collectionFilter(initialState, modFacetsAction)
      expect(reducerResp.selectedFacets).toEqual(selectedFacets)
    })

    it('should handle COLLECTION_TOGGLE_FACET w/ no facets selected', () => {
      const actionWithNoFacets = {
        type: COLLECTION_TOGGLE_FACET,
        selectedFacets: {},
      }
      const reducerResp = collectionFilter(initialState, actionWithNoFacets)
      expect(reducerResp.selectedFacets).toEqual({})
    })
  })

  describe('toggleGlobal', function(){
    it('should handle COLLECTION_TOGGLE_EXCLUDE_GLOBAL starting at null', () => {
      const reducerResp = collectionFilter(
        initialState,
        collectionToggleExcludeGlobal()
      )
      expect(reducerResp.excludeGlobal).toBeTruthy()
    })
    it('should handle COLLECTION_TOGGLE_EXCLUDE_GLOBAL starting with excludeGlobal at true', () => {
      const globalExcludedState = {
        excludeGlobal: true,
      }
      const reducerResp = collectionFilter(
        globalExcludedState,
        collectionToggleExcludeGlobal()
      )
      expect(reducerResp.excludeGlobal).toBeFalsy()
    })
    it('should handle COLLECTION_TOGGLE_EXCLUDE_GLOBAL starting with excludeGlobal at false', () => {
      const globalExcludedState = {
        excludeGlobal: false,
      }
      const reducerResp = collectionFilter(
        globalExcludedState,
        collectionToggleExcludeGlobal()
      )
      expect(reducerResp.excludeGlobal).toBeTruthy()
    })
  })
})
