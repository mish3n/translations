import React from "react";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            {/* Translated: <Translated
                text="kotak <i><b>Andrew McNeill</b></i> <a[http://google.com]><b>der</b> <i>Katter</i></a> <b>purr <i>{meow}</i></b> hello hello"
                args={{ meow: "me-ow" }}
            /> */}
            <span className="m-20">
                <Translated text="0<i>A<b>B</b></i>" />
            </span>
        </header>
    </div>
);

export default App;
