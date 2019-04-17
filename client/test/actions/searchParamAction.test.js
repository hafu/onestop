import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import reducer from '../../src/reducer'
import * as actions from '../../src/actions/search/CollectionFilterActions'

describe('The search params actions', function(){
  describe('for geometries', function(){
    const geoJSON = {geometry: 'test object'}

    it('set geoJSON', function(){
      const mapAction = actions.collectionUpdateGeometry(geoJSON)
      const expectedAction = {
        type: 'new_geometry',
        geoJSON: {geometry: 'test object'},
      }

      expect(mapAction).toEqual(expectedAction)
    })
  })

  describe('for datetimes', function(){
    const datetime = '2016-07-25T15:45:00-06:00'

    it('sets start date time ', function(){
      const temporalAction = actions.collectionUpdateDateRange(datetime, '')
      const expectedAction = {
        type: 'COLLECTION_UPDATE_DATE_RANGE',
        startDate: '2016-07-25T15:45:00-06:00',
        endDate: '',
      }

      expect(temporalAction).toEqual(expectedAction)
    })

    it('sets end date time ', function(){
      const temporalAction = actions.collectionUpdateDateRange('', datetime)
      const expectedAction = {
        type: 'COLLECTION_UPDATE_DATE_RANGE',
        startDate: '',
        endDate: '2016-07-25T15:45:00-06:00',
      }

      expect(temporalAction).toEqual(expectedAction)
    })
  })

  describe('for facets', function(){
    const middlewares = [ thunk ]
    const mockStore = configureMockStore(middlewares)
    const initialState = reducer(undefined, {})

    it('adds facet to facets selected', function(){
      const facets = {name: 'a', value: 'a', selected: true}
      const expectedActions = {
        type: 'COLLECTION_TOGGLE_FACET',
        selectedFacets: {a: [ 'a' ]},
      }

      const store = mockStore(initialState)
      store.dispatch(
        actions.collectionToggleFacet(
          facets.name,
          facets.value,
          facets.selected
        )
      )
      expect(store.getActions()[0]).toEqual(expectedActions)
    })

    it('removes facet from facets selected', function(){
      const toggleOnAction = {
        type: 'COLLECTION_TOGGLE_FACET',
        selectedFacets: {a: [ 'a' ]},
      }
      const state = reducer(initialState, toggleOnAction)
      const expectedActions = {
        type: 'COLLECTION_TOGGLE_FACET',
        selectedFacets: {},
      }
      const store = mockStore(state)

      store.dispatch(actions.collectionToggleFacet('a', 'a', false))
      expect(store.getActions()[0]).toEqual(expectedActions)
    })
  })
})
