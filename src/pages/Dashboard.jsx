import React, { useState, useEffect } from 'react';
import Images from "./Images/map.jpg";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import fire from "./Images/fire.jpg";
import axios from 'axios';
import ReactPlayer from 'react-player';


const Dashboard = () => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [users, setUsers] = useState('');
    const [record, setRecord] = useState('');
    const [imageVisible, setImageVisible] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [displayConfirm, setDisplayConfirm] = useState(false);


    const toggleImageDialog = () => {
        setImageVisible(prevState => !prevState);
    };

    // get api for latest event
    useEffect(() => {
        getUsers();
    }, [])
    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/latestevents`).then((result) => {
            result.json().then((resp) => {
                setUsers(resp)
            })
        })
    }
    console.warn(users)

    const rowClass = (data) => {
        return {
            'row-event': data.event === 'fire'
        }
    }

    // get api for machinestatus
    useEffect(() => {
        getRecord();
    }, [])
    function getRecord() {
        fetch(`${process.env.REACT_APP_API_KEY}/machinestatus`).then((result) => {
            result.json().then((resp) => {
                setRecord(resp)
            })
        })
    }
    console.warn(record)

    // for map
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setIsLoading(false);
            },
            (error) => {
                console.error("Error getting user's location:", error);
                setError(error.message);
                setIsLoading(false);
            }
        );
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // for Image Viewer
    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-image"
                    className="p-button-rounded p-button-primary"
                    style={{ height: '30px', width: '30px' }}
                    onClick={toggleImageDialog}
                />
            </div>
        );
    }

    const header = (
        <div className="table-header" style={{ display: "flex" }}>
            <h5 className="mx-0 my-1">Latest Event</h5>

            <span className="p-input-icon-left" style={{ marginLeft: "60%" }}>
                {/* <i className="pi pi-search" />  */}
                <input type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "6px" }} />
            </span>
        </div>
    );

    // status
    const approveLeave = (id) => {
        setSelectedEvents(id);
        setDisplayConfirm(true);
    };

    const confirmApprove = () => {
        axios
            .put(`${process.env.REACT_APP_API_KEY}/latestevents/${selectedEvents}`, { status: 'Seen' })
            .then(() => {
                setUsers((prevState) =>
                    prevState.map((leave) => {
                        if (leave._id === selectedEvents) {
                            leave.status = 'Seen';
                        }
                        return leave;
                    })
                );
            });
        setDisplayConfirm(false);
    };

    const cancelApprove = () => {
        setSelectedEvents(null);
        setDisplayConfirm(false);
    };

    const statusTemplate = (rowData) => {
        if (rowData.status === 'Unseen') {
            return <Button className="p-button-rounded p-button-danger mr-2 mb-2"
                style={{ height: "1px", fontSize: "10px" }}>{rowData.status}</Button>;
        } else if (rowData.status === 'approved') {
            return <Button className="p-button-rounded p-button-success"
                style={{ height: "1px", fontSize: "10px" }}>{rowData.status}</Button>;
        } else {
            return <Button className="p-button-rounded p-button-success"
                style={{ height: "1px", fontSize: "10px" }}>{rowData.status}</Button>;
        }
    };

    const approveButtonTemplate = (rowData) => {
        if (rowData.status === 'Unseen') {
            return (
                <Button
                    style={{ height: "1px", fontSize: "10px" }}
                    label="Seen"
                    className="p-button-rounded mr-2 mb-2"
                    onClick={() => approveLeave(rowData._id)}
                />
            );
        }
        else {
            return null;
        }
    };

    const confirmFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={cancelApprove} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={confirmApprove} />
        </>
    );

    // for live footage Action button
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

    const videoButtonTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-play"
                className="p-button-rounded "
                style={{ height:"30px",width:"30px" }}
                onClick={() => showDialogBox(rowData.videoUrl)}
            />
        );
    };

    return (
        <div>

            <Dialog
                visible={imageVisible}
                onHide={toggleImageDialog}
                header="Image Viewer"
                style={{ width: '40vw' }}
            >
                {/* Place your image component or code here */}
                <img src={fire} alt="Image" style={{ width: '100%' }} />
            </Dialog>

            <Dialog
                visible={showDialog}
                onHide={hideDialogBox}
                header="Video Player"
                style={{ width: '60vw', minHeight: '500px' }}
                footer={null}
            >
                <ReactPlayer url={selectedVideo} controls width="100%" height="100%" />
            </Dialog>


            <div style={{ display: "flex" }}>
                <div>

                    {userLocation && (
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=${userLocation.lat}!2d${userLocation.lng}`}
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            style={{ border: "0" }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    )}
                </div>

                &nbsp;
                <div className="datatable-style-demo" >
                    <DataTable header={header} value={users} rowClassName={rowClass} globalFilter={globalFilter} size="small" className="p-datatable-customers" responsiveLayout="scroll" paginator rows={4}>
                        &nbsp;
                        <Column field="event" header="Event" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="date" header="Date" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="time" header="Time" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="cameratype" header="Camera" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column body={actionBodyTemplate} header="Image" exportable={false}  ></Column>
                        <Column field="status" header="Status" body={statusTemplate} bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column header="Action" body={approveButtonTemplate}  ></Column>
                    </DataTable>
                    <Dialog
                        visible={displayConfirm}
                        onHide={cancelApprove}
                        footer={confirmFooter}
                        header="Confirm Approval"    >
                        <p style={{ fontSize: "14px" }}>Have you taken any action on this?</p>
                    </Dialog>
                </div>
            </div>

            <br />
            <div className="card" >
                <DataTable header="Equipment Status" value={record} size="small" className="p-datatable-customers" responsiveLayout="scroll" paginator rows={4}>
                    &nbsp;
                    <Column field="srNo" header="Sr No" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="name" header="Camera Name" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="ipAddress" header="Ip Address" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="status" header="Status" bodyStyle={{ fontSize: '12px' }}></Column>
                    {/* <Column body={videoButtonTemplate} header="View" /> */}
                </DataTable>
            </div>

        </div >
    );
};

