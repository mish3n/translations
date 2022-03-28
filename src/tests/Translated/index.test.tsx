import { render } from "@testing-library/react";
import Translated from "../../components/Translated";
import { TEST_CASES } from "./testCases";

describe("Translated", () => {
    it.each(TEST_CASES)("processes translation string correctly: %s", (text: string, expected: string, props?: any)  => {
        const { container } = render(<Translated {...props} text={text} />);
        expect(container.innerHTML).toStrictEqual(expected);
    });
});