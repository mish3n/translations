import React, { ReactElement, ReactNode } from "react";
import Bold from "../../components/TranslatedMolecules/Bold";
import Italic from "../../components/TranslatedMolecules/Italic";

interface Molecule {
    tag: string;
    url?: string;
}

const PH_OPEN = "{";
const PH_CLOSE = "}";
const TAG_OPEN = "<";
const TAG_END = ">";
const TAG_CLOSE = "/";

export const processTranslation = (translation: string, args?: { [key: string]: string }): React.ReactNode => {
    // TODO: handle invalid tags
    // "Meow meow <b><i><a[https://www.google.com]>text: {meow}</a></i></b> hello"
    const result: ReactNode[] = [];
    const stack: Molecule[] = [];
    const temp: ReactElement[] = [];

    let openTagsCount = 0;
    let tempString = "";
    for (let ind = 0; ind < translation.length; ind++) {
        const char = translation[ind];
        if (char === TAG_OPEN) {
            if (!openTagsCount && tempString) {
                result.push(<>{tempString}</>);
                tempString = "";
            }

            const nextChar = translation[++ind];
            if (nextChar === TAG_CLOSE) {
                if (!stack.length) {
                    throw new Error("INVALID_TRANSLATION_STRING");
                }

                if (tempString) {
                    temp.push(<>{tempString}</>);
                    tempString = "";
                }

                --openTagsCount;
                const b = stack.pop();
                const TagComponent = getComponentByTag(b!.tag);

                const wrappedContent = (
                    <TagComponent>
                        {temp.map((x: ReactElement) => React.cloneElement(x))}
                    </TagComponent>
                );
                temp.length = 0;

                openTagsCount ? temp.push(wrappedContent) : result.push(wrappedContent);

                ind += 2;
            } else {
                ++openTagsCount;
                stack.push({ tag: nextChar });
                ++ind;
            }

            continue;
        }

        if (char === PH_OPEN) {
            if (tempString) {
                openTagsCount ? temp.push(<>{tempString}</>) : result.push(<>{tempString}</>);
                tempString = "";
            }

            ++ind;
            let placeholder = "";
            while (translation[ind] !== PH_CLOSE) {
                placeholder += translation[ind];
                ++ind;
            }
            // TODO: validations
            const varValue = args![placeholder];
            debugger;
            openTagsCount ? temp.push(<>{varValue}</>) : result.push(<>{varValue}</>);;
            continue;
        }

        tempString += char;
    }

    if (tempString) {
        result.push(<>{tempString}</>);
        tempString = "";
    }

    return <>{result}</>;
}

const getComponentByTag = (tag: string) => {
    switch (tag) {
        case "b":
            return Bold;
        case "i":
            return Italic;
        default:
            throw new Error("INVALID_TAG");
    }
}
