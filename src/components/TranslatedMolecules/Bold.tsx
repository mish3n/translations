import withUuidKey from "../../utils/withUuidKey";

const Bold: React.FC = ({ children }) => {
    return (
        <span className="font-bold">{children}</span>
    );
}

export default withUuidKey(Bold);
