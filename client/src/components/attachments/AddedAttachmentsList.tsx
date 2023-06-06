interface AddedAttachmentsListProps {
    attachmentData: {
        name: string
        value: string
    }[]
    setAttachmentData: React.Dispatch<
        React.SetStateAction<
            {
                name: string
                value: string
            }[]
        >
    >
}

export default function AddedAttachmentsList({
    attachmentData,
    setAttachmentData,
}: AddedAttachmentsListProps) {
    return (
        <ul className="post-form__attachment-list">
            {attachmentData &&
                attachmentData.map((file, i) => (
                    <li className="post-form__attachment" key={i}>
                        {file.name} -{" "}
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                handleRemoveAttachment(i, setAttachmentData)
                            }}
                        >
                            remove
                        </span>
                    </li>
                ))}
        </ul>
    )
}

function handleRemoveAttachment(
    i: number,
    setAttachmentData: React.Dispatch<
        React.SetStateAction<
            {
                name: string
                value: string
            }[]
        >
    >,
) {
    setAttachmentData((prevValues) => {
        const arrCopy = [...prevValues]
        arrCopy.splice(i, 1)
        return arrCopy
    })
}
