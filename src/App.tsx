import React from "react";
import { v4 } from "uuid";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            <div className="m-20 flex flex-col space-y-5">
                <div>
                    <Translated text="0 <i>A<b>B</b> {meow}</i> <a[{googleUrl}]> <b>der</b> <i>Katter</i> </a>" args={{ meow: "me-ow", googleUrl: "http://google.com" }} />
                </div>
                <div>
                    <Translated text="<a[{url}]>Pretty Piano Pieces</a>" args={{ meow: "me-ow", url: "https://www.youtube.com/watch?v=WJ3-F02-F_Y" }} />
                </div>
                <div>
                    <Translated text="<b>bold</b>" />
                </div>
                <div>
                    <Translated text="a" />
                </div>
                <div>
                    <Translated
                        text="kotak <i><b>Mish Mish</b></i> <a[http://google.com]><b>der</b> <i>Katter</i> (male cat)</a> <b>purr <i>{meow}</i></b> hello hello"
                        args={{ meow: "me-ow" }}
                    />
                </div>
            </div>
        </header>
    </div>
);

export default App;
