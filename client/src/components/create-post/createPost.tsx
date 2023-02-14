import { useState } from "react"

export default function CreatePost() {
    const [modalOpen, setModalOpen] = useState(false)

    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <>
            {modalOpen ? (
                <Modal toggleModal={toggleModal} />
            ) : (
                <button onClick={() => setModalOpen(!modalOpen)}>Create post</button>
            )}
        </>
    )
}

interface ModalProps {
    toggleModal: () => void
}

interface Post {
    text: string
    attachments: string[]
    privacy: 0 | 1 | 2
    authorizedFollowers: number[]
}

function Modal({ toggleModal }: ModalProps) {
    // const [post, setPost] = useState<Post>()
    // const [attachments, setAttachments] = useState<string[]>([])

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        toggleModal()
    }

    // const handleAddAttachment = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     e.preventDefault()
    //     setAttachments((prevState) => setAttachments([...prevState, e.t]))
    // }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formElements = form.elements
        console.log(formElements)
    }

    return (
        <div>
            <button onClick={(e) => handleClose(e)}>close</button>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="body">Body: </label>
                <input type="text" name="body" />
                <br />
                {/*<button onClick={(e) => handleAddAttachment(e)}>Add attachment</button>*/}
                <input type="file" name="attachment" id="attachment" />
                <br />
                <label htmlFor="privacy">Choose privacy: </label>
                <br />
                <select name="privacy">
                    <option value="0">Public</option>
                    <option value="1">Semi</option>
                    <option value="2">Private</option>
                </select>
                <br />
                <button>Save</button>
            </form>
        </div>
    )
}
