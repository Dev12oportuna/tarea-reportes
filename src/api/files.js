import axios from "./axios"

export const getfiles = (memberID, taskID, registroID) => {
    const requestData = { memberID, taskID, registroID };

    return axios.post("file/files", requestData)
/*       .then((response) => {
        // Handle successful response
        console.log("Success:", response);
        return response.data; // Return the response data
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
    });*/
  }; 

export const downloadFile = (memberID, taskID, registroID, filename) => {
    const requestData = {memberID, taskID, registroID, filename}

    return axios.post(`file/downloadFile`, requestData)
}

export const deleteFile = (memberID, taskID, registroID, filename) => {
    const requestData = {memberID, taskID, registroID, filename}

    const url = `file/deleteFile?${new URLSearchParams(requestData).toString()}`;

    return axios.delete(url);
}

export const uploadFile = (memberID, taskID, registroID, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('memberID', memberID);
    formData.append('taskID', taskID);
    formData.append('registroID', registroID);


    return axios.post('file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
