import { useCallback, useEffect, useState } from 'react'
import { AmbientLight, DirectionalLight, Matrix4, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * side-effect hooks for drawing 3D map
 * @param webglOverlayView instance of WebglOverlayView
 * @param mapOptions map options
 */
function useDrawer (map: google.maps.Map | undefined, webglOverlayView: google.maps.WebglOverlayView | undefined, mapOptions: google.maps.MapOptions): void {
  const [scene, setScene] = useState<Scene>()
  const [camera, setCamera] = useState<PerspectiveCamera>()
  const [renderer, setRenderer] = useState<WebGLRenderer>()

  const onAdd = useCallback(() => {
  // Set up the Three.js scene.
    const scene = new Scene()
    const camera = new PerspectiveCamera()

    const ambientLight = new AmbientLight(0xffffff, 0.75) // Soft white light.
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.25)
    directionalLight.position.set(0, 10, 50)
    scene.add(directionalLight)

    // Load the 3D model with GLTF Loader from Three.js.
    const loader = new GLTFLoader()
    const url =
      'https://raw.githubusercontent.com/googlemaps/js-samples/master/assets/pin.gltf'

    loader.load(url, (gltf) => {
      gltf.scene.scale.set(10, 10, 10)
      gltf.scene.rotation.x = Math.PI
      scene.add(gltf.scene)

      let { tilt, heading, zoom } = mapOptions

      const animate = (): void => {
        if (map != null && tilt != null && heading != null && zoom != null) {
          if (tilt < 67.5) {
            tilt += 0.5
          } else if (heading <= 360) {
            heading += 0.2
            zoom -= 0.0005
          } else {
            // exit animation loop
            return
          }
          map.moveCamera({ tilt, heading, zoom })
        }

        requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    })

    setScene(scene)
    setCamera(camera)
  }, [map, mapOptions, setCamera, setScene])

  const onContextRestored = useCallback((gl: WebGLRenderingContext) => {
    // Create the Three.js renderer, using the
    // maps's WebGL rendering context.
    const renderer = new WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes()
    })
    renderer.autoClear = false

    setRenderer(renderer)
  }, [setRenderer])

  const onDraw = useCallback((
    gl: WebGLRenderingContext,
    coordinateTransformer: google.maps.CoordinateTransformer
  ) => {
    if (webglOverlayView != null && renderer != null && scene != null && camera != null) {
      if (mapOptions.center != null) {
        // Update camera matrix to ensure the model is georeferenced correctly on the map.
        const matrix = coordinateTransformer.fromLatLngAltitude(mapOptions.center, 120)
        camera.projectionMatrix = new Matrix4().fromArray(matrix)
      }

      // Request a redraw and render the scene.
      webglOverlayView.requestRedraw()
      renderer.render(scene, camera)

      // Always reset the GL state.
      renderer.resetState()
    }
  }, [mapOptions, webglOverlayView, camera, renderer, scene])

  useEffect(() => {
    if (webglOverlayView != null) {
      webglOverlayView.onAdd = onAdd
      webglOverlayView.onContextRestored = onContextRestored
      webglOverlayView.onDraw = onDraw
    }
  }, [webglOverlayView, onAdd, onContextRestored, onDraw])
}

export default useDrawer
export {
  useDrawer
}
