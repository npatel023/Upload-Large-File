interface ValidatorResponse {
    isValid: boolean,
    errorMessage: string
}

const fileTypes = [
    '.jpg',
    '.png',
    '.doc',
    '.docx',
    '.mp4'
]

async function validateFileSize(fileSize: number): Promise<ValidatorResponse> {
    const fileSizeValidator = (await import('../validators/FileSizeValidator')).default

    const validator = new fileSizeValidator(fileSize)
    const isValid = validator.validateFileSize()

    return {
        isValid,
        errorMessage: isValid ? '' : validator.getErrorMessage()
    }
}

async function validateFileType(fileType: string): Promise<ValidatorResponse> {
    const fileTypeValidator = (await import('../validators/FileTypeValidator')).default

    const validator = new fileTypeValidator(fileType, fileTypes)
    const isValid = validator.validateFileType()

    return {
        isValid,
        errorMessage: isValid ? '' : validator.getErrorMessage()
    }
}

async function validateInteger(value: number): Promise<ValidatorResponse> {
    const integerValidator = (await import('../validators/IntegerGreaterThanZero')).default

    const validator = new integerValidator(value)
    const isValid = validator.validate()

    return {
        isValid,
        errorMessage: isValid ? '' : validator.getErrorMessage()
    }
}

async function validateUniqueFileName(fileName: string): Promise<ValidatorResponse> {
    const fileNameValidator = (await import('../validators/UniqueFileNameValidator')).default

    const validator = new fileNameValidator(fileName)
    const isValid = validator.validate()

    return {
        isValid,
        errorMessage: isValid ? '' : validator.getErrorMessage()
    }
}

export {
    validateFileSize,
    validateFileType,
    validateInteger,
    validateUniqueFileName
}