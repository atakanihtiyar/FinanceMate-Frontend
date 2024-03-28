import './styles/PlanetView.css';

interface PlanetProps {
    className?: string,
}

const PlanetView = ({ className = "" }: PlanetProps) => {
    return (
        <>
            <div className={`tw-w-[16rem] tw-h-[16rem] tw-min-w-[16rem] tw-min-h-[16rem] tw-blur-[0.25rem]
            lg:tw-w-[32rem] lg:tw-h-[32rem] lg:tw-min-w-[32rem] lg:tw-min-h-[32rem] lg:tw-blur-[0.5rem]
            tw-relative planet-base ${className}`} >
                <div className="tw-relative tw-w-full tw-h-full tw-overflow-hidden circular-mask">
                    <div className={`tw-relative tw-w-[200%] tw-h-[200%] tw-left-0 tw-bottom-[16rem] lg:tw-bottom-[32rem] 
                    nm-size lg:lg-size tw-animate-[surface-motion_10s_linear_infinite] tw-blur-[0.25rem] lg:tw-blur-[0.5rem]`}>
                        <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-repeat tw-bg-[url("/images/planet/texture.jpg")]
                        tw-bg-25% tw-mix-blend-hard-light tw-opacity-100`} />
                        <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-repeat tw-bg-[url("/images/planet/texture.jpg")]
                        tw-bg-12.5% tw-mix-blend-exclusion tw-opacity-50`} />
                        <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-repeat tw-bg-[url("/images/planet/texture.jpg")]
                        tw-bg-6.25% tw-mix-blend-normal tw-opacity-25`} />
                    </div>
                    <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-[var(--planet-color)]
                        tw-bg-100% tw-mix-blend-color`} />
                    <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-repeat tw-bg-[url("/images/planet/noise.jpg")]
                            tw-bg-100% tw-mix-blend-soft-light tw-opacity-10`} />
                    <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-[url("/images/planet/lighting.jpg")]
                            tw-bg-100% tw-mix-blend-hard-light`} />
                </div>
                <div className='tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-opacity-10 tw-blur-[8rem] lg:tw-blur-[16rem]'>
                    <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-[var(--planet-color)]
                            tw-bg-100% tw-mix-blend-color circular-mask`} />
                    <div className={`tw-absolute tw-w-full tw-h-full tw-left-0 tw-bottom-0 tw-bg-[url("/images/planet/mask.png")]
                                    tw-bg-100% tw-mix-blend-soft-light`} />
                </div>
            </div>
        </>
    )
}

export default PlanetView