import Swal from 'sweetalert2'
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, DatePicker, Divider, InputNumber, Row, Select, Space, Table, Typography} from 'antd';
import {DeleteFilled, EditFilled} from '@ant-design/icons';
import moment from 'moment'

import config from '../config/config'
import https from 'https';
import Reports from "./Reports";

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});





const children = [];
let req1 = {usr_id: "", start_date: "", end_date: "", pert: ""}
let req2 = {usr_id: "", start_date: "", end_date: "", pert: ""}
let req3 = {usr_id: "", start_date: "", end_date: "", pert: ""}

function handleChange(value) {
    // console.log(`selected ${value}`);
}

// Selects
let requests = [];
let users = [], usersGlobal=[];
axiosInstance.get('/report/get_request')
    .then(async function (response) {
        // console.log(response.data.length)
        for (let i = 0; i < response.data.length; i++) {
            requests.push(<Option key={response.data[i].req_id}>{response.data[i].req_title}</Option>);
        }
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
    })
    .then(function () {
        // always executed
        // console.log("Requests successfully fetched")

    });


axiosInstance.get('/report/get_user')
    .then(async function (response) {
        // console.log(response.data.length)
        for (let i = 0; i < response.data.length; i++) {
            usersGlobal.push([response.data[i].usr_id,response.data[i].usr_name])
            users.push(<Option key={response.data[i].usr_id}>{response.data[i].usr_name}</Option>);
        }
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
    })
    .then(function () {
        // always executed
        // console.log("Users successfully fetched")

    });

// function updateTable(req_id){
//     let updatedTable = []
//     axiosInstance.get(`/report/get_req/${req_id}`)
//         .then(async function (response) {
//             // console.log(response.data)
//             for (let i = 0; i < response.data.length; i++) {
//                 // console.log(response.data[i])
//                 await updatedTable.push({
//                     solicitud: response.data[i].req_title,
//                     resource: response.data[i].usr_name,
//                      usr_id: response.data[i].usr_id,
//                     pert: response.data[i].boo_percentage,
//                     start: response.data[i].boo_start_date,
//                     end: response.data[i].boo_end_date
//                 });
//             }
//
//         })
//         .catch(function (error) {
//             // handle error
//             // console.log(error);
//         })
//         .then( function () {
//             // always executed
//             // console.log("Table successfully fetched")
//             // // console.log(table)
//
//         });
//   return updatedTable
// }


