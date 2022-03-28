import React from "react";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            Translated: <Translated
                text="<b><i><a[https://www.google.com]>{meow}</a></i></b>"
                args={{ meow: "me-ow" }}
            />
        </header>
    </div>
);

export default App;
