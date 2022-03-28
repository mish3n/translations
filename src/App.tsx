import React from "react";
import Translated from "./components/Translated";

const App: React.FC = () => (
    <div className="App">
        <header className="App-header">
            <Translated text="<b><i><a[https://www.google.com]>meow</a></i></b>" />
        </header>
    </div>
);

export default App;
