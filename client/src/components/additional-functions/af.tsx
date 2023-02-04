import { RegistrationFormFields, LoginFormFields, AdditionalInfoFormFields, Response, RequestProps } from '../models'

export function ImageUpload(e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<any>) {
    if (!e.target.files) return
    setImage(e.target.files[0])
}

export function formDataExtractor(formData: FormData, formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields) {
    formData.forEach((value, key) => {
        if (key in formFields) {
            formFields[key] = value
        }
    });
}

export function LoginRequest({ e, setErrorArr, setId, navigate }: RequestProps) {
    e.preventDefault()

    let formFields: LoginFormFields = {
        login: "",
        password: ""
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    formFetchHandler(`http://localhost:8080/login`, 'POST', formFields).then((response: Response) => {
        if (response.errors && response.errors.length != 0) { setErrorArr(response.errors); return }
        if (response.data === null) { navigate('/internal-error'); return }
        setId(response.data.id)
        navigate('/main')
    })
}

export function RegistrationRequest({ e, setErrorArr, setId, navigate }: RequestProps) {
    e.preventDefault()
    let formFields: RegistrationFormFields = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: 0,
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)
    formFields.dateOfBirth = new Date(formFields.dateOfBirth).getTime()

    formFetchHandler(`http://localhost:8080/register`, 'POST', formFields).then((response: Response) => {
        if (response.errors && response.errors.length != 0) { setErrorArr(response.errors); return }
        if (response.data === null) { navigate('/internal-error'); return }
        setId(response.data.id)
        navigate('/additional-registration')
    })
}

const updateImage = async (formFields, image) => {
    if (image === null) {
        formFields.avatar = ""
        return
    }
    await toBase64(image)
        .then((r) => {
            formFields.avatar = r
        })
}

export function AdditionalInfoRequest({ e, id, navigate, image }: RequestProps) {
    e.preventDefault()
    let formFields: AdditionalInfoFormFields = {
        avatar: "",
        login: "",
        aboutMe: ""
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)

    updateImage(formFields, image).then(() => {
        formFetchHandler(`http://localhost:8080/user/${id}`, 'PUT', formFields)
            .then((response) => {
                if (response === null) navigate('/main')
            })
            .catch(() => navigate('/internal-error'))
    })
}

async function toBase64(file: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = error => reject(error);
    })
}

async function formFetchHandler(inputURL: string, method: string, formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields): Promise<Response | null> {
    return fetch(inputURL, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formFields)
    })
        .then((r) => {
            if (r.headers.has('content-type') && r.headers.get('content-type') === 'application/json') { return r.json() }
            else return null
        })
}