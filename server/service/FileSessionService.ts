import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fileSessionRepo from '../repository/FileSessionRepo'
import FileUploadSession from '../models/FileUploadSession'
let instance: null|FileSessionService = null

class FileSessionService {
    static getInstance(): FileSessionService {
        if (instance === null) {
            instance = new FileSessionService()
        }  
        return instance
    }

    async findFileSessionDetails(fileSessionId: number, fileName: string): Promise<false | FileUploadSession> {
        const fileDetails = await fileSessionRepo.findFileSession(fileSessionId, fileName)

        if (Array.isArray(fileDetails)) {
            return fileDetails[0]
        }

        return false
    }

    async createFileUploadSessionRecord(fileName: string, fileSize: number): Promise<{ fileSessionId: number, uniqueFileName: string}> {
        const fileExtension = this.getFileExtension(fileName)
        const uniqueFileName = this.createUniqueFileName(fileExtension)
        const fileSessionId = await fileSessionRepo.createFileUploadSessionRecord({
            fileExtension,
            fileSize,
            originalFileName: fileName,
            uniqueFileName
        })

        return {
            fileSessionId,
            uniqueFileName
        }
    }

    private getFileExtension(fileName: string): string {
        return path.extname(fileName)
    }

    private createUniqueFileName(fileExtension: string): string {
        const timeStamp = new Date().toISOString().replace(/[-:.TZ]/g, "")
        return `${uuidv4()}_${timeStamp}${fileExtension}`
    }
}

export default FileSessionService.getInstance()