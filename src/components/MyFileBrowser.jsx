import React, { useState, useEffect } from 'react';
import { FullFileBrowser, ChonkyActions, defineFileAction, ChonkyIconName } from 'chonky';
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import {getfiles, downloadFile, uploadFile, deleteFile} from "../api/files.js"
import { useAuth } from '../context/authContext.jsx';
import { useTasks } from '../context/TasksContext.jsx';

// Define la acción para descargar archivos
const DownloadFilesAction = defineFileAction({
    id: 'download_files',
    requiresSelection: true,
    hotkeys: ['ctrl+d'],
    button: {
        name: 'Download Files',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.download,
    },
});

const UploadFilesAction = defineFileAction({
    id: 'upload_files',
    requiresSelection: false,
    hotkeys: ['ctrl+u'],
    button: {
        name: 'Upload Files',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.upload,
    },
});

const DeleteFilesAction = defineFileAction({
    id: 'delete_files',
    requiresSelection: true,
    hotkeys: ['Delete'],
    button: {
        name: 'Delete Files',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.trash,
    },
});

export const MyFileBrowser = ({ open, onClose, taskId, registro }) => {

    const [files, setFiles] = useState([]);
    const {user} = useAuth();
    const {tasks} = useTasks();
    const memberID = user.MemberId
    const taskID = taskId
    const registroID = registro
    console.log(memberID, taskID, registroID)

    const myFileActions = [
        DownloadFilesAction,
        //uploadFilesAction,
        ChonkyActions.UploadFiles,
        //ChonkyActions.DownloadFiles,
        ChonkyActions.MouseClickFile,
        //ChonkyActions.CreateFolder,
        ChonkyActions.DeleteFiles,
        ChonkyActions.StartDragNDrop
    ];


    useEffect(() => {

        // Fetch files and folders from S3
        const fetchFiles = async () => {
            try {
                const response = await getfiles(memberID, taskID, registroID)
                console.log(response);
                if (response && response.data && Array.isArray(response.data)) {
                    const fetchedFiles = response.data.map(file => ({
                        id: file.Key,
                        name: file.Key,
                        isDir: false,
                    }));
                    setFiles(fetchedFiles);
                } else {
                    console.error('Invalid response format:', response);
                } 
            } catch (error) {
                console.error('Error fetching files:', error);
            }
              };

        /* const fetchFolders = async () => {
            try {
                const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME, Delimiter: '/' }).promise();
                const fetchedFolders = response.CommonPrefixes.map(folder => ({
                    id: folder.Prefix,
                    name: folder.Prefix.slice(0, -1),
                    isDir: true,
                }));
                setFolderChain(fetchedFolders);
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        }; */

        fetchFiles();
        //fetchFolders();
    }, []);

    const handleAction = React.useCallback(async (data) => {
        
        if (data.id === DownloadFilesAction.id) {
            const selectedFilesSet = data.state.selectedFiles; 
            const selectedFilesArray = [...selectedFilesSet]; 

            selectedFilesArray.forEach( async (fileId) => {
                try {
                    const fileName = fileId.id.split('/').pop();
                    //const fullPath = `${memberID}/${taskID}/${registroID}/${fileId.id}`;
                    const result = await downloadFile(memberID, taskID, registroID, fileName);
                    console.log(result)
                    const presignedUrl = result.data.url;
                    // Use the presignedUrl to download the file
                    const downloadLink = document.createElement('a');
                    downloadLink.href = presignedUrl;
                    downloadLink.download = fileName;
                    downloadLink.click();
                } catch (error) {
                    console.error('Error downloading file:', error);
                }
            });
            
        }else if (data.id === UploadFilesAction.id) {
            // Upload files logic
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.addEventListener('change', async (event) => {
                const files = event.target.files;
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    try {
                        await uploadFile(memberID, taskID, registroID, file);
                        // Handle successful upload
                        setFiles((prevFiles) => [
                            ...prevFiles,
                            {
                                id: `${memberID}/${taskID}/${registroID}/${file.name}`,
                                name: file.name,
                                isDir: false,
                            },
                        ]);
                    } catch (error) {
                        console.error('Error uploading file:', error);
                        // Handle upload error
                    }
                }
            });
            fileInput.click();

        }else if (data.id === DeleteFilesAction.id) {
            const selectedFilesSet = data.state.selectedFiles;
            const selectedFilesArray = [...selectedFilesSet];

            selectedFilesArray.forEach(async (fileId) => {
                try {
                    const fileName = fileId.id.split('/').pop();
                    await deleteFile(memberID, taskID, registroID, fileName);
                    // Update the UI to reflect the deletion (remove the file from the state)
                    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId.id));
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            });

        }else {
            console.log('File action data:', data);
        }

        
    }, []);


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>

                <div style={{ height: 300 }}>
                    <FullFileBrowser 
                    files={files} 
                    /* folderChain={folderChain} */
                    fileActions={myFileActions}
                    onFileAction={handleAction}
                    disableDragAndDrop={true}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};