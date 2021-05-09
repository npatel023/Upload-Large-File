class FileSizeValidator
{
    private fileSizeInBytes: Number
    private maxFileSizeInBytes: Number = 2147483648 //2gb

    constructor(fileSize: Number) {
        this.fileSizeInBytes = fileSize
    }

    validateFileSize(): boolean {
        return this.fileSizeInBytes <= this.maxFileSizeInBytes
    }

    getErrorMessage(): string {
        return 'Maximum file size accepted is 2GB.'
    }
}

export default FileSizeValidator