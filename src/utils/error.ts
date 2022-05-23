import { toast } from 'react-toastify';

export const notifyErrors = (errors: any) => {
    if (errors && Array.isArray(errors)) {
        errors.forEach((error: string) => {
            toast.error(error)
        })
    }
}
