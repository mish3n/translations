import { render } from "@testing-library/react";
import Translated from "../../components/Translated";
import { TEST_CASES } from "./testCases";

describe("Translated", () => {
    it.each([
        ["simple text", "simple text"]
    ])
        ("processes translation string correctly", (text: string, expected: string, props?: any)  => {
            const { container } = render(<Translated text={text} />);
            expect(container.innerHTML).toStrictEqual(expected);
        });
});