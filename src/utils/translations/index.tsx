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
    for (let ind = 0; ind < translation.length; ind++) {
        const char = translation[ind];
        if (char === TAG_OPEN) {
            if (tempString) {
                pushToCorrectStack(openTagsCount, tempString, nestedStack, result);
                tempString = "";
            }

            const nextChar = translation[++ind];
            if (nextChar === TAG_CLOSE) {
                --openTagsCount;
                ind = handleClosingTag(stack, tempString, nestedStack, openTagsCount, result, ind);
                tempString = "";
            } else {
                ++openTagsCount;
                ind = handleOpeningTag(nestedStack, nextChar, ind, translation, args, stack);
                ++ind;
            }

            continue;
        }

        if (char === PH_OPEN) {
            ind = handlePlaceholder(args, tempString, openTagsCount, nestedStack, result, ind, translation);
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

const readUntil = (char: string) => (translation: string, ind: number, temp: string) => {
    while (translation[++ind] !== char) {
        temp += translation[ind];
    }

    return { ind, temp };
}

const handleOpeningTag = (temp: (React.ReactElement | null)[], nextChar: string, ind: number, translation: string, args: { [key: string]: string; } | undefined, stack: Molecule[]) => {
    temp.push(null);

    let url = "";
    if (nextChar === LINK_TAG) {
        ({ ind, url } = handleLinkTag(translation, ind, args, url));
    }

    stack.push({ tag: nextChar, url });
    return ind;
}

const handleClosingTag = (stack: Molecule[], tempString: string, temp: (React.ReactElement | null)[], openTagsCount: number, result: React.ReactNode[], ind: number) => {
    if (!stack.length) {
        throw new Error("INVALID_TRANSLATION_STRING");
    }

    if (tempString) {
        temp.push(<>{tempString}</>);
    }

    const lastTag = stack.pop();
    const TagComponent = getComponentByTag(lastTag!.tag);
    const lastStoredTemps = getNestedElements(temp);

    const wrappedContent = (
        <TagComponent {...lastTag}>
            {lastStoredTemps.map(x => ({ ...x }))}
        </TagComponent>
    );

    pushToCorrectStack(openTagsCount, wrappedContent, temp, result);
    return ind + 2;
}

const handleLinkTag = (translation: string, ind: number, args: { [key: string]: string; } | undefined, url: string) => {
    if (translation[++ind] !== URL_OPEN) {
        throw new Error("INVALID_LINK_TAG");
    }

    if (translation[ind + 1] === PH_OPEN) {
        ++ind;
        if (!args) {
            throw new Error("MISSING_ARGS");
        }

        let urlKey = "";
        ({ ind, temp: urlKey } = readUntil(PH_CLOSE)(translation, ind, urlKey));
        url = getPlaceholderValue(args, urlKey);

        ++ind;
    } else {
        ({ ind, temp: url } = readUntil(URL_CLOSE)(translation, ind, url));
    }
    return { ind, url };
}

const handlePlaceholder = (args: { [key: string]: string; } | undefined, tempString: string, openTagsCount: number, temp: (React.ReactElement | null)[], result: React.ReactNode[], ind: number, translation: string) => {
    if (!args) {
        throw new Error("MISSING_ARGS");
    }

    if (tempString) {
        pushToCorrectStack(openTagsCount, tempString, temp, result);
    }

    let placeholder = "";
    ({ ind, temp: placeholder } = readUntil(PH_CLOSE)(translation, ind, placeholder));

    const varValue = getPlaceholderValue(args, placeholder);
    pushToCorrectStack(openTagsCount, varValue, temp, result);
    return ind;
}

const getPlaceholderValue = (args: { [key: string]: string; }, placeholder: string) => {
    const varValue = args[placeholder];
    if (!varValue) {
        throw new Error(`MISSING_ARG: ${placeholder}`);
    }
    return varValue;
}

const getNestedElements = (temp: (React.ReactElement | null)[]) => {
    const lastStoredTemps: ReactElement[] = [];
    let lastTemp = null;
    do {
        lastTemp = temp.pop();
        if (lastTemp) {
            lastStoredTemps.unshift(lastTemp);
        }
    } while (lastTemp);
    return lastStoredTemps;
}

function pushToCorrectStack(openTagsCount: number, element: React.ReactElement | string, temp: (React.ReactElement | null)[], result: React.ReactNode[]) {
    openTagsCount ? temp.push(<>{element}</>) : result.push(<>{element}</>);
}