const Selector = () => {
    const [data, setData] = useState([]);
    const [cli_id, setCliId] = useState("")
    const [req_id, setReqId] = useState("")
    const [buttonState, setBState] = useState(false)



    // async function fillData(){
    //     let info = await getRequests()
    //     // console.log(info)
    //     setRequest(info)
    //
    // }
    //
    // useEffect(() => {
    //     fillData()
    // }, [])

    function onChange(value) {
    }
    function editRecord(record){
        let selectUsers = [], selectedValues = []
        for (let i = 0; i <  usersGlobal.length; i++) {
            selectUsers.push(usersGlobal[i][1])
            selectedValues.push(usersGlobal[i][0])
        }
        Swal.mixin({
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            progressSteps: ['1', '2','3','4']
        }).queue([
            {
                title: 'Usuario',
                text: 'Elija a cual usuario asignar',
                input: 'select',
                inputOptions: selectUsers,
                inputValue: 0
            },
            {
                title: 'Porcentaje',
                text: 'Ingrese el porcentaje de ocupacion',
                input: 'text',
                inputValue: record.pert
            },
            {
                title: 'Fecha de inicio',
                html: '<input id="date" value="'+record.start.split('T')[0]+'" type="date">',
                preConfirm: () => {
                    const result = document.getElementById("date").value;
                    return result;
                }
            },
            {
                title: 'Fecha de finalizacion',
                html: '<input id="date2"  value="'+record.end.split('T')[0]+'"  type="date">',
                preConfirm: () => {
                    const result = document.getElementById("date2").value;
                    return result;
                }
            }
            
        ]).then((result) => {
            if (result.value) {
                const usr_id = selectedValues[result.value[0]],
                    boo_percentage = result.value[1],
                    boo_id = record.boo_id,
                    cli_id = record.cli_id,
                    boo_duration = null,
                    boo_start_date = result.value[2],
                    boo_end_date = result.value[3];
                 axiosInstance.post('/booking/booking',{
                    //  boo_duration, boo_start_date, boo_end_date, boo_percentage
                    boo_id: boo_id,
                    cli_id: cli_id,
                    boo_duration: boo_duration,
                    req_id: req_id,
                    usr_id: usr_id,
                    boo_start_date: boo_start_date,
                    boo_end_date: boo_end_date,
                    boo_percentage: boo_percentage
                })
                    .then( (response) => {
                        onChangeReq(req_id)
                        Swal.fire({
                            title:"El booking fue editado!",
                            icon: "success",
                        })
                    });
            }
        });
    }
    function deleteRecord(record){
        Swal.fire({
            title: "¿Quieres eliminar la solicitud "+record.solicitud+"?",
            text: "Una vez eliminado no se podra recuperar",
            icon: "warning",
            buttons: true,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete.value) {
                    axiosInstance.get('/booking/delete_booking/'+record.boo_id)
                        .then( function (response) {
                            onChangeReq(req_id)
                            Swal.fire({
                                title:"La solicitud fue eliminada!",
                                icon: "success",
                            })
                        });
                } else {
                    Swal.fire("La solicitud no fue eliminada!");
                }
            });
    }
    async function onChangeReq(value) {
        setBState(true)
        let table = []
        setReqId(value)
        // setCliId()
        await axiosInstance.get(`/report/get_cli/${value}`)
            .then(async function (response) {
                setCliId(response.data[0].cli_id)
            })
            .catch(function (error) {
                // handle error
                // console.log(error);
            })
            .then(function () {

            });



        await axiosInstance.get(`/report/get_req/${value}`)
            .then(async function (response) {
                // // console.log(response.data)

                for (let i = 0; i < response.data.length; i++) {
                    // console.log(response.data[i])
                    await table.push({
                        boo_id: response.data[i].boo_id,
                        cli_id: response.data[i].cli_id,
                        usr_id: response.data[i].usr_id,
                        solicitud: response.data[i].req_title,
                        resource: response.data[i].usr_name,
                        pert: response.data[i].boo_percentage,
                        start: response.data[i].boo_start_date.split("T")[0],
                        end: response.data[i].boo_end_date.split("T")[0]
                    });
                }
            })
            .catch(function (error) {
                // handle error
                // console.log(error);
            })
            .then(function () {
                // always executed
                // console.log("Table successfully fetched")
                // // console.log(table)
                setData(table)
            });


    }

    // Get the user id
    function onChangeUser1(value){
        // console.log(req1)
        req1.usr_id = value
    }
    function onChangeUser2(value){
        // console.log(value)
        req2.usr_id = value
    }
    function onChangeUser3(value){
        // console.log(value)
        req3.usr_id = value
    }

    // Get the percent
    function onChangePert1(value) {
        req1.pert = value
    }
    function onChangePert2(value) {
        req2.pert = value
    }
    function onChangePert3(value) {
        req3.pert = value
    }





    // get the date
    function date1(value){
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            req1.start_date = start_momentObj.format('YYYY-MM-DD')
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            req1.end_date = end_momentObj.format('YYYY-MM-DD');
        }else{
            req1.start_date = "";
            req1.end_date = "";
        }
    }
    function date2(value){
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            req2.start_date = start_momentObj.format('YYYY-MM-DD')
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            req2.end_date = end_momentObj.format('YYYY-MM-DD');
        }else{
            req2.start_date = "";
            req2.end_date = "";
        }
    }
    function date3(value) {
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            req3.start_date = start_momentObj.format('YYYY-MM-DD')
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            req3.end_date = end_momentObj.format('YYYY-MM-DD');
        }else{
            req3.start_date = "";
            req3.end_date = "";
        }
    }

    async function asignResources() {
        // console.log(req1)
        // console.log(req2)
        // console.log(req3)
        // console.log(cli_id)
        // console.log(req_id)


        // Create bookings 1
        let empty1 = false
        for (let  key of Object.keys(req1)) {
            if (req1[key] === ""){
                empty1 = true
            }
        }
        if (!empty1){
            axiosInstance.put('/booking/booking', {
                usr_id: req1.usr_id,
                boo_percentage: req1.pert,
                boo_start_date: req1.start_date,
                boo_end_date: req1.end_date,
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                    // console.log(response)
                })
                .catch(function (error) {
                    // handle error
                    // console.log(error);
                })
                .then(function () {
                    // always executed
                    // console.log("this way, check this out")
                    let updatedTable = []
                    axiosInstance.get(`/report/get_req/${req_id}`)
                        .then(async function (response) {
                            console.log(response.data)
                            for (let i = 0; i < response.data.length; i++) {
                                // console.log(response.data[i])
                                await updatedTable.push({
                                    boo_id: response.data[i].boo_id,
                                    cli_id: response.data[i].cli_id,
                                    usr_id: response.data[i].usr_id,
                                    solicitud: response.data[i].req_title,
                                    resource: response.data[i].usr_name,
                                    pert: response.data[i].boo_percentage,
                                    start: response.data[i].boo_start_date.split("T")[0],
                                    end: response.data[i].boo_end_date.split("T")[0]
                                });
                            }

                        })
                        .catch(function (error) {
                            // handle error
                            // console.log(error);
                        })
                        .then( function () {
                            // always executed
                            // console.log("Table successfully fetched")
                            setData(updatedTable)
                        });

                });
        }

        // Create bookings 2
        let empty2 = false
        for (let  key of Object.keys(req2)) {
            if (req2[key] === ""){
                empty2 = true
            }
        }
        if (!empty2){
            axiosInstance.put('/booking/booking', {
                usr_id: req2.usr_id,
                boo_percentage: req2.pert,
                boo_start_date: req2.start_date,
                boo_end_date: req2.end_date,
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                    // console.log(response)
                })
                .catch(function (error) {
                    // handle error
                    // console.log(error);
                })
                .then(function () {
                    // always executed
                    // console.log("this way, check this out")
                    let updatedTable = []
                    axiosInstance.get(`/report/get_req/${req_id}`)
                        .then(async function (response) {
                            // console.log(response.data)
                            for (let i = 0; i < response.data.length; i++) {
                                // console.log(response.data[i])
                                await updatedTable.push({
                                    boo_id: response.data[i].boo_id,
                                    cli_id: response.data[i].cli_id,
                                    usr_id: response.data[i].usr_id,
                                    solicitud: response.data[i].req_title,
                                    resource: response.data[i].usr_name,
                                    pert: response.data[i].boo_percentage,
                                    start: response.data[i].boo_start_date.split("T")[0],
                                    end: response.data[i].boo_end_date.split("T")[0]
                                });
                            }

                        })
                        .catch(function (error) {
                            // handle error
                            // console.log(error);
                        })
                        .then( function () {
                            // always executed
                            // console.log("Table successfully fetched")
                            setData(updatedTable)
                        });

                });
        }

        // Create bookings 3
        let empty3 = false
        for (let  key of Object.keys(req3)) {
            if (req3[key] === ""){
                empty3 = true
            }
        }
        if (!empty3){
            axiosInstance.put('/booking/booking', {
                usr_id: req3.usr_id,
                boo_percentage: req3.pert,
                boo_start_date: req3.start_date,
                boo_end_date: req3.end_date,
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                    // console.log(response)
                })
                .catch(function (error) {
                    // handle error
                    // console.log(error);
                })
                .then(function () {
                    // always executed
                    // console.log("this way, check this out")
                    let updatedTable = []
                    axiosInstance.get(`/report/get_req/${req_id}`)
                        .then(async function (response) {
                            // console.log(response.data)
                            for (let i = 0; i < response.data.length; i++) {
                                // console.log(response.data[i])
                                await updatedTable.push({
                                    boo_id: response.data[i].boo_id,
                                    cli_id: response.data[i].cli_id,
                                    usr_id: response.data[i].usr_id,
                                    solicitud: response.data[i].req_title,
                                    resource: response.data[i].usr_name,
                                    pert: response.data[i].boo_percentage,
                                    start: response.data[i].boo_start_date.split("T")[0],
                                    end: response.data[i].boo_end_date.split("T")[0]
                                });
                            }

                        })
                        .catch(function (error) {
                            // handle error
                            // console.log(error);
                        })
                        .then( function () {
                            // always executed
                            // console.log("Table successfully fetched")
                            setData(updatedTable)
                        });

                });
        }
        req1 = {usr_id: "", start_date: "", end_date: "", pert: ""}
        req2 = {usr_id: "", start_date: "", end_date: "", pert: ""}
        req3 = {usr_id: "", start_date: "", end_date: "", pert: ""}
    }


    function onBlur() {
        // console.log('blur');
    }

    function onFocus() {
        // console.log('focus');
    }

    function onSearch(val) {
        // console.log('search:', val);
    }
    const columns = [
        {
            title: 'Solicitud',
            dataIndex: 'solicitud',
        },
        {
            title: 'Recurso',
            dataIndex: 'resource',
        },
        {
            title: '%',
            dataIndex: 'pert'
        },
        {
            title: 'Fecha Inicio',
            dataIndex: 'start'
        },
        {
            title: 'Fecha Fin',
            dataIndex: 'end'
        },
        {
            title: 'Operación',
            key: 'action',
            width: "5%",
            align: 'center',
            render: (text, record) => (
                <Space size="small">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a><DeleteFilled  onClick={()=>deleteRecord(record)}/></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a><EditFilled onClick={()=>editRecord(record)}/></a>

                </Space>
            ),
        },
    ];
    return (
        <div>
            <Text style={{paddingRight: "10px"}}>Selección de Solicitud</Text>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Seleccione una solicitud"
                optionFilterProp="children"
                onChange={onChangeReq}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {requests}
            </Select>
            <Divider/>
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
            <Divider/>
            <Row style={{paddingTop: "5px", paddingBottom: "5px"}}>
                <Col span={6}>
                    {/*Recurso*/}
                    <Text style={{paddingRight: "5px"}}>Recurso 1</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Seleccione un recurso"
                        optionFilterProp="children"
                        onChange={onChangeUser1}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {users}
                    </Select>
                </Col>
                <Col span={4}>
                    {/*    Porcentaje*/}
                    <Text style={{paddingRight: "10px", paddingLeft: "10px"}}>%</Text>
                    <InputNumber min={0} max={100}  onChange={onChangePert1}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker
                        onChange={date1}
                    />
                </Col>
            </Row>
            <Row style={{paddingTop: "5px", paddingBottom: "5px"}}>
                <Col span={6}>
                    {/*Recurso*/}
                    <Text style={{paddingRight: "5px"}}>Recurso 2</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Seleccione un recurso"
                        optionFilterProp="children"
                        onChange={onChangeUser2}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {users}
                    </Select>
                </Col>
                <Col span={4}>
                    {/*    Porcentaje*/}
                    <Text style={{paddingRight: "10px", paddingLeft: "10px"}}>%</Text>
                    <InputNumber min={0} max={100}  onChange={onChangePert2}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker onChange={date2}/>
                </Col>
                <Col span={4}>
                    {buttonState === false ?
                        <Button type="primary" style={{ backgroundColor: "#08979c", borderColor: "#08979c" }} onClick={asignResources} disabled> Asignar recursos</Button>
                        :
                        <Button type="primary" style={{ backgroundColor: "#08979c", borderColor: "#08979c" }} onClick={asignResources}> Asignar recursos</Button>
                    }
                </Col>
            </Row >
            <Row style={{paddingTop: "5px", paddingBottom: "5px"}}>
                <Col span={6}>
                    {/*Recurso*/}
                    <Text style={{paddingRight: "5px"}}>Recurso 3</Text>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Seleccione un recurso"
                        optionFilterProp="children"
                        onChange={onChangeUser3}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {users}
                    </Select>
                </Col>
                <Col span={4}>
                    {/*    Porcentaje*/}
                    <Text style={{paddingRight: "10px", paddingLeft: "10px"}}>%</Text>
                    <InputNumber min={0} max={100}  onChange={onChangePert3}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker onChange={date3}/>
                </Col>
            </Row>



        </div>
    )
}

export default Selector




