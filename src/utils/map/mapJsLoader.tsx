import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Loader as GoogleMapsApiLoader } from '@googlemaps/js-api-loader'

/**
 * loading status enum of GoogleMapsApiLoader
 */
const GoogleMapsApiLoaderStatus = {
  /**
   * 初期状態
   */
  INITIAL: 'initial',
  /**
   * ロード中
   */
  LOADING: 'loading',
  /**
   * ロード済み
   */
  LOADED: 'loaded',
  /**
   * ロード失敗
   */
  FAILED: 'failed'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
type GoogleMapsApiLoaderStatus = typeof GoogleMapsApiLoaderStatus[keyof typeof GoogleMapsApiLoaderStatus]

interface ContextValue {
  loader: GoogleMapsApiLoader | undefined
  loaderStatus: GoogleMapsApiLoaderStatus
  loadError: Error | undefined
}
const MapJsLoaderContext = React.createContext<ContextValue>({
  loader: undefined,
  loaderStatus: GoogleMapsApiLoaderStatus.INITIAL,
  loadError: undefined
})
const { Provider } = MapJsLoaderContext

interface ProviderProps {
  /**
   * API_KEY for `Maps JavaScript API`
   */
  apiKey: string
}
const MapJsLoaderProvider: React.FunctionComponent<ProviderProps> = (props) => {
  const { apiKey } = props

  const [loader, setLoader] = useState<GoogleMapsApiLoader>()
  const [loaderStatus, setLoaderStatus] = useState<GoogleMapsApiLoaderStatus>(GoogleMapsApiLoaderStatus.INITIAL)
  const [loadError, setLoadError] = useState<Error>()

  const value = useMemo(() => ({
    loader,
    loaderStatus,
    loadError
  }), [loader, loaderStatus, loadError])

  // prepare loader with apiKey (if it was NOT loaded still)
  useEffect(() => {
    if (loader == null && apiKey != null && apiKey.length > 0) {
      const newLoader = new GoogleMapsApiLoader({
        apiKey,
        version: 'beta', // WebglOverlayView feature is only available in beta
        libraries: ['places']
      })

      setLoader(newLoader)
      setLoaderStatus(GoogleMapsApiLoaderStatus.INITIAL)
    }
  }, [apiKey, loader, setLoader, setLoaderStatus])

  // load map API
  useEffect(() => {
    if (loaderStatus === GoogleMapsApiLoaderStatus.INITIAL && loader != null) {
      setLoaderStatus(GoogleMapsApiLoaderStatus.LOADING)

      loader.load()
        .then(() => {
          setLoaderStatus(GoogleMapsApiLoaderStatus.LOADED)
        })
        .catch((ex: Error) => {
          setLoaderStatus(GoogleMapsApiLoaderStatus.FAILED)
          setLoadError(ex)
        })
    }
  }, [loaderStatus, loader, setLoaderStatus])

  return (
    <Provider value={value}>
      {props.children}
    </Provider>
  )
}

/**
 * custom hook for request GoogleMapsApiLoader to load maps API script
 * @returns { loaderStatus: status of loader, loadError: load error }
 */
function useMapJsLoader (): {
  loaderStatus: GoogleMapsApiLoaderStatus
  loadError: Error | undefined
} {
  const {
    loaderStatus,
    loadError
  } = useContext(MapJsLoaderContext)

  return {
    loaderStatus,
    loadError
  }
}

export {
  GoogleMapsApiLoaderStatus,
  MapJsLoaderProvider,
  ProviderProps as MapJsLoaderProviderProps,
  useMapJsLoader
}
