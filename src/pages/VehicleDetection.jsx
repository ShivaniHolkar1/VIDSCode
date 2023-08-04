import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const VehicleDetection = () => {
    const [users, setUsers] = useState('');
    const [record,setRecord] = useState('');
    const [visible, setVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState('center');

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
    }

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }



    const toggleDialog = () => {
        setVisible(prevState => !prevState);
    };

    // get api for main table
    useEffect(() => {
        getUsers();
    }, [])
    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/vdandcounting`).then((result) => {
            result.json().then((resp) => {
                setUsers(resp)
            })
        })
    }
    console.warn(users)

     // get api for small table
     useEffect(() => {
        getRecord();
    }, [])
    function getRecord() {
        fetch(`${process.env.REACT_APP_API_KEY}/vclassification`).then((result) => {
            result.json().then((resp) => {
                setRecord(resp)
            })
        })
    }
    console.warn(record)

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded mr-2" onClick={() => onClick('displayBasic')}
                    style={{  height: "25px", width: "25px" }} />
            </React.Fragment>
        );
    }

    // useEffect(() => {
    //     getRecord();
    // }, []);
    
    // function getRecord() {
    //     fetch(`${process.env.REACT_APP_API_KEY}/vclassification`).then((result) => {
    //         result.json().then((resp) => {
    //             // Categorize the vehicles
    //             const categorizedRecords = categorizeVehicles(resp);
    //             setRecord(categorizedRecords);
    //         });
    //     });
    // }
    
    // function categorizeVehicles(records) {
    //     const categorizedRecords = {
    //         car: [],
    //         truck: [],
    //         bus: [],
    //         bike: []
    //     };
    
    //     records.forEach((record) => {
    //         switch (record.vehicletype) {
    //             case 'car':
    //                 categorizedRecords.car.push(record);
    //                 break;
    //             case 'truck':
    //                 categorizedRecords.truck.push(record);
    //                 break;
    //             case 'bus':
    //                 categorizedRecords.bus.push(record);
    //                 break;
    //             case 'bike':
    //                 categorizedRecords.bike.push(record);
    //                 break;
    //             default:
    //                 // Handle any default behavior or unrecognized types
    //                 break;
    //         }
    //     });
    
    //     return categorizedRecords;
    // }
    
    // console.warn(record);
    

    return (
        <div>
            <div className="card">
                <Dialog visible={displayBasic} style={{ width: '50vw' }} onHide={() => onHide('displayBasic')}>
                    <DataTable value={record} globalFilter={globalFilter} size="small" className="p-datatable-customers" responsiveLayout="scroll" paginator rows={10}>

                        <Column field="vehicletype" header="Vehicle Name" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="noOfLeaving" header="Entered Vehicle" bodyStyle={{ fontSize: '12px' }}></Column>
                        <Column field="noOfEntering" header="Passed Vehicle" bodyStyle={{ fontSize: '12px' }}></Column>

                    </DataTable>
                </Dialog>
            </div>

            <Dialog
                visible={visible}
                onHide={toggleDialog}
                header="Video Player"
                style={{ width: '40vw' }}
                footer={null}
            >
                {/* Place your video player component or code here */}
                <video controls>
                    <source src="your-video-source.mp4" type="video/mp4" />
                </video>
            </Dialog>

            <div style={{ display: "flex", alignItems: "center" }}>

                <h3 style={{ flex: 1, textAlign: "center" }}>Vehicle Detection & Counting</h3>

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
                    {/* <Column field="vehicletype" header="Vehicle Name" bodyStyle={{ fontSize: '12px' }}></Column> */}
                    <Column field="date" header="Date" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="noOfLeaving" header="Entered Vehicle" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="noOfEntering" header="Passed Vehicle" bodyStyle={{ fontSize: '12px' }}></Column>
                    {/* <Column field="time" header="Time" bodyStyle={{ fontSize: '12px' }}></Column> */}
                    <Column field="cameratype" header="Camera No" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column field="location" header="Location" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false} ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default VehicleDetection;