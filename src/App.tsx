import React from "react";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            Translated: <Translated
                text="kotak <i><b>Andrew McNeill</b></i> der Katter <b><i>purr {meow}</i></b> hello hello"
                args={{ meow: "me-ow" }}
            />
        </header>
    </div>
);

export default App;
