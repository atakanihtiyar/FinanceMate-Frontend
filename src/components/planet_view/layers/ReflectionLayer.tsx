import '../styles/ReflectionLayer.css';
import PlanetLayer, { PlanetLayerTypes } from "./PlanetLayer"

const ReflectionLayer = () => {
    return (
        <div className='reflection-layer'>
            <PlanetLayer className='reflection-color masked' layerType={PlanetLayerTypes.BASIC} />
            <PlanetLayer className='circular-shape' layerType={PlanetLayerTypes.BASIC} />
        </div>
    )
}

export default ReflectionLayer