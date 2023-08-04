import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { saveAs } from 'file-saver';
import ReactPlayer from 'react-player';
import animalbg2 from "./Images/animalbg2.jpg";
import ani from "./Images/ani.jpg";
import ani1 from "./Images/ani1.jpg";
import ani2 from "./Images/ani2.jpg";
import ani3 from "./Images/ani3.jpg";
import ani4 from "./Images/ani4.jpg";
import ani5 from "./Images/ani5.jpg";
import ani6 from "./Images/ani6.jpg";
import ani7 from "./Images/ani7.jpg";
import anivideo from "./Videos/anivideo.mp4";
import { Image } from 'primereact/image';
import axios from 'axios';



const AnimalDetection = () => {
    const [users, setUsers] = useState('');
    const [videos, setVideos] = useState([]);
    const [videoVisible, setVideoVisible] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);


    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/animaldetection`)
            .then((response) => response.json())
            .then((data) => {
                const usersWithImages = data.map((user, index) => ({
                    ...user,
                    image: imageUrls[index % imageUrls.length]
                }));
                setUsers(usersWithImages);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    // for image
    const toggleImageDialog = (rowData) => {
        setSelectedRowData(rowData);
        setImageVisible(true);
    };

    const imageUrls = [ani, ani1, ani2, ani3, ani4, ani5, ani6, ani7];

    const toggleVideoDialog = () => {
        setVideoVisible(prevState => !prevState);
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
                    onClick={() => toggleImageDialog(rowData)}
                />
            </div>
        );
    }

    // for download
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

    // for video button
    const videoFiles = [
        anivideo
        // video2,
        // Add more video files as needed
    ];

    const showDialogBox = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setVideoVisible(true);
    };

    const hideDialogBox = () => {
        setSelectedVideo('');
        setVideoVisible(false);
    };

    // Fetch videos
    axios.get(`192.168.2.170:8080/api/videos/anivideo.mp4`, { responseType: 'arraybuffer' }).then((response) => {
        // Assuming the response.data is the binary data of the video
        setVideos([URL.createObjectURL(new Blob([response.data]))]);
    });


    return (
        <div>

            {/* <Dialog
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
            </Dialog> */}

            <Dialog
                visible={videoVisible}
                onHide={hideDialogBox}
                header="Video Player"
                style={{ width: '60vw', minHeight: '500px' }}
                footer={null}
            >
                {/* <ReactPlayer url={selectedVideo} controls width="100%" height="100%" /> */}
                <h2>Videos</h2>
                {videos.map((videoURL, index) => (
                    <video key={index} controls width="400">
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ))}
                <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-outlined"
                    style={{ position: "absolute", top: '25px', right: '65px', height: "30px", width: "30px" }}
                    onClick={downloadVideo}
                />
            </Dialog>


            <Dialog
                visible={imageVisible}
                onHide={() => setImageVisible(false)}
                header="Image Viewer"
                style={{ width: '40%' }}
                footer={null}
            >
                {selectedRowData && <Image src={selectedRowData.image} alt="Image" width="350" preview />}
            </Dialog>

            {/* <div style={{
                display: "flex", alignItems: "center", backgroundImage: `url(${animalbg2})`, // Set the background image here
                // backgroundSize: "", // Adjust the background image size as needed
                backgroundPosition: "center", // Adjust the background image position as needed
                height: "50px", // Adjust the height of the header with the image
                color: "#fff", // Set the text color for the header
                fontWeight: "bold", // Set the font weight for the header text
                fontSize: "20px", // Set the font size for the header text
            }}> */}
            <div style={{ display: "flex", alignItems: "center" }}>

                <h3 style={{ flex: 1, textAlign: "center" }}>Animal Detection</h3>

                <input
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search Here.."
                    style={{ height: "30px", width: "150px", borderRadius: "6px" }}
                />
            </div><br />

            <div className="card" >
                <DataTable value={users} globalFilter={globalFilter} size="small" className="p-datatable-customers" responsiveLayout="scroll" paginator rows={10}>
                    &nbsp;
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

export default AnimalDetection;