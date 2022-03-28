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
const LINK_TAG = "a";

export const processTranslation = (translation: string, args?: { [key: string]: string }): React.ReactNode => {
    const result: ReactNode[] = [];
    const stack: Molecule[] = [];
    const temp: (ReactElement | null)[] = [];

    let openTagsCount = 0;
    let tempString = "";
    for (let ind = 0; ind < translation.length; ind++) {
        const char = translation[ind];
        if (char === TAG_OPEN) {
            if (tempString) {
                openTagsCount ? temp.push(<>{tempString}</>) : result.push(<>{tempString}</>);
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
                const lastStoredTemps: ReactElement[] = [];
                let lastTemp = null;
                do {
                    lastTemp = temp.pop();
                    if (lastTemp) {
                        lastStoredTemps.unshift(lastTemp);
                    }
                } while (lastTemp);

                const wrappedContent = (
                    <TagComponent {...b}>
                        {lastStoredTemps.map(x => React.cloneElement(x))}
                    </TagComponent>
                );

                openTagsCount ? temp.push(wrappedContent) : result.push(wrappedContent);

                ind += 2;
            } else {
                ++openTagsCount;
                temp.push(null);

                let url = "";
                if (nextChar === LINK_TAG) {
                    
                    if (translation[++ind] !== URL_OPEN) {
                        throw new Error("INVALID_LINK_TAG");
                    }

                    if (translation[ind + 1] === PH_OPEN) {
                        ++ind;
                        if (!args) {
                            throw new Error("MISSING_ARGS");
                        }

                        let urlKey = "";
                        while (translation[++ind] !== PH_CLOSE) {
                            urlKey += translation[ind];
                        }
                        url = args[urlKey];
                        if (!url) {
                            throw new Error(`MISSING_ARG: ${urlKey}`);
                        }

                        ++ind;
                    } else {
                        while (translation[++ind] !== URL_CLOSE) {
                            url += translation[ind];
                        }
                    }
                }

                stack.push({ tag: nextChar, url });
                ++ind;
            }

            continue;
        }

        if (char === PH_OPEN) {
            if (!args) {
                throw new Error("MISSING_ARGS");
            }

            if (tempString) {
                openTagsCount ? temp.push(<>{tempString}</>) : result.push(<>{tempString}</>);
                tempString = "";
            }

            let placeholder = "";
            while (translation[++ind] !== PH_CLOSE) {
                placeholder += translation[ind];
            }

            const varValue = args![placeholder];
            if (!varValue) {
                throw new Error(`MISSING_ARG: ${placeholder}`);
            }

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
            return Link;
        default:
            throw new Error("INVALID_TAG");
    }
}
