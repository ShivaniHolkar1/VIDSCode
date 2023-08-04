import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { saveAs } from 'file-saver';
import ReactPlayer from 'react-player';
import fire from "./Images/fire.jpg";
import fire1 from "./Images/fire1.jpg";
import fire2 from "./Images/fire2.jpg";
import fire3 from "./Images/fire3.jpg";
import fire4 from "./Images/fire4.jpg";
import firebg from "./Images/firebg.jpg";
import { Image } from 'primereact/image';

const FireDetection = () => {
    const [users, setUsers] = useState([]);
    const [imageVisible, setImageVisible] = useState(false);
    const [videoVisible, setVideoVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/firedetection`)
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

    const imageUrls = [fire, fire1, fire2, fire3, fire4];

    // for video
    const showDialogBox = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setShowDialog(true);
    };

    const hideDialogBox = () => {
        setSelectedVideo('');
        setShowDialog(false);
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
    };

    // for download
    const toggleVideoDialog = () => {
        setVideoVisible((prevState) => {
            if (prevState) {
                downloadVideo();
            }
            return !prevState;
        });
    };

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
                onHide={() => setImageVisible(false)}
                header="Image Viewer"
                style={{ width: '40%' }}
                footer={null}
            >
                {selectedRowData && <Image src={selectedRowData.image} alt="Image" width="350" preview />}
            </Dialog>

            {/* <div style={{
                display: "flex", alignItems: "center", backgroundImage: `url(${firebg})`, // Set the background image here
                // backgroundSize: "", // Adjust the background image size as needed
                backgroundPosition: "center", // Adjust the background image position as needed
                height: "50px", // Adjust the height of the header with the image
                color: "#fff", // Set the text color for the header
                fontWeight: "bold", // Set the font weight for the header text
                fontSize: "20px", // Set the font size for the header text
            }}> */}

            <div style={{ display: "flex", alignItems: "center" }}>

                <h3 style={{ flex: 1, textAlign: "center" }}>Fire Detection</h3>
                <input
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search Here.."
                    style={{ height: "30px", width: "150px", borderRadius: "6px" }}
                />
            </div>
            <br />
            <div className="card">
                <DataTable value={users} globalFilter={globalFilter} size="small" className="p-datatable-customers" paginator rows={10}>
                    <Column field="date" header="Date" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="time" header="Time" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="cameratype" header="Camera No" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default FireDetection;
