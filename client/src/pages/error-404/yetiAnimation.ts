import { gsap } from "gsap"

export function YetiAnimation() {
    const furLightColor = "#FFF",
        furDarkColor = "#67b1e0",
        skinLightColor = "#ddf1fa",
        skinDarkColor = "#88c9f2",
        lettersSideLight = "#3A7199",
        lettersSideDark = "#051d2c",
        lettersFrontLight = "#67B1E0",
        lettersFrontDark = "#051d2c",
        lettersStrokeLight = "#265D85",
        lettersStrokeDark = "#031219",
        openSmall = `M149 115.7c-4.6 3.7-6.6 9.8-5 15.6.1.5.3 1.1.5 1.6.6 1.5 2.4 2.3 3.9 1.7l11.2-4.4 11.2-4.4c1.5-.6 2.3-2.4 1.7-3.9-.2-.5-.4-1-.7-1.5-2.8-5.2-8.4-8.3-14.1-7.9-3.7.2-5.9 1.1-8.7 3.2z`,
        round = `M161.2 118.9c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-1 .4-2 1.1-2.7.7-.8 1.8-1.3 2.9-1.3 2.2 0 4 1.7 4 4z`
    const chatterTL = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
    chatterTL
        .to(
            ["#mouthBG", "#mouthPath", "#mouthOutline"],
            { duration: 0.1, attr: { d: openSmall }, x: 0, y: 0, scaleY: 0.95, scaleX: 0.95 },
            "0",
        )
        .to("#armR", { duration: 0.1, x: 2, ease: "none" }, "0")
        .to("#chin", { duration: 0.1, y: 1.5 }, "0")

    const yetiTL = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0, delay: 0 })
    yetiTL
        .call(
            function () {
                chatterTL.play()
            },
            null,
            "0",
        )

        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "2.5")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "2.575")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "2.65")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "2.725")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "2.8")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "2.875")

        .call(goLight, null, "3.2")
        .call(goDark, null, "3.3")
        .call(goLight, null, "3.4")

        .call(
            function () {
                chatterTL.pause()
            },
            null,
            "3.2",
        )

        .to(
            ["#mouthBG", "#mouthPath", "#mouthOutline"],
            { duration: 0.3, attr: { d: openSmall }, scale: 0.5, x: 7, y: 3 },
            "4.7",
        )
        .to(
            ["#mouthBG", "#mouthPath", "#mouthOutline"],
            { duration: 0.0, attr: { d: round }, scale: 1, x: 0, y: 0 },
            "5",
        )
        .to("#tooth1", { duration: 0.1, y: -5 }, "5")
        .to(
            "#armR",
            {
                duration: 0.5,
                x: 10,
                y: 30,
                rotation: 10,
                transformOrigin: "bottom center",
                ease: "power1.out",
            },
            "4",
        )
        .to(
            ["#eyeL", "#eyeR"],
            { duration: 0.25, scaleX: 1.4, scaleY: 1.4, transformOrigin: "center center" },
            "5",
        )

        .call(goDark, null, "8")
        .call(goLight, null, "8.1")
        .call(goDark, null, "8.3")
        .call(goLight, null, "8.4")
        .call(goDark, null, "8.6")

        .to(
            ["#mouthBG", "#mouthPath", "#mouthOutline"],
            { duration: 0.3, attr: { d: round }, scale: 2, x: -12, y: -2 },
            "8.7",
        )
        .to(
            ["#mouthBG", "#mouthPath", "#mouthOutline"],
            { duration: 0.0, attr: { d: openSmall }, scale: 1, x: 0, y: 0 },
            "9",
        )

        .to("#tooth1", { duration: 0.0, y: 0 }, "9")
        .to(
            "#armR",
            {
                duration: 0.5,
                x: 0,
                y: 0,
                rotation: 0,
                transformOrigin: "bottom center",
                ease: "power1.out",
            },
            "9",
        )
        .to(
            ["#eyeL", "#eyeR"],
            { duration: 0.25, scaleX: 1, scaleY: 1, transformOrigin: "center center" },
            "9",
        )
        .call(
            function () {
                chatterTL.play()
            },
            null,
            "9.25",
        )

        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "11.5")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "11.575")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "11.65")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "11.725")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 7 }, "11.8")
        .to(["#armL", "#flashlightFront"], { duration: 0.075, x: 0 }, "11.875")

    function goDark() {
        gsap.set("#light", { visibility: "hidden" })

        gsap.set(".lettersSide", { fill: lettersSideDark, stroke: lettersStrokeDark })
        gsap.set(".lettersFront", { fill: lettersFrontDark, stroke: lettersStrokeDark })
        gsap.set("#lettersShadow", { opacity: 0.05 })

        gsap.set(".hlFur", { fill: furDarkColor })
        gsap.set(".hlSkin", { fill: skinDarkColor })
    }

    function goLight() {
        gsap.set("#light", { visibility: "visible" })

        gsap.set(".lettersSide", { fill: lettersSideLight, stroke: lettersStrokeLight })
        gsap.set(".lettersFront", { fill: lettersFrontLight, stroke: lettersStrokeLight })
        gsap.set("#lettersShadow", { opacity: 0.2 })

        gsap.set(".hlFur", { fill: furLightColor })
        gsap.set(".hlSkin", { fill: skinLightColor })
    }

    goDark()
    yetiTL.play()
}
