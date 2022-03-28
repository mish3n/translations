import React from "react";
import { v4 } from "uuid";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            {/* Translated: <Translated
                text="kotak <i><b>Andrew McNeill</b></i> <a[http://google.com]><b>der</b> <i>Katter</i></a> <b>purr <i>{meow}</i></b> hello hello"
                args={{ meow: "me-ow" }}
            /> */}
            <div className="m-20">
                {/* <Translated text="0 <i>A<b>B</b> {meow}</i> <a[{googleUrl}]> <b>der</b> <i>Katter</i> </a>" args={{ meow: "me-ow", googleUrl: "http://google.com" }} /> */}
                <br />
                {/* <Translated text="<a[{googleUrl}]>G</a>" args={{ meow: "me-ow", googleUrl: "http://google.com" }} /> */}
                <br />
                {/* <Translated text="<b>bold</b>" /> */}
                <Translated key={v4()} text="a" />
            </div>
        </header>
    </div>
);

export default App;
