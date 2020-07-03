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

function handleChange(value) {
}

// Selects
let requests = [];
let users = [], usersGlobal=[];
axiosInstance.get('/report/get_request')
    .then(async function (response) {
        for (let i = 0; i < response.data.length; i++) {
            requests.push(<Option key={response.data[i].req_id}>{response.data[i].req_title}</Option>);
        }
    })
    .catch(function (error) {
    })
    .then(function () {

    });


axiosInstance.get('/report/get_user')
    .then(async function (response) {
        for (let i = 0; i < response.data.length; i++) {
            usersGlobal.push([response.data[i].usr_id,response.data[i].usr_name])
            users.push(<Option key={response.data[i].usr_id}>{response.data[i].usr_name}</Option>);
        }
    })
    .catch(function (error) {
    })
    .then(function () {

    });

const Selector = () => {
    const [data, setData] = useState([]);
    const [cli_id, setCliId] = useState("")
    const [req_id, setReqId] = useState("")
    const [buttonState, setBState] = useState(false)


    // Recurso 1
    const [pert1, setPert1] = useState("")
    const [select1, setSelect1] = useState("")
    const [req1,setReq1] = useState({start_date: null, end_date: null})
    //Recurso 2
    const [pert2, setPert2] = useState("")
    const [select2, setSelect2] = useState("")
    const [req2,setReq2] = useState({start_date: null, end_date: null})
    //Recurso 3
    const [pert3, setPert3] = useState("")
    const [select3, setSelect3] = useState("")
    const [req3,setReq3] = useState({start_date: null, end_date: null})



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
                    boo_start_date = result.value[2].format("YYYY-MM-DD"),
                    boo_end_date = result.value[3].format("YYYY-MM-DD");
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
            })
            .then(function () {

            });



        await axiosInstance.get(`/report/get_req/${value}`)
            .then(async function (response) {
                let start, end, start_dateObj, end_dateObj;
                for (let i = 0; i < response.data.length; i++) {
                    start_dateObj = new Date(response.data[i].boo_start_date.split("T")[0]);
                    start = moment(start_dateObj).add(1, 'day').format("DD-MM-YYYY");
                    end_dateObj = new Date(response.data[i].boo_end_date.split("T")[0]);
                    end = moment(end_dateObj).add(1, 'day').format("DD-MM-YYYY");
                    await table.push({
                        boo_id: response.data[i].boo_id,
                        cli_id: response.data[i].cli_id,
                        usr_id: response.data[i].usr_id,
                        solicitud: response.data[i].req_title,
                        resource: response.data[i].usr_name,
                        pert: response.data[i].boo_percentage,
                        start: start,
                        end: end
                    });
                }
            })
            .catch(function (error) {
            })
            .then(function () {
                setData(table)
            });


    }

    // Get the user id
    function onChangeUser1(value){
        setSelect1(value)
    }
    function onChangeUser2(value){
        setSelect2(value)
    }
    function onChangeUser3(value){
        setSelect3(value)
    }

    // Get the percent
    function onChangePert1(value) {
        setPert1(value)
    }
    function onChangePert2(value) {
        setPert2(value)
    }
    function onChangePert3(value) {
        setPert3(value)
    }





    // get the date
    function date1(value){
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            setReq1({start_date: start_momentObj, end_date: end_momentObj})
        }else{
            setReq1({start_date: null, end_date: null})
        }
    }
    function date2(value){
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            setReq2({start_date: start_momentObj, end_date: end_momentObj})
        }else{
            setReq2({start_date: null, end_date: null})
        }
    }
    function date3(value) {
        if(value != null){
            let  start_dateObj = new Date(value[0]._d);
            let  start_momentObj = moment(start_dateObj);
            let  end_dateObj = new Date(value[1]._d);
            let  end_momentObj = moment(end_dateObj);
            setReq3({start_date: start_momentObj, end_date: end_momentObj})
        }else{
            setReq3({start_date: null, end_date: null})
        }
    }

    async function asignResources() {

        // Create bookings 1
        const empty1 = !(req1.start_date!=null && req1.end_date!=null && select1!="" && req_id!="" && cli_id!="")
        if (!empty1){
            axiosInstance.put('/booking/booking', {
                usr_id: select1,
                boo_percentage: pert1,
                boo_start_date: req1.start_date.format("YYYY-MM-DD"),
                boo_end_date: req1.end_date.format("YYYY-MM-DD"),
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                })
                .catch(function (error) {
                })
                .then(function () {
                    onChangeReq(req_id)
                });
        }

        // Create bookings 2
        const empty2 = !(req2.start_date!=null && req2.end_date!=null && select2!="" && req_id!="" && cli_id!="")
        if (!empty2){
            axiosInstance.put('/booking/booking', {
                usr_id: select2,
                boo_percentage: pert2,
                boo_start_date: req2.start_date.format("YYYY-MM-DD"),
                boo_end_date: req2.end_date.format("YYYY-MM-DD"),
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                })
                .catch(function (error) {
                })
                .then(function () {
                    onChangeReq(req_id)
                });
        }

        // Create bookings 3
        const empty3 = !(req3.start_date!=null && req3.end_date!=null && select3!="" && req_id!="" && cli_id!="")
        if (!empty3){
            axiosInstance.put('/booking/booking', {
                usr_id: select3,
                boo_percentage: pert3,
                boo_start_date: req3.start_date.format("YYYY-MM-DD"),
                boo_end_date: req3.end_date.format("YYYY-MM-DD"),
                req_id: req_id,
                cli_id: cli_id
            })
                .then(response => {
                })
                .catch(function (error) {
                })
                .then(function () {
                    onChangeReq(req_id)
                });
        }

        // Setting default values
        setPert1("")
        setSelect1("")
        setReq1({start_date: null, end_date: null})

        setPert2("")
        setSelect2("")
        setReq2({start_date: null, end_date: null})

        setPert3("")
        setSelect3("")
        setReq3({start_date: null, end_date: null})
    }


    function onBlur() {
    }

    function onFocus() {
    }

    function onSearch(val) {
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
            title: 'Porcentaje',
            align: 'right',
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
                        value={select1}
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
                    <InputNumber min={0} max={100} value={pert1} onChange={onChangePert1}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker
                        onChange={date1}
                        format="DD-MM-YYYY"
                        placeholder={['Fecha de inicio', 'Fecha de fin']}
                        value={[req1.start_date, req1.end_date]}
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
                        value={select2}
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
                    <InputNumber min={0} max={100} value={pert2} onChange={onChangePert2}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker
                        onChange={date2}
                        format="DD-MM-YYYY"
                        placeholder={['Fecha de inicio', 'Fecha de fin']}
                        value={[req2.start_date, req2.end_date]}
                    />
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
                        value={select3}
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
                    <InputNumber min={0} max={100} value={pert3}  onChange={onChangePert3}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker
                        onChange={date3}
                        format="DD-MM-YYYY"
                        placeholder={['Fecha de inicio', 'Fecha de fin']}
                        value={[req3.start_date, req3.end_date]}
                    />
                </Col>
            </Row>



        </div>
    )
}

export default Selector




