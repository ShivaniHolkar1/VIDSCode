import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import object from "./Images/object.jpg";
import ReactPlayer from 'react-player';
import { saveAs } from 'file-saver';
import { Image } from 'primereact/image';

const ObjectDetection = () => {
    const [users, setUsers] = useState('');
    const [videoVisible, setVideoVisible] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');

    useEffect(() => {
        getUsers();
    }, [])
    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/objectdetection`).then((result) => {
            result.json().then((resp) => {
                setUsers(resp)
            })
        })
    }
    console.warn(users)


    const toggleVideoDialog = () => {
        setVideoVisible((prevState) => {
            if (prevState) {
                downloadVideo();
            }
            return !prevState;
        });
    };

    const toggleImageDialog = () => {
        setImageVisible(prevState => !prevState);
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-play"
                    className="p-button-rounded mr-2 mb-2"
                    style={{ height: '25px', width: '25px' }}
                    onClick={() => showDialogBox(rowData.videoUrl)} />

                &nbsp;
                <Button
                    icon="pi pi-image"
                    className="p-button-rounded mr-2 mb-2"
                    style={{ height: '25px', width: '25px' }}
                    onClick={toggleImageDialog}
                />
            </div>
        );
    }

    // for video button
    const videoFiles = [
        '/videos/sample_video_1.mp4',
        '/videos/sample_video_2.mp4',
        // Add more video files as needed
    ];

    const showDialogBox = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setShowDialog(true);
    };

    const hideDialogBox = () => {
        setSelectedVideo('');
        setShowDialog(false);
    };

    // for Download
    const downloadVideo = () => {
        // Replace 'your-video-source.mp4' with the actual video source URL or file path.
        // You can get the source from the rowData or the server response if it's part of the data.
        const videoSource = 'your-video-source.mp4';

        // Fetch the video as a blob
        fetch(videoSource)
            .then((response) => response.blob())
            .then((blob) => {
                // Use the file-saver library to save the video blob as a file
                saveAs(blob, 'downloaded-video.mp4');
            })
            .catch((error) => {
                console.error('Error downloading the video:', error);
            });
    };


    return (
        <div>

            <Dialog
                visible={showDialog}
                onHide={hideDialogBox}
                header="Video Player"
                style={{ width: '60vw', minHeight: '500px' }}
                footer={null}
            >
                <ReactPlayer url={selectedVideo} controls width="100%" height="100%" />
                <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-outlined"
                    style={{ position: "absolute", top: '25px', right: '65px', height: "30px", width: "30px" }}
                    onClick={downloadVideo}
                />
            </Dialog>

            <Dialog
                visible={imageVisible}
                onHide={toggleImageDialog}
                header="Image Viewer"
                style={{ width: '40%' }}
                footer={null}
            >
                {/* Place your image component or code here */}
                <Image src={object} alt="Image" width="350" preview />
            </Dialog>

            <div style={{ display: "flex", alignItems: "center" }}>

                <h3 style={{ flex: 1, textAlign: "center" }}>Object Detection</h3>

                <input
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search Here.."
                    style={{ height: "30px", width: "150px", borderRadius: "6px" }}
                />
            </div><br />

            <div className="datatable-container" >
                <DataTable value={users} globalFilter={globalFilter} size='small' className="p-datatable-customers" responsiveLayout="scroll" paginator rows={10}>
                    &nbsp;
                    <Column field="objecttype" header="Object Name" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="count" header="Object Count" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="date" header="Date" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="time" header="Time" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="cameratype" header="Camera No" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false} ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default ObjectDetection;