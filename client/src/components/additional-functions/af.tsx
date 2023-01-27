import { RegistrationFormFields, LoginFormFields, AdditionalInfoFormFields, ErrorResponse, Response, FormProps } from '../models'

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

export function LoginRequest(e: React.FormEvent<HTMLFormElement>, setErrorArr: React.Dispatch<React.SetStateAction<ErrorResponse[]>>, setId) {
    e.preventDefault()

    let formFields: LoginFormFields = {
        login: "",
        password: ""
    }


    formDataExtractor(new FormData(e.currentTarget), formFields)

    formFetchHandler(`http://localhost:8080/login`, 'POST', formFields).then((response: Response) => {
        if (response.errors && response.errors.length != 0) { setErrorArr(response.errors); return }
        if (response.data != null) { setId(response.data.id); return }
    })
}

export function RegistrationRequest(e: React.FormEvent<HTMLFormElement>, { setViewExtention }: FormProps, setErrorArr: React.Dispatch<React.SetStateAction<ErrorResponse[]>>, setId) {
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
        if (response.data === null) { return }
        setId(response.data.id)
        setViewExtention(2)
    })
}

export function AdditionalInfoRequest(e: React.FormEvent<HTMLFormElement>, setErrorArr, id) {
    e.preventDefault()
    let formFields: AdditionalInfoFormFields = {
        avatar: "",
        login: "",
        aboutMe: ""
    }

    formDataExtractor(new FormData(e.currentTarget), formFields)
    toBase64(e.currentTarget.avatar.files[0])
        .then((r) => formFields.avatar = r)
        .then(() => {
            formFetchHandler(`http://localhost:8080/user/${id}`, 'PUT', formFields).then((response: Response) => {
                if (response.errors && response.errors.length != 0) { setErrorArr(response.errors); return }
                SkipToMainPage()
            })
        })
}

async function toBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = error => reject(error);
    })
}

async function formFetchHandler(inputURL: string, method: string, formFields: LoginFormFields | RegistrationFormFields | AdditionalInfoFormFields): Promise<Response> {
    return fetch(inputURL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formFields)
    })
        .then((r) => r.json())
}

export function SkipToMainPage() {
    alert("main page")
}

