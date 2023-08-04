import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import fogbg from "./Images/fogbg.jpg";

const FogWarning = () => {
    const [users, setUsers] = useState('');
    const [imageVisible, setImageVisible] = useState(false);
    const [record, setRecord] = useState('');
    const [visible, setVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState('center');


    const toggleImageDialog = (rowData) => {
        // setSelectedRowData(rowData);
        setImageVisible(true);
    };

    // get api for main table
    useEffect(() => {
        getUsers();
    }, [])
    function getUsers() {
        fetch(`${process.env.REACT_APP_API_KEY}/fogWarning`).then((result) => {
            result.json().then((resp) => {
                setUsers(resp)
            })
        })
    }
    console.warn(users)

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-image"
                    className="p-button-rounded mr-2 mb-2"
                    style={{ height: '25px', width: '25px' }}
                    onClick={() => toggleImageDialog(rowData)}
                />
            </React.Fragment>
        );
    }


    return (
        <div>

            {/* <div style={{ display: "flex", alignItems: "center" ,   backgroundImage: `url(${fogbg})`, // Set the background image here
                    backgroundSize: "cover", // Adjust the background image size as needed
                    backgroundPosition: "center", // Adjust the background image position as needed
                    height: "50px", // Adjust the height of the header with the image
                    // color: "#fff", // Set the text color for the header
                    fontWeight: "bold", // Set the font weight for the header text
                    fontSize: "20px", // Set the font size for the header text
                }}> */}
     <div style={{ display: "flex", alignItems: "center" }}>

                <h3 style={{
                    flex: 1,
                    textAlign: "center",
                  
                }}>Fog Warning</h3>

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
                    <Column field="status" header="Status" bodyStyle={{ fontSize: '12px' }}></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false} ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default FogWarning;