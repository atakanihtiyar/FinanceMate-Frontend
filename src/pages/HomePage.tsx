import Planet from '../components/planet_view/Planet';
import { Heading, Typo, Anchor } from "@/components/ui/text"
import { Button } from "@/components/ui/button"

const HomePage = () => {
    const defaultStyle = `tw-min-w-full tw-min-h-screen tw-flex tw-flex-nowrap tw-flex-col tw-justify-center tw-items-center tw-gap-8`
    const largeStyle = `lg:tw-flex-row xl:tw-gap-24`

    return (
        <div className={`${defaultStyle} ${largeStyle}`}>
            <div className="tw-flex tw-flex-wrap tw-flex-col tw-justify-center tw-items-center">
                <Heading level='h1' className="md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" wrap="nowrap" align="center" variant="h1" size="_5xl">Cosmic Bonds,</Heading>
                <Heading level='h1' className="md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" wrap="nowrap" align="center" variant="h1" size="_5xl">Stellar Returns.</Heading>
                <Button variant="default">Get Started</Button>
            </div>
            <Planet size="_16rem" blur="_0_2rem" lgSize="_32rem" lgBlur="_0_4rem" />
        </div>
    )
}

export default HomePage