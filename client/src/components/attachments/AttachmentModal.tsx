interface AttachmentModalProps {
    src: string
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AttachmentModal({ src, setIsModalOpen }: AttachmentModalProps) {
    return (
        <dialog className="attachment_modal">
            <img src={src} alt="attachment modal" />
            <button onClick={() => setIsModalOpen(false)} className="close-modal__btn">
                X
            </button>
        </dialog>
    )
}
