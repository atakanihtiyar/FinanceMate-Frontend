import PlanetView from '../components/planet_view/PlanetView';
import { TextHeader } from "@/components/ui/textHeader"
import { Button } from "@/components/ui/button"

const HomePage = () => {
    const defaultStyle = `tw-min-w-full tw-min-h-screen tw-flex tw-flex-nowrap tw-flex-col tw-justify-center tw-items-center tw-gap-8`
    const largeStyle = `lg:tw-flex-row xl:tw-gap-24`

    return (
        <div className={`${defaultStyle} ${largeStyle}`}>
            <div className="tw-flex tw-flex-wrap tw-flex-col tw-justify-center tw-items-center">
                <TextHeader className="tw-text-center tw-text-nowrap md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" variant="h1" size="_5xl">Cosmic Bonds,</TextHeader>
                <TextHeader className="tw-text-center tw-text-nowrap md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" variant="h1" size="_5xl">Stellar Returns.</TextHeader>
                <Button variant="default">Get Started</Button>
            </div>
            <PlanetView className='tw-shrink-0' />
        </div>
    )
}

export default HomePage