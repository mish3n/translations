import React, { ReactElement, ReactNode } from "react";
import Bold from "../../components/TranslatedMolecules/Bold";
import Italic from "../../components/TranslatedMolecules/Italic";
import Link from "../../components/TranslatedMolecules/Link";

interface Molecule {
    tag: string;
    url?: string;
}

const PH_OPEN = "{";
const PH_CLOSE = "}";
const TAG_OPEN = "<";
const TAG_CLOSE = "/";
const URL_OPEN = "[";
const URL_CLOSE = "]";
const LINK_TAG  = "a";

export const processTranslation = (translation: string, args?: { [key: string]: string }): React.ReactNode => {
    // TODO: nested tagsdon't seem to work extreamly well (<b>meow <i>meow2</i></b>)
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
                    <TagComponent {...b}>
                        {temp.map((x: ReactElement) => React.cloneElement(x))}
                    </TagComponent>
                );
                temp.length = 0;

                openTagsCount ? temp.push(wrappedContent) : result.push(wrappedContent);

                ind += 2;
            } else {
                ++openTagsCount;

                let url = "";
                if (nextChar === LINK_TAG) {
                    if (translation[++ind] !== URL_OPEN) {
                        throw new Error("INVALID_LINK_TAG");
                    }

                    while (translation[++ind] !== URL_CLOSE) {
                        url += translation[ind];
                    }
                }

                stack.push({ tag: nextChar, url });
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
        case "a":
            // TODO: figure out url? later
            return Link;
        default:
            throw new Error("INVALID_TAG");
    }
}
