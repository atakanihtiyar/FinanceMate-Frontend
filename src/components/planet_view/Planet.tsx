import './Planet.css';

const Planet = ({ }) => {
    return (
        <div className="planet" >
            <div className="octaves">
                <div className="texture-layer bg-[length:50%]" />
                <div className="texture-layer bg-[length:25%] opacity-[50%] mix-blend-exclusion" />
                <div className="texture-layer bg-[length:12.5%] opacity-[25%] mix-blend-hard-light" />
            </div>
            <div className="color-layer" />
            <div className="noise-layer" />
            <div className="light-layer" />
        </div >
    )
}

export default Planet