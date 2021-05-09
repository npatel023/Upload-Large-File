export default interface FileUploadSession {
    fileSessionId?: number,
    uniqueFileName: string,
    fileExtension: string,
    fileSize: number,
    originalFileName: string
}