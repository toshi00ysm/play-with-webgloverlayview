// import libraries
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

// import PJ resources
import usePlaceService from '@/utils/map/usePlaceService'
import { GoogleMapsApiLoaderStatus, useMapJsLoader } from '@/utils/map/mapJsLoader'

// import component's private resources
import useDrawer from './hooks/useDrawer'
import './styles.css'

// prepare styled component
const MapWrapper = styled.div`
  width: 800px;
  height: 600px;
  pointer-events: none;
`

/**
 * props for WebglOverlayView
 */
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  mapOptions: google.maps.MapOptions
  searchQuery?: string
}

/**
 * WebglOverlayView component
 */
const Component: React.FunctionComponent<Props> = ({
  mapOptions,
  searchQuery = '',
  ...props
}) => {
  const mapDiv = useRef<HTMLDivElement>(null)

  const { loaderStatus: mapApiLoaderStatus } = useMapJsLoader()

  const [map, setMap] = useState<google.maps.Map>()
  const [webglOverlayView, setWebglOverlayView] = useState<google.maps.WebglOverlayView>()

  // prepare map & webglOverlayView
  useEffect(() => {
    if (mapApiLoaderStatus === GoogleMapsApiLoaderStatus.LOADED && mapDiv.current != null) {
      // Create a map instance.
      const map = new google.maps.Map(mapDiv.current, mapOptions)

      // Create a WebGL Overlay View instance.
      const webglOverlay = new google.maps.WebglOverlayView()

      // Add the overlay to the map.
      webglOverlay.setMap(map)

      // set to component state
      setMap(map)
      setWebglOverlayView(webglOverlay)
    }
  }, [mapOptions, mapApiLoaderStatus, mapDiv, setMap, setWebglOverlayView])

  // draw
  useDrawer(map, webglOverlayView, mapOptions)
  // use search feature
  usePlaceService(searchQuery, map)

  return (
    <MapWrapper
      ref={mapDiv}
      {...props}
    />
  )
}
Component.displayName = 'WebglOverlayView'

export default Component
export {
  Component,
  Props
}
