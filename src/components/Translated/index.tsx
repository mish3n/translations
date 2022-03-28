import { useMemo } from "react";
import { processTranslation } from "../../utils/translations";

interface Props {
    text: string;
}

const Translated: React.FC<Props> = ({ text }) => {
    const processedTranslation = useMemo(() => processTranslation(text), [text]);

    return <>{processedTranslation}</>;
}

export default Translated;
