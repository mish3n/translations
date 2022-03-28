import withUuidKey from "../../utils/withUuidKey";

const Italic: React.FC = ({ children }) => {
    return (
        <span className="italic">{children}</span>
    );
}

export default withUuidKey(Italic);
