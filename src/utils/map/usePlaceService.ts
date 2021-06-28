import { useCallback, useEffect, useState } from 'react'
import MarkerWithLabel from '@googlemaps/markerwithlabel'

/**
 * side-effect hooks to search place with a query
 * @param searchQuery search query
 * @param map instance of Map
 */
function usePlaceService (searchQuery: string, map: google.maps.Map | undefined): void {
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService>()
  const [prevSearchQuery, setPrevSearchQuery] = useState<typeof searchQuery>()
  const [markers, setMarkers] = useState<MarkerWithLabel[]>()

  const handleSearchResult = useCallback((
    results: google.maps.places.PlaceResult[] | null,
    status: google.maps.places.PlacesServiceStatus,
    pagenation: google.maps.places.PlaceSearchPagination | null
  ) => {
    if (map != null) {
      // add markers of results
      const newMarkers = results?.map(result => {
        const { name, geometry: { location } = {} } = result
        const marker = new MarkerWithLabel({
          position: location,
          labelContent: name ?? '',
          labelAnchor: new google.maps.Point(0, -60),
          labelClass: 'map-marker-label'
        })
        marker.setMap(map)

        return marker
      })

      setMarkers(newMarkers)
    }
  }, [map, setMarkers])

  // prepare placeService
  useEffect(() => {
    if (map != null) {
      // Create a PlacesService instance
      const placesService = new google.maps.places.PlacesService(map)

      // set to component state
      setPlacesService(placesService)
    }
  }, [map, setPlacesService])

  // remove all old marker
  useEffect(() => {
    if (searchQuery !== prevSearchQuery) {
      markers?.forEach(marker => {
        marker.setMap(null)
      })

      setPrevSearchQuery(searchQuery)
    }
  }, [searchQuery, prevSearchQuery, markers, setPrevSearchQuery])

  // search
  useEffect(() => {
    if (map != null && placesService != null) {
      placesService.textSearch({
        query: searchQuery,
        radius: 500,
        location: map.getCenter()
      }, handleSearchResult)
    }
  }, [searchQuery, map, placesService, handleSearchResult])
}

export default usePlaceService
export {
  usePlaceService
}
