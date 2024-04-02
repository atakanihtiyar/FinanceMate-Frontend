import './Planet.css';

const Planet = ({ }) => {
    return (
        <div className="planet" >
            <div className="octaves">
                <div className="texture-layer tw-bg-[length:50%]" />
                <div className="texture-layer tw-bg-[length:25%] tw-opacity-[50%] tw-mix-blend-exclusion" />
                <div className="texture-layer tw-bg-[length:12.5%] tw-opacity-[25%] tw-mix-blend-hard-light" />
            </div>
            <div className="color-layer" />
            <div className="noise-layer" />
            <div className="light-layer" />
        </div >
    )
}

export default Planet