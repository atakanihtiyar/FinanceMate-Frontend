import "./styles/HomePage.css"
import PlanetView from '../../components/planet_view/PlanetView';
import Text, { TextTemplates } from "../../components/html_basics/Text"
import Button, { ButtonTemplates } from "../../components/html_basics/Button";

const HomePage = () => {

    const GetStartedClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        console.log("source -> ", e)
        console.log("Let's get started")
    }

    return (
        <div className="homepage">
            <div className="text-content">
                <div className="slogan">
                    <Text text="Cosmic Bonds," template={TextTemplates.HERO} />
                    <Text text="Stellar Returns." template={TextTemplates.HERO} />
                </div>
                <Button disabled={false}
                    template={ButtonTemplates.FIILED}
                    text="Get Started"
                    onClick={e => GetStartedClickHandler(e)} />
            </div>
            <PlanetView />
        </div>
    )
}

export default HomePage