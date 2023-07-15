interface labeledParagraphProps {
    labelText: string
    insideText: string
}

export default function LabeledParagraph({ labelText, insideText }: labeledParagraphProps) {
    if (!insideText) return null

    return (
        <label className="label">
            {labelText}:<p className="label__section">{insideText}</p>
        </label>
    )
}
