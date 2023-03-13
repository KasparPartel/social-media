export function labeledParagraph(labelText: string, insideText: string) {
    return (
        <label className="label">
            {labelText}:<p className="label__section">{insideText}</p>
        </label>
    )
}
