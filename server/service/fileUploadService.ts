import fs from 'fs'
import fileRepo from '../repository/FileRepo'
import fileSessionService from './FileSessionService'

interface FileData {
    file: Express.Multer.File,
    fileSessionId: number,
    fileName: string,
    isLastBlock: boolean
}

class FileUploadService
{
    private fileData: FileData

    constructor(fileData: FileData) {
        this.fileData = fileData
    }

    async writeFileData(): Promise<{ success: boolean, fileId?: number }> {
        const fileStreamResponse = await this.writeToFileStream()

        if (fileStreamResponse === false) {
            return {
                success: false
            }
        }

        let fileId = 0

        if (this.fileData.isLastBlock) {
            fileId = await this.createFileRecord()
        }

        return {
            success: true,
            fileId
        }
    }

    private async writeToFileStream(): Promise<boolean> {
        return await new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(
                `${__dirname}/../img/${this.fileData.fileName}`,
                {
                    flags: 'a'
                } 
            )
    
            fileStream.write(this.fileData.file.buffer, 'base64')
    
            fileStream.on('error', () => {
                console.log('error occurred while writing to stream')
                reject(false)
            })

            fileStream.on('finish', () => resolve(true))
            
            fileStream.end()
        })
    }

    private async createFileRecord(): Promise<number> {
        const fileDetails = await fileSessionService.findFileSessionDetails(this.fileData.fileSessionId, this.fileData.fileName)

        if (fileDetails === false) {
            return 0
        }

        return await fileRepo.createFileRecord({
            fileExtension: fileDetails.fileExtension,
            fileSize: fileDetails.fileSize,
            originalFileName: fileDetails.originalFileName,
            uniqueFileName: fileDetails.uniqueFileName
        })
        
    }
}

export default FileUploadService