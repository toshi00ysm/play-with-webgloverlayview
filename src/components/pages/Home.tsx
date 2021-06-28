// import libraries
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

// import PJ resources
import { MapJsLoaderProvider } from '@/utils/map/mapJsLoader'
import WebglOverlayView from '@/components/atoms/WebglOverlayView'

const Container = styled.div`
  padding: 0 16px;
`
const PageTitle = styled.h1`
  font-size: 2em;
  margin: 0.67em 0;
  font-weight: bold;
`
const MapHeader = styled.form`
  margin-bottom: 16px;
`
const MapBody = styled.div``
const MapIdInput = styled.input`
  width: 150px;
  margin-right: 8px;
`
const ApiKeyInput = styled.input`
  width: 200px;
  margin-right: 8px;
`

/**
 * default options for `WebglOverlayView`
 */
const mapOptionsDefault: Omit<google.maps.MapOptions, 'mapId'> = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: { lat: 33.590188, lng: 130.420685 },
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
  gestureHandling: 'none',
  keyboardShortcuts: false
} as const

interface Props {}

const Component: React.FunctionComponent<Props> = (props) => {
  const [mapId, setMapId] = useState<string>('')
  const [mapIdInput, setMapIdInput] = useState<string>(mapId)
  const [apiKey, setApiKey] = useState<string>('')
  const [apiKeyInput, setApiKeyInput] = useState<string>(apiKey)
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)

  const mapOptions = useMemo(() => ({
    ...mapOptionsDefault,
    mapId
  }), [mapId])

  const handleMapIdInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { value: mapIdInput } } = e

    if (mapIdInput.length > 0) {
      setMapIdInput(mapIdInput)
    }
  }, [setMapIdInput])

  const handleApiKeyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { value: apiKeyInput } } = e

    if (apiKeyInput.length > 0) {
      setApiKeyInput(apiKeyInput)
    }
  }, [setApiKeyInput])

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (mapIdInput.length > 0 && apiKeyInput.length > 0) {
      setMapId(mapIdInput)
      setApiKey(apiKeyInput)
      setIsFormSubmitted(true)
    }
  }, [mapIdInput, apiKeyInput, setMapId, setApiKey, setIsFormSubmitted])

  return (
    <Container>
      <PageTitle>WebglOverlayView</PageTitle>
      <div>
        <MapHeader onSubmit={handleFormSubmit}>
          mapId: <MapIdInput type='password' name='mapId' placeholder='input your Map ID here' value={mapIdInput} disabled={mapId.length > 0} onChange={handleMapIdInputChange} />
          apiKey: <ApiKeyInput type='password' name='apiKey' placeholder='input your API_KEY here' value={apiKeyInput} disabled={apiKey.length > 0} onChange={handleApiKeyInputChange} />
          <button disabled={mapIdInput.length === 0 || apiKeyInput.length === 0 || isFormSubmitted}>表示</button>
        </MapHeader>
        <MapBody>
          {mapId.length > 0 && apiKey.length > 0 ? (
            <MapJsLoaderProvider apiKey={apiKey}>
              <WebglOverlayView
                mapOptions={mapOptions}
                searchQuery='ラーメン'
              />
            </MapJsLoaderProvider>
          ) : undefined}
        </MapBody>
      </div>
    </Container>
  )
}
Component.displayName = 'Home'

export default Component
export {
  Component,
  Props
}
