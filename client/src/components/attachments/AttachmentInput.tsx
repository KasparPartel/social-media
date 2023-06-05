import { toBase64 } from "../../additional-functions/images"
import attachmentIcon from "../../assets/attachment_icon.svg"

interface PostAttachmentsProps {
    setFileLoading: React.Dispatch<React.SetStateAction<boolean>>
    setAttachmentData: React.Dispatch<
        React.SetStateAction<
            {
                name: string
                value: string
            }[]
        >
    >
    children?: React.ReactNode
}

export function AttachmentInput({
    setFileLoading,
    setAttachmentData,
    children,
}: PostAttachmentsProps) {
    return (
        <label className="post-form__attachment-label">
            <img className="post-form__attachment-img" src={attachmentIcon} alt="attachment" />
            <input
                onChange={(e) => {
                    setFileLoading(true)
                    handleAddAttachment(e, setAttachmentData, setFileLoading)
                }}
                type="file"
                multiple
                accept="image/jpeg, image/png, image/gif"
                name="attachments"
                hidden
            />
            {children}
        </label>
    )
}

function handleAddAttachment(
    e: React.ChangeEvent<HTMLInputElement>,
    setAttachmentData: React.Dispatch<
        React.SetStateAction<
            {
                name: string
                value: string
            }[]
        >
    >,
    setFileLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
    for (let i = 0; i < e.target.files.length; i++) {
        toBase64(e.target.files[i]).then((data) => {
            setAttachmentData((prevValues) => [
                ...prevValues,
                { name: e.target.files[i].name, value: data },
            ])
            setFileLoading(false)
        })
    }
}
