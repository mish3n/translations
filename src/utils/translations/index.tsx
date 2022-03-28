import { ReactNode } from "react";

enum MoleculeType {
    Plain,
    Bold,
    Link,
    Italic
}

interface Molecule {
    type: MoleculeType;
    value: string;
    url?: string;
}

const PH_OPEN = "{";
const PH_CLOSE = "}";

export const processTranslation = (translation: string, args?: { [key: string]: string }): React.ReactNode => {
    // "Meow meow <b><i><a[https://www.google.com]>text: {meow}</a></i></b> hello"
    const result: ReactNode[] = [];
    const stack: Molecule[] = [];
    const temp: ReactNode[] = [];

    let openTagsCount = 0;
    let tempString = "";
    for (let ind = 0; ind < translation.length; ind++) {
        const char = translation[ind];
        if (char === PH_OPEN) {
            if (tempString) {
                result.push(<>{tempString}</>);
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
            result.push(<>{varValue}</>);
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
