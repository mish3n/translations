interface Props {
    url: string;
}

const Link: React.FC<Props> = ({ url, children }) => {
    return (
        <a href={url}>{children}</a>
    );
}

export default Link;
