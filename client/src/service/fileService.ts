interface UploadFileResponse {
    success: boolean,
    message: string,
    progress: number,
    uploadNextBlock: boolean,
    fileId?: number
}

class FileService 
{
    private file: File
    private fileSessionId: number = 0
    private fileName: string = ''
    private totalFileBlocks: number = 0
    private maxFileBlockSize: number = 20971520
    private fileBlockCount: number = 0

    private startBlock: number = 0
    private endBlock: number = 0

    constructor(file: File) {
        this.file = file
        this.setTotalFileBlocks()
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.')

        if (fileNames.length === 0) {
            return ''
        }

        return fileNames[fileNames.length - 1]
    }

    private setTotalFileBlocks() {
        this.totalFileBlocks = Math.ceil((this.file.size / this.maxFileBlockSize))
    }

    async createFileUploadSession(): Promise<{ success: boolean, message?: string }> {
        const fileSessionResponse = await fetch('http://localhost:5000/createFileUploadSession', {
            method: 'POST',
            body: this.getFileSessionDetails()
        })

        const responseJson = await fileSessionResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message
            }
        }

        this.fileSessionId = responseJson.fileSessionId
        this.fileName = responseJson.fileName

        return {
            success: true
        }
    }

    async uploadFile(): Promise<UploadFileResponse> {
        const uploadResponse = await fetch('http://localhost:5000/uploadFile', {
            method: 'POST',
            body: this.getFileData()
        })

        const responseJson = await uploadResponse.json()

        if (responseJson.success === false) {
            return {
                success: false,
                message: responseJson.message,
                progress: 0,
                uploadNextBlock: false
            }
        }

        const uploadFileResponse: UploadFileResponse = {
            success: true,
            message: '',
            progress: this.calculateUploadProgress(),
            uploadNextBlock: !this.isLastBlock()
        }

        if (responseJson.fileId > 0) {
            uploadFileResponse.fileId = responseJson.fileId
            uploadFileResponse.message = 'Uploaded Successfully'
        }

        return uploadFileResponse
    }

    private calculateUploadProgress(): number {
        if (this.totalFileBlocks === 1) {
            return 100
        }

        return Math.round((this.fileBlockCount / this.totalFileBlocks) * 100)
    }

    private getFileSessionDetails(): FormData {
        const formData = new FormData()

        formData.append('fileName', this.file.name)
        formData.append('fileSize', this.file.size.toString())
       
        return formData
    }

    private getFileData(): FormData {
        const formData = new FormData()

        formData.append('file', this.getFileBlock())
        formData.append('fileSessionId', this.fileSessionId.toString())
        formData.append('fileName', this.fileName)
        formData.append('isLastBlock', this.isLastBlock() ? '1' : '0')

        return formData
    }

    private getFileBlock(): Blob {
        this.startBlock = this.endBlock
        this.endBlock = this.endBlock + this.maxFileBlockSize

        const blob = this.file.slice(this.startBlock, this.endBlock)

        this.fileBlockCount += 1

        return blob
    }

    private isLastBlock(): boolean {
        return this.fileBlockCount === this.totalFileBlocks
    }
}

export default FileService