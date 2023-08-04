import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { saveAs } from 'file-saver';
import ReactPlayer from 'react-player';
import wrongside1 from "./Images/wrongside1.png";
import wrongside2 from "./Images/wrongside2.jpg";
import wrongdown3 from "./Images/Wrongdown3.jpg";
import wrongdown5 from "./Images/Wrongdown5.jpg";
import wrongside3 from "./Images/wrongside3.png";
import wrongside4 from "./Images/wrongside4.jpg";
import wrongbg from "./Images/wrongbg.jpg";
import { Image } from 'primereact/image';


const WrongSide = () => {
    const [users, setUsers] = useState('');
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
        fetch(`${process.env.REACT_APP_API_KEY}/wsvehicledetection`)
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

    const imageUrls = [wrongside3, wrongside4, wrongside1, wrongside2, wrongdown3, wrongdown5];


    const toggleVideoDialog = () => {
        setVideoVisible((prevState) => {
            if (prevState) {
                downloadVideo();
            }
            return !prevState;
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-play"
                    className="p-button-rounded mr-2 mb-2"
                    style={{ height: '25px', width: '25px' }}
                    onClick={() => showDialogBox(rowData.videoUrl)}
                />

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

    // for Video button
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
                onHide={() => setImageVisible(false)}
                header="Image Viewer"
                style={{ width: '40%' }}
                footer={null}
            >
                {selectedRowData && <Image src={selectedRowData.image} alt="Image" width="350" preview />}
            </Dialog>

            {/* <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "50px", // Adjust the height of the header with the image
                    fontWeight: "bold", // Set the font weight for the header text
                    color: "#fff", // Set the text color for the header
                    backgroundImage: `url(${wrongbg})`, // Set the background image here
                    backgroundSize: "20% auto", // Adjust the background image size to repeat thrice
                    backgroundPosition: "center", // Center the background image horizontally
                    filter: "blur(2px)", // Apply the blur effect to the background image
                }}
            > */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ flex: 1, textAlign: "center" }}>WrongSide Detection</h3>

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
                    <Column field="vehiclecount" header="Vehicle Count" bodyStyle={{ fontSize: '12px' }} ></Column>
                    <Column field="vehicletype" header="Vehicle Name" bodyStyle={{ fontSize: '12px' }} ></Column>
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

export default WrongSide;