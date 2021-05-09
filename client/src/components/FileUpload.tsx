import { SyntheticEvent, useState } from 'react'

import {
    Box,
    Text,
    Flex,
    Button,
    Input,
    createStandaloneToast,
    CircularProgress,
    CircularProgressLabel
} from '@chakra-ui/react'

import AcceptedFileTypesModal from './AcceptedFileTypesModal'
import { validateFileSize, validateFileType } from '../service/fileValidatorService'
import FileService from '../service/fileService'

function FileUpload() {
    const [isFileTypesModalOpen, setIsFilesTypeModalOpen] = useState<boolean>(false)
    const [uploadFormError, setUploadFormError] = useState<string>('')
    const [fileUploadPercentage, setFileUploadPercentage] = useState<number | undefined>(undefined)

    const handleFileUpload = async (element: HTMLInputElement) => {
        const file = element.files

        if (!file) {
            return
        }

        const validFileSize = await validateFileSize(file[0].size)
        const validFileType = await validateFileType(FileService.getFileExtension(file[0].name))

        if (!validFileSize.isValid) {
            setUploadFormError(validFileSize.errorMessage)
            element.value = ''
            return
        }

        if (!validFileType.isValid) {
            setUploadFormError(validFileType.errorMessage)
            element.value = ''
            return
        }

        if (uploadFormError && validFileSize.isValid) {
            setUploadFormError('')
        }

        const fileService = new FileService(file[0])
        const fileSessionDetails = await fileService.createFileUploadSession()

        if (fileSessionDetails.success === false) {
            setUploadFormError(fileSessionDetails.message ?? 'Error uploading file')
            element.value = ''
            return
        }

        const uploadFile = async () => {
            return fileService.uploadFile()
                .then(response => {
                    if (response.success === false) {
                        setUploadFormError(response.message)
                        setFileUploadPercentage(undefined)
                        element.value = ''
                        return Promise.reject(false)
                    }
                    

                    setFileUploadPercentage(response.progress)

                    if (response.uploadNextBlock) {
                        uploadFile()
                    } else {
                        setFileUploadPercentage(undefined)
                        element.value = ''
                        const toast = createStandaloneToast()

                        toast({
                            title: response.success ? 'File Uploaded' : 'Upload Failed',
                            description: response.message,
                            status: response.success ? 'success' : 'error',
                            duration: 3000,
                            isClosable: true
                        })
                        return Promise.resolve(response)
                    }
                })
        }

        uploadFile()
        .catch((error) => {
            console.log(error)
            setUploadFormError('Error occurred uploading the file')
            element.value = ''
        })
    }

    return (
        <Box
            width="50%"
            m="100px auto"
            padding="2"
            shadow="base"
        >
            <Flex
                direction="column"
                alignItems="center"
                mb="5"
            >
                <Text fontSize="2xl" mb="4">Upload a Document</Text>
                <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => setIsFilesTypeModalOpen(true)}
                >
                    Accepted File Types
                </Button>
                {
                    uploadFormError &&
                    <Text mt="5" color="red">{uploadFormError}</Text>
                }
                <Box
                    mt="10"
                    ml="24"
                >
                    <Input
                        type="file"
                        variant="unstyled"
                        onChange={(e: SyntheticEvent) => handleFileUpload(e.currentTarget as HTMLInputElement)}
                    />
                </Box>
                {
                    typeof (fileUploadPercentage) === "number" &&
                    <Box mt="10">
                        <CircularProgress value={fileUploadPercentage} color="green.400">
                            <CircularProgressLabel>{`${fileUploadPercentage}%`}</CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                }

            </Flex>
            <AcceptedFileTypesModal
                isOpen={isFileTypesModalOpen}
                onClose={() => setIsFilesTypeModalOpen(false)}
            />
        </Box>
    )
}

export default FileUpload