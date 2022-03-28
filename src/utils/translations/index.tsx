import { ReactNode } from "react";

enum State {
    Plain,
    Placeholder
}

export const processTranslation = (translation: string, args?: { [key: string]: string }): React.ReactNode => {
    // "Meow meow <b><i><a[https://www.google.com]>text: {meow}</a></i></b> hello"
    const result: ReactNode[] = [
        "<meow></meow><b><i><a><p>1</p>,<p>2</p></a></i></b> hello"
    ];
    let state = State.Plain;
    let openTagsCounter = 0;
    const stack = [];
    const temp = []
    //if stack ampty - append
    //if !stack.empty - prepend

    //if openTagsCounter === 0, append to result
    //else - append to temp
    for (let ind = 0; ind < translation.length; ind++) {
        /**
         [<>Meow meow <meoww/>, <b>, <i>, <a[url]>, <text/>, <meow/> <hello/>]



         * plain
         <-- <>Meow meow </>
        * b
        <-- <b>
        * openingTag
        * i
        <-- <i>
        * openingTag
        * a
        * opening [
        * read url
        * closing ]
        <-- a
        * closingTag
        * plain
        * {
        * readPlaceholder
        * }
        * clodingTag a
        * closingTag i
        * closing Tag b
        * plain hello
         */
    }

    return <>{result}</>;
}