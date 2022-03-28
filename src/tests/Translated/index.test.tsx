import { render } from "@testing-library/react";
import Translated from "../../components/Translated";

const b = () => `span class="font-bold"`;
const i = () => `span class="italic"`;
const a = (url: string) => `a target="_blank" class="text-blue-500 underline" href="${url}"`;

describe("Translated", () => {
    describe("Happy path", () => {
        it("plain string", () => {
            const { container } = render(<Translated text={"plain text"} />);
            expect(container.innerHTML).toStrictEqual("plain text");
        });

        it("bold", () => {
            const translation = "<b>bold</b>";
            const expected = `<${b()}>bold</span>`;

            const { container } = render(<Translated text={translation} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });

        it("italic", () => {
            const translation = "<i>italic</i>";
            const expected = `<${i()}>italic</span>`;

            const { container } = render(<Translated text={translation} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });

        it("link", () => {
            const translation = "<a[http://google.com]>G</a>";
            const expected = `<${a("http://google.com")}>G</a>`;

            const { container } = render(<Translated text={translation} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });

        it("placeholders", () => {
            const translation = "{determiner} {foxAdj} fox {foxAction} the {dogAdj} dog";
            const expected = `The quick brown fox jumps over the lazy dog`;
            const args = {
                foxAdj: "quick brown",
                dogAdj: "lazy",
                foxAction: "jumps over",
                determiner: "The"
            };

            const { container } = render(<Translated text={translation} args={args} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });

        it("link with placeholder href", () => {
            const translation = "<a[{googleUrl}]>G</a>oogle";
            const expected = `<${a("http://google.com")}>G</a>oogle`;
            const args = {
                googleUrl: "http://google.com",
            };

            const { container } = render(<Translated text={translation} args={args} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });

        describe("Nested tags", () => {
            it("variation 1", ()  => {
                const translation = "Writing tests is <b>very <i>important</i></b>";
                const expected = `Writing tests is <${b()}>very <${i()}>important</span></span>`;

                const { container } = render(<Translated text={translation} />);
                expect(container.innerHTML).toStrictEqual(expected);
            });

            it("variation 2", ()  => {
                const url = "https://www.codingame.com/multiplayer/clashofcode";
                const translation = `click <b><a[${url}]>HERE</a></b> to have some <i>fun</i>`;
                const expected = `click <${b()}><${a(url)}>HERE</a></span> to have some <${i()}>fun</span>`;

                const { container } = render(<Translated text={translation} />);
                expect(container.innerHTML).toStrictEqual(expected);
            });

            it("variation 3", ()  => {
                const url = "https://www.youtube.com/watch?v=dHpHxA-9CVM";
                const translation = `<b><i><a[${url}]>THIS</a> must be</i> listened</b> to`;
                const expected = `<${b()}><${i()}><${a(url)}>THIS</a> must be</span> listened</span> to`;

                const { container } = render(<Translated text={translation} />);
                expect(container.innerHTML).toStrictEqual(expected);
            });

            it("variation 4", ()  => {
                const url = "https://www.youtube.com/watch?v=4VR-6AS0-l4";
                const translation = `<i>I</i> <b><i>must</i> admit</b> <a[${url}]>I'm <i>running {out}</i> of</a> original {what}`;
                const expected = `<${i()}>I</span> <${b()}><${i()}>must</span> admit</span> <${a(url)}>I'm <${i()}>running out</span> of</a> original test cases`;
                const args = {
                    what: "test cases",
                    out: "out",
                    url
                };

                const { container } = render(<Translated text={translation} args={args} />);
                expect(container.innerHTML).toStrictEqual(expected);
            });
        });
    });

    describe("Not-so-happy path", () => {
        describe("should thrown when", () => {
            it("closing tag without having an open one", () => {
                expect(
                    () => render(<Translated text={"plain</i> text"} />)
                ).toThrowError("INVALID_TRANSLATION_STRING");
            });

            it("opening tag without having a close one", () => {
                expect(
                    () => render(<Translated text={"plain<i> text"} />)
                ).toThrowError("INVALID_TRANSLATION_STRING");
            });

            it("args are not provided for a translation with placeholers", () => {
                expect(
                    () => render(<Translated text={"plain {text}"} />)
                ).toThrowError("MISSING_ARGS");
            });

            it("a placeholder arg is missing", () => {
                expect(
                    () => render(<Translated text={"plain {text}"} args={{}} />)
                ).toThrowError("MISSING_ARG: text");
            });

            it("an invalid tag is passed", () => {
                expect(
                    () => render(<Translated text={"plain <t>text</t>"} />)
                ).toThrowError("INVALID_TAG");
            });

            it("anchor tag is missing a url", () => {
                expect(
                    () => render(<Translated text={"<a>MISSING URL</a>"} />)
                ).toThrowError("INVALID_LINK_TAG");
            });
        });
    });
});