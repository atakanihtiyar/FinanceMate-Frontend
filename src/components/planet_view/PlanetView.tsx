import './styles/PlanetView.css';
import OctaveLayer from './layers/OctaveLayer';
import PlanetLayer, { PlanetLayerTypes } from './layers/PlanetLayer';
import ReflectionLayer from './layers/ReflectionLayer';

const PlanetView = () => {
    return (
        <div className='planet'>
            <div className="container">
                <OctaveLayer className='animated-surface' />
                <PlanetLayer className='color' layerType={PlanetLayerTypes.BASIC} />
                <PlanetLayer className='noise' layerType={PlanetLayerTypes.TEXTURE} />
                <PlanetLayer className='lighting' layerType={PlanetLayerTypes.BASIC} />
            </div>
            <ReflectionLayer />

        </div>
    )
}

export default PlanetView