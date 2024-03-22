import '../styles/TextureLayer.css';
import PlanetLayer, { PlanetLayerTypes } from "./PlanetLayer"

interface params {
    className: string,
}

const OctaveLayer = ({ className }: params) => {
    return (
        <div className={`octave-layer ${className}`}>
            <PlanetLayer className={`full-octave`} layerType={PlanetLayerTypes.TEXTURE} />
            <PlanetLayer className={`half-octave`} layerType={PlanetLayerTypes.TEXTURE} />
            <PlanetLayer className={`quarter-octave`} layerType={PlanetLayerTypes.TEXTURE} />
        </div>
    )
}

export default OctaveLayer