export default Dashboard;



// import React, { useState, useEffect } from 'react';
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import axios from 'axios';
// import fire from "./Images/fire.jpg";
// import ReactPlayer from 'react-player';
// import { Image } from 'primereact/image';

// const Dashboard = () => {
//     const [globalFilter, setGlobalFilter] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [record, setRecord] = useState([]);
//     const [imageVisible, setImageVisible] = useState(false);
//     const [userLocation, setUserLocation] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvents, setSelectedEvents] = useState(null);
//     const [showDialog, setShowDialog] = useState(false);
//     const [selectedVideo, setSelectedVideo] = useState('');
//     const [displayConfirm, setDisplayConfirm] = useState(false);
//     const [highlightedRows, setHighlightedRows] = useState([]);


//     const toggleImageDialog = () => {
//         setImageVisible(prevState => !prevState);
//     };

//     useEffect(() => {
//         // Fetch latest events and set highlighted rows
//         getUsers();
//         getRecord();

//         // Get user's location
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation({ lat: latitude, lng: longitude });
//                 setIsLoading(false);
//             },
//             (error) => {
//                 console.error("Error getting user's location:", error);
//                 setError(error.message);
//                 setIsLoading(false);
//             }
//         );
//     }, []);

//     function getUsers() {
//         fetch(`${process.env.REACT_APP_API_KEY}/latestevents`).then((result) => {
//             result.json().then((resp) => {
//                 setUsers(resp);

//                 // Determine which rows to highlight based on "fire" and "wrongside" events
//                 const newHighlightedRows = resp.reduce((acc, event) => {
//                     if (event.event === 'fire' || event.event === 'wrongside') {
//                         acc.push(event._id);
//                     }
//                     return acc;
//                 }, []);
//                 setHighlightedRows(newHighlightedRows);
//             });
//         });
//     }

//     function getRecord() {
//         fetch(`${process.env.REACT_APP_API_KEY}/machinestatus`).then((result) => {
//             result.json().then((resp) => {
//                 setRecord(resp)
//             })
//         })
//     }

//     const actionBodyTemplate = (rowData) => {
//         return (
//             <div>
//                 <Button
//                     icon="pi pi-image"
//                     className="p-button-rounded p-button-primary"
//                     style={{ height: '30px', width: '30px' }}
//                     onClick={toggleImageDialog}
//                 />
//             </div>
//         );
//     }

//     const header = (
//         <div className="table-header" style={{ display: "flex" }}>
//             <h5 className="mx-0 my-1">Latest Event</h5>

//             <span className="p-input-icon-left" style={{ marginLeft: "60%" }}>
//                 <input type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." style={{ borderRadius: "6px" }} />
//             </span>
//         </div>
//     );

//     const statusTemplate = (rowData) => {
//         return (
//             <Button
//                 className={rowData.status === 'Unseen' ? 'p-button-rounded p-button-danger mr-2 mb-2' : 'p-button-rounded p-button-success'}
//                 style={{ height: "1px", fontSize: "10px" }}
//             >
//                 {rowData.status}
//             </Button>
//         );
//     };

//     const rowClassName = (rowData) => {
//         return highlightedRows.includes(rowData._id) ? 'highlighted-row' : '';
//     };


//     // status
//     const approveLeave = (id) => {
//         setSelectedEvents(id);
//         setDisplayConfirm(true);
//     };

