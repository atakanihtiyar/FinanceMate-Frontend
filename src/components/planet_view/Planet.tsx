import './Planet.css';
import { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority"
import PlanetLayer from './PlanetLayer';

import { cn } from "@/lib/utils"

const planetVariants = cva(
    ``,
    {
        variants: {
            size: {
                none: "",
                _16rem: "tw-w-[16rem] tw-h-[16rem] tw-min-w-[16rem] tw-min-h-[16rem]",
                _32rem: "tw-w-[32rem] tw-h-[32rem] tw-min-w-[32rem] tw-min-h-[32rem]",
            },
            blur: {
                none: "",
                _0_2rem: "tw-blur-[0.2rem]",
                _0_4rem: "tw-blur-[0.4rem]",
            },
            lgSize: {
                none: "",
                _16rem: "lg:tw-w-[16rem] lg:tw-h-[16rem] lg:tw-min-w-[16rem] lg:tw-min-h-[16rem]",
                _32rem: "lg:tw-w-[32rem] lg:tw-h-[32rem] lg:tw-min-w-[32rem] lg:tw-min-h-[32rem]",
            },
            lgBlur: {
                none: "",
                _0_2rem: "lg:tw-blur-[0.2rem]",
                _0_4rem: "lg:tw-blur-[0.4rem]",
            },
        },
        defaultVariants: {
            size: "none",
            lgSize: "none",
            blur: "none",
            lgBlur: "none",
        },
    }
)
type PlanetProps = VariantProps<typeof planetVariants> & ComponentProps<"div">;

const Planet = ({ size, blur, lgSize, lgBlur, ...props }: PlanetProps) => {
    return (
        <div {...props} className={cn("planet tw-static tw-drop-shadow-lg", planetVariants({ size, lgSize }))} >
            {/* CONTAINER */}
            <PlanetLayer context="container" position="relative" size="full" rounded="_50" overflow="hidden" className={`tw-blur-[0.05rem] lg:tw-blur-[0.1rem]`}>

                {/* OCTAVES */}
                <PlanetLayer context="octaves" position="relative" size="double" left="_0" bottom="_100" className={cn("tw-animate-[surface-motion_10s_linear_infinite]", planetVariants({ blur, lgBlur }))}>
                    <PlanetLayer context="fullOctave" position="absolute" size="full" left="_0" bottom="_0" bg="texture" bgSize="_50" bgRepeat="repeat" blendMode="normal" opacity="_100" />
                    <PlanetLayer context="halfOctave" position="absolute" size="full" left="_0" bottom="_0" bg="texture" bgSize="_25" bgRepeat="repeat" blendMode="exclusion" opacity="_50" />
                    <PlanetLayer context="quarterOctave" position="absolute" size="full" left="_0" bottom="_0" bg="texture" bgSize="_12_5" bgRepeat="repeat" blendMode="hardLight" opacity="_25" />
                </PlanetLayer>

                {/* COLOR NOISE LIGHT */}
                <PlanetLayer context="color" position="absolute" size="full" left="_0" bottom="_0" bg="color" bgSize="_100" blendMode="color" opacity="_100" />
                <PlanetLayer context="noise" position="absolute" size="full" left="_0" bottom="_0" bg="noise" bgSize="_100" blendMode="softLight" opacity="_12_5" />
                <PlanetLayer context="light" position="absolute" size="full" left="_0" bottom="_0" bg="light" bgSize="_100" blendMode="hardLight" />
            </PlanetLayer >

            {/* REFLECTION */}
            < PlanetLayer context="reflection" position="absolute" size="full" left="_0" bottom="_0" opacity="_10" >
                <PlanetLayer context="color" position="absolute" size="full" left="_0" bottom="_0" bg="color" rounded="_50" blendMode="color" />
                <PlanetLayer context="light" position="absolute" size="full" left="_0" bottom="_0" bg="mask" blendMode="softLight" />
            </PlanetLayer >
        </div >
    )
}

export default Planet