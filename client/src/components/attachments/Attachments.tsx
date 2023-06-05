import "./attachments.css"
import { useState } from "react"
import AttachmentModal from "./AttachmentModal"

interface AttachmentProps {
    src: string
}

export function Attachment({ src }: AttachmentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <img
                className="post__attachment"
                src={src}
                alt="attachment"
                onClick={() => setIsModalOpen(true)}
            />
            {isModalOpen && <AttachmentModal src={src} setIsModalOpen={setIsModalOpen} />}
        </>
    )
}

interface AttachmentsListProps {
    data: string[]
    text?: string
}

export function AttachmentsList({ data, text }: AttachmentsListProps) {
    return (
        <section className="attachments-list">
            {data.slice(text ? 0 : 1).map((src, i) => (
                <Attachment key={i} src={src} />
            ))}
        </section>
    )
}

interface AttachmentsTogglerProps {
    onClick: () => void
    isOpen: boolean
    attachmentsCount: number
    text?: string
}

export function AttachmentsToggler({
    isOpen,
    attachmentsCount,
    onClick,
    text,
}: AttachmentsTogglerProps) {
    return (
        <p className="post__attachments-toggler" onClick={onClick}>
            {isOpen
                ? "Show less"
                : `Show ${text ? attachmentsCount : attachmentsCount - 1} more attachment${
                      attachmentsCount > 1 ? "s" : ""
                  }`}
        </p>
    )
}