//     const confirmApprove = () => {
//         axios
//             .put(`${process.env.REACT_APP_API_KEY}/latestevents/${selectedEvents}`, { status: 'Seen' })
//             .then(() => {
//                 setUsers((prevState) =>
//                     prevState.map((leave) => {
//                         if (leave._id === selectedEvents) {
//                             leave.status = 'Seen';
//                         }
//                         return leave;
//                     })
//                 );
//             });
//         setDisplayConfirm(false);
//     };

//     const cancelApprove = () => {
//         setSelectedEvents(null);
//         setDisplayConfirm(false);
//     };

//     const approveButtonTemplate = (rowData) => {
//         if (rowData.status === 'Unseen') {
//             return (
//                 <Button
//                     style={{ height: "1px", fontSize: "10px" }}
//                     label="Seen"
//                     className="p-button-rounded mr-2 mb-2"
//                     onClick={() => approveLeave(rowData._id)}
//                 />
//             );
//         }
//         else {
//             return null;
//         }
//     };

//     const confirmFooter = (
//         <>
//             <Button label="No" icon="pi pi-times" className="p-button-text" onClick={cancelApprove} />
//             <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={confirmApprove} />
//         </>
//     );

//     // for live footage Action button
//     const videoFiles = [
//         '/videos/sample_video_1.mp4',
//         '/videos/sample_video_2.mp4',
//         // Add more video files as needed
//     ];

//     const showDialogBox = (videoUrl) => {
//         setSelectedVideo(videoUrl);
//         setShowDialog(true);
//     };

//     const hideDialogBox = () => {
//         setSelectedVideo('');
//         setShowDialog(false);
//     };

//     const videoButtonTemplate = (rowData) => {
//         return (
//             <Button
//                 icon="pi pi-play"
//                 className="p-button-rounded "
//                 style={{ height: "30px", width: "30px" }}
//                 onClick={() => showDialogBox(rowData.videoUrl)}
//             />
//         );
//     };

//     return (
//         <div>
//             <Dialog
//                 visible={imageVisible}
//                 onHide={toggleImageDialog}
//                 header="Image Viewer"
//                 style={{ width: '40%' }}
//             >
//                 {/* Place your image component or code here */}
//                 <Image src={fire} alt="Image" width="350" preview />
//             </Dialog>

//             <Dialog
//                 visible={showDialog}
//                 onHide={hideDialogBox}
//                 header="Video Player"
//                 style={{ width: '60vw', minHeight: '500px' }}
//                 footer={null}
//             >
//                 <ReactPlayer url={selectedVideo} controls width="100%" height="100%" />
//             </Dialog>

//             <div style={{ display: "flex" }}>
//                 <div>
//                     {userLocation && (
//                         <iframe
//                             src={`https://www.google.com/maps/embed?pb=${userLocation.lat}!2d${userLocation.lng}`}
//                             title="Google Maps"
//                             width="100%"
//                             height="100%"
//                             style={{ border: "0" }}
//                             allowFullScreen
//                             loading="lazy"
//                         ></iframe>
//                     )}
//                 </div>

//                 &nbsp;
//                 <div className="card" >
//                     <DataTable
//                         header={header}
//                         value={users}
//                         globalFilter={globalFilter}
//                         size="small"
//                         className="p-datatable-customers"
//                         responsiveLayout="scroll"
//                         paginator
//                         rows={4}
//                         rowClassName={rowClassName} // Use the rowClassName function here
//                     >
//                         <Column field="event" header="Event" bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column field="date" header="Date" bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column field="time" header="Time" bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column field="cameratype" header="Camera" bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column body={actionBodyTemplate} header="Image" exportable={false}></Column>
//                         <Column field="status" header="Status" body={statusTemplate} bodyStyle={{ fontSize: '12px' }}></Column>
//                         <Column header="Action" body={approveButtonTemplate}></Column>
//                     </DataTable>
//                     <Dialog
//                         visible={displayConfirm}
//                         onHide={cancelApprove}
//                         footer={confirmFooter}
//                         header="Confirm Approval"
//                     >
//                         <p style={{ fontSize: "14px" }}>Have you taken any action on this?</p>
//                     </Dialog>
//                 </div>
//             </div>

//             <br />
//             <div className="card">
//                 <DataTable header="Equipment Status" value={record} size="small" className="p-datatable-customers" responsiveLayout="scroll" paginator rows={4}>
//                     <Column field="srNo" header="Sr No" bodyStyle={{ fontSize: '12px' }}></Column>
//                     <Column field="name" header="Camera Name" bodyStyle={{ fontSize: '12px' }}></Column>
//                     <Column field="ipAddress" header="Ip Address" bodyStyle={{ fontSize: '12px' }}></Column>
//                     <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
//                     <Column field="status" header="Status" bodyStyle={{ fontSize: '12px' }}></Column>
//                     {/* <Column body={videoButtonTemplate} header="View" /> */}
//                 </DataTable>
//             </div>
//         </div >
//     );
// };

// export default Dashboard;