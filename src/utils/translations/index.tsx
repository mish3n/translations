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
    const nestedStack: (ReactElement | null)[] = [];
    let openTagsCount = 0;
    let tempString = "";

    const readUntil = (char: string) => (ind: number, temp: string) => {
        while (translation[++ind] !== char) {
            temp += translation[ind];
        }

        return { ind, temp };
    }

    const handleOpeningTag = (nextChar: string, ind: number) => {
        nestedStack.push(null);

        let url = "";
        if (nextChar === LINK_TAG) {
            ({ ind, url } = handleLinkTag(ind, url));
        }

        stack.push({ tag: nextChar, url });
        return ind;
    }

    const handleClosingTag = (tempString: string, ind: number) => {
        if (!stack.length) {
            throw new Error("INVALID_TRANSLATION_STRING");
        }

        if (tempString) {
            nestedStack.push(<>{tempString}</>);
        }

        const lastTag = stack.pop();
        const TagComponent = getComponentByTag(lastTag!.tag);
        const lastStoredTemps = getNestedElements();

        const wrappedContent = (
            <TagComponent {...lastTag}>
                {lastStoredTemps.map(x => ({ ...x }))}
            </TagComponent>
        );

        pushToCorrectStack(wrappedContent);
        return ind + 2;
    }

    const handleLinkTag = (ind: number, url: string) => {
        if (translation[++ind] !== URL_OPEN) {
            throw new Error("INVALID_LINK_TAG");
        }

        if (translation[ind + 1] === PH_OPEN) {
            ++ind;
            if (!args) {
                throw new Error("MISSING_ARGS");
            }

            let urlKey = "";
            ({ ind, temp: urlKey } = readUntil(PH_CLOSE)(ind, urlKey));
            url = getPlaceholderValue(urlKey);

            ++ind;
        } else {
            ({ ind, temp: url } = readUntil(URL_CLOSE)(ind, url));
        }
        return { ind, url };
    }

    const handlePlaceholder = (tempString: string, ind: number) => {
        if (!args) {
            throw new Error("MISSING_ARGS");
        }

        if (tempString) {
            pushToCorrectStack(tempString);
        }

        let placeholder = "";
        ({ ind, temp: placeholder } = readUntil(PH_CLOSE)(ind, placeholder));

        const varValue = getPlaceholderValue(placeholder);
        pushToCorrectStack(varValue);
        return ind;
    }

    const getPlaceholderValue = (key: string) => {
        const varValue = args![key];
        if (!varValue) {
            throw new Error(`MISSING_ARG: ${key}`);
        }
        return varValue;
    }

    const getNestedElements = () => {
        const lastStoredTemps: ReactElement[] = [];
        let lastTemp = null;
        do {
            lastTemp = nestedStack.pop();
            if (lastTemp) {
                lastStoredTemps.unshift(lastTemp);
            }
        } while (lastTemp);
        return lastStoredTemps;
    }

    const pushToCorrectStack = (element: React.ReactElement | string) => {
        openTagsCount ? nestedStack.push(<>{element}</>) : result.push(<>{element}</>);
    }

    for (let ind = 0; ind < translation.length; ind++) {
        const char = translation[ind];
        if (char === TAG_OPEN) {
            if (tempString) {
                pushToCorrectStack(tempString);
                tempString = "";
            }

            const nextChar = translation[++ind];
            if (nextChar === TAG_CLOSE) {
                --openTagsCount;
                ind = handleClosingTag(tempString, ind);
                tempString = "";
            } else {
                ++openTagsCount;
                ind = handleOpeningTag(nextChar, ind);
                ++ind;
            }

            continue;
        }

        if (char === PH_OPEN) {
            ind = handlePlaceholder(tempString, ind);
            tempString = "";
            continue;
        }

        tempString += char;
    }

    if (openTagsCount) {
        throw new Error("INVALID_TRANSLATION_STRING");
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
