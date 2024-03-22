import '../styles/BasicLayer.css';
import '../styles/TextureLayer.css';

export enum PlanetLayerTypes {
    TEXTURE = "texture",
    BASIC = "basic"
}

interface params {
    className: string,
    layerType: PlanetLayerTypes
}

const PlanetLayer = ({ className, layerType }: params) => {
    return (
        <div className={`${layerType}-layer ${className}`} />
    )
}

export default PlanetLayer