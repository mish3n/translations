import React, { useMemo } from "react";
import { processTranslation } from "../../utils/translations";

interface Props {
    text: string;
    args?: { [key:string]: string }
}

const Translated: React.FC<Props> = ({ text, args }) => {
    const processedTranslation = useMemo(() => processTranslation(text, args), [text, args]);

    return <React.Fragment key={"meow"}>{processedTranslation}</React.Fragment>;
}

export default Translated;
