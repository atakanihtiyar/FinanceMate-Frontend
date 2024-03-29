import {
    navigationMenuTriggerStyle as getNavigationItemStyle,
    NavigationMenuList as NavigationList,
    NavigationMenuItem as NavigationItem,
    NavigationMenuLink as NavigationLink,
} from "@/components/ui/navigation-menu"
import { Typo, textVariants } from "../ui/text"
import { VariantProps } from "class-variance-authority"
import React from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

interface INavigationItem {
    type: "text" | "link"
    text: string,
    url?: string,
    style?: VariantProps<typeof textVariants>,
}

const NavigationListFormatter = (list: INavigationItem[]) => {
    return (
        <NavigationList>
            {list.map(e => NavigationItemFormatter(e))}
        </NavigationList>
    )
}

const NavigationItemFormatter = (item: INavigationItem) => {
    if (item.type === "link") {
        return (
            <NavigationLink href={item.url} className={getNavigationItemStyle()}>
                <Typo {...item.style}>{item.text}</Typo>
            </NavigationLink>
        )
    }
    else if (item.type === "text") {
        return (
            <NavigationItem className={getNavigationItemStyle()}>
                <Typo {...item.style}>{item.text}</Typo>
            </NavigationItem>
        )
    }
}

export { NavigationListFormatter, type INavigationItem }



interface NavigationWrapperProps {
    toBeWrapped: React.ReactNode,
}

const NavigationWrapper = (toBeWrapped: React.ReactNode) => {
    return (
        <>
            <Navbar />
            {toBeWrapped}
            <Footer />
        </>
    )
}


export { NavigationWrapper }