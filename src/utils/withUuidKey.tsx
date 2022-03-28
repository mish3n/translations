import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

const withUuidKey = (Component: React.FC): React.FC<any> => {
    return ({ children, props }) => {
        const key = useMemo(() => uuidv4(), [Component]);

        return (
            <Component {...props} key={key}>
                {children}
            </Component>
        );
    }
}

export default withUuidKey;
