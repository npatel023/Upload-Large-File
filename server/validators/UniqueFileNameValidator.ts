import { validate, version } from 'uuid'

class uniqueFileNameValidator {
    private fileName: string

    constructor(fileName: string) {
        this.fileName = fileName
    }

    validate(): boolean {
        const fileName = this.fileName.split('_')[0]
        return validate(fileName) && version(fileName) === 4
    }

    getErrorMessage(): string {
        return 'Invalid unique file name'
    }
}

export default uniqueFileNameValidator