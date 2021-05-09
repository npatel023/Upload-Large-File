class DocumentFileSizeValidator
{
    private fileSizeInBytes: number
    private maxFileSizeInBytes: number = 2147483648 //2gb

    constructor(fileSize: number) {
        this.fileSizeInBytes = fileSize
    }

    validateFileSize(): boolean {
        return this.fileSizeInBytes <= this.maxFileSizeInBytes
    }

    getErrorMessage(): string {
        return 'Maximum file size accepted is 20MB.'
    }
}

export default DocumentFileSizeValidator