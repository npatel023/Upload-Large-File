import connection from '../db'
import FileUploadSession from '../models/FileUploadSession'
let instance: null|FileSessionRepo = null

class FileSessionRepo {
    static getInstance() {
        if (instance === null) {
            instance = new FileSessionRepo()
        }
        return instance
    }

    async createFileUploadSessionRecord(fileDetails: FileUploadSession): Promise<number> {
        try {
            return await new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO file_upload_session (original_file_name, unique_file_name, file_extension, file_size) VALUES (?, ?, ?, ?)',
                    [
                        fileDetails.originalFileName,
                        fileDetails.uniqueFileName,
                        fileDetails.fileExtension,
                        fileDetails.fileSize
                    ],
                    (error, result) => {
                        if (error) {
                            console.log(error.message)
                            reject(0)
                        }
                        resolve(result.insertId)
                    }
                )
            })
        } catch(error) {
            console.log(error)
            return 0
        }
    }

    async findFileSession(fileSessionId: number, fileName: string): Promise<Array<FileUploadSession> | false> {
        try {
            const selects = [
                'unique_file_name AS uniqueFileName',
                'file_extension AS fileExtension',
                'file_size AS fileSize',
                'original_file_name AS originalFileName' 
            ]
            return await new Promise((resolve, reject) => {
                connection.query(
                    `SELECT ${selects.join(',')} FROM file_upload_session WHERE file_session_id = ? AND unique_file_name = ?`,
                    [
                        fileSessionId,
                        fileName
                    ],
                    (error, results) => {
                        if (error) {
                            reject(new Error(error.message))
                        }
                        resolve(results)
                    }
                )
            })
        } catch(error) {
            console.log(error)
            return false
        }
    }
}

export default FileSessionRepo.getInstance()