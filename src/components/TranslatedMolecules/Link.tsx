import withUuidKey from "../../utils/withUuidKey";

interface Props {
    url?: string;
}

const Link: React.FC<Props> = ({ url, children }) => {
    return (
        <a className="text-blue-500 underline" href={url}>{children}</a>
    );
}

export default withUuidKey(Link);
