import React from 'react'
import type { Story, Meta } from '@storybook/react'

import { MapJsLoaderProvider, MapJsLoaderProviderProps } from '@/utils/map/mapJsLoader'

import { Component as WebglOverlayView, Props as WebglOverlayViewProps } from './index'

const meta: Meta = {
  title: 'atoms/WebglOverlayView',
  component: WebglOverlayView,
  args: {
    mapOptions: {
      tilt: 0,
      heading: 0,
      zoom: 18,
      center: { lat: 35.6594945, lng: 139.6999859 },
      mapId: '',
      // disable interactions due to animation loop and moveCamera
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false
    }
  },
  argTypes: {
    mapId: {
      type: { name: 'string', required: true },
      control: { type: 'text' }
    },
    apiKey: {
      type: { name: 'string', required: true },
      control: { type: 'text' }
    }
  }
}
export default meta

const Template: Story<WebglOverlayViewProps & MapJsLoaderProviderProps & { mapId: string}> = (args) => {
  const {
    mapId,
    apiKey,
    mapOptions,
    ...webglOverlayViewProps
  } = args
  mapOptions.mapId = mapId

  return (
    <MapJsLoaderProvider apiKey={apiKey}>
      <WebglOverlayView
        {...webglOverlayViewProps}
        mapOptions={mapOptions}
      />
    </MapJsLoaderProvider>
  )
}

export const Default = Template.bind({})
