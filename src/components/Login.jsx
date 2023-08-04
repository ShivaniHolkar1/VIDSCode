import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Images from "./Images/vids3.jpg";



const Login = () => {
    const [username, usernameupdate] = useState("");
    const [password, passwordupdate] = useState("");

    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const ProceedLogin = (e) => {
        e.preventDefault();
        if (validate()) {
            let inputobj = { password: password };
            fetch(`${process.env.REACT_APP_API_KEY}/login`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(inputobj),
            })
                .then((res) => res.json())
                .then((resp) => {
                    console.log(resp, "???????????");


                    if (Object.keys(resp).length === 0) {
                        toast.error("Login failed, invalid credentials");
                    } else {
                        toast.success("Success");

                        if (resp.msg === "Login successful") {
                            sessionStorage.setItem('Login', 'Success');
                            usenavigate("/dashboard"); // Redirect to admin screen
                        }
                        else {
                            alert("Incorrect Credentials"); // show message
                        }
                    }
                })
                .catch((err) => {
                    toast.error("Login Failed due to: " + err.message);
                });
        }
    };


    const validate = () => {
        let result = true;
        if (password === "" || password === null) {
            result = false;
            toast.warning("Please Enter Password");
        }
        return result;
    };
    return (
        <div className="row" style={{ height: "100vh", backgroundImage: `url(${Images})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", padding: "180px 260px" }}>

            <form onSubmit={ProceedLogin} className="container"
                style={{
                    width: "220px", height: "150px", border: "1px solid", borderRadius: "10px", marginLeft: "150px",
                    borderColor: "black", justifyContent: 'center',
                    alignContent: 'center', boxShadow: "0 26px 42px rgba(0, 0, 0, 0.1)", background: "rgba(255, 255, 255, 0.1)"
                }}>
                <div className="card">

                    <br /> <h3 style={{ fontFamily: "initial", marginLeft: "50px" }}>Login..</h3><br />

                    <div className="card-body">

                        <div className="form-group">
                            <label style={{ fontFamily: "initial", }}> Password <span className="errmsg">*</span> </label><br />
                            <input type="password" value={password} onChange={(e) => passwordupdate(e.target.value)} className="form-control"
                                style={{ boxShadow: "0 26px 42px rgba(0, 0, 0, 0.1)", background: "rgba(255, 255, 255, 0.0)" }} ></input>
                        </div>
                    </div>
                    <br />

                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" style={{ width:"60px",fontFamily: 'serif',border:"1px solid",backgroundColor:"#425e9b",color:"white", fontSize: "14px", marginLeft: "48px",height:"25px" }}>
                            Login
                        </button>
                    </div>

                    <br />
                    <div >


                    </div>

                </div>
            </form>
        </div>
    );
};

export default Login;