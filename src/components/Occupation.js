import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import { Select, Divider, Table, Space, Row, Col, Typography, DatePicker, InputNumber, Button } from 'antd';
import {
    DeleteFilled,
    EditFilled
} from '@ant-design/icons';

import config from '../config/config'
import https from 'https';
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
    console.log(`selected ${value}`);
}
let requests = [];
let users = [];
axiosInstance.get('/report/get_request')
    .then(async function (response) {
        console.log(response.data.length)
        for (let i = 0; i < response.data.length; i++) {
            requests.push(<Option key={response.data[i].req_id}>{response.data[i].req_title}</Option>);
        }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
        console.log("Requests successfully fetched")

    });


axiosInstance.get('/report/get_user')
    .then(async function (response) {
        console.log(response.data.length)
        for (let i = 0; i < response.data.length; i++) {
            users.push(<Option key={response.data[i].usr_id}>{response.data[i].usr_name}</Option>);
        }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
        console.log("Users successfully fetched")

    });




const Selector = () => {
    const [data, setData] = useState([]);

    // async function fillData(){
    //     let info = await getRequests()
    //     console.log(info)
    //     setRequest(info)
    //
    // }
    //
    // useEffect(() => {
    //     fillData()
    // }, [])
    function onChange(value) {
        console.log(`selected ${value}`);
    }
    async function onChangeReq(value) {
        let table = []
        console.log(`selected ${value}`);
        await axiosInstance.get(`/report/get_req/${value}`)
            .then(async function (response) {
                console.log(response.data)
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response.data[i])
                    await table.push({
                        solicitud: response.data[i].req_name,
                        resource: response.data[i].name,
                        pert: response.data[i].boo_percentage,
                        start: response.data[i].boo_start_date,
                        end: response.data[i].boo_end_date
                    });
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                console.log("Table successfully fetched")
                console.log(table)
                setData(table)
            });


    }

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
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
                    <a><DeleteFilled /></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a><EditFilled /></a>

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
                        onChange={onChange}
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
                    <InputNumber min={0} max={100} defaultValue={50}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker/>
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
                        onChange={onChange}
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
                    <InputNumber min={0} max={100} defaultValue={50}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker/>
                </Col>
                <Col span={4}>
                    <Button type="primary" style={{ backgroundColor: "#08979c", borderColor: "#08979c" }}> Asignar recursos</Button>
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
                        onChange={onChange}
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
                    <InputNumber min={0} max={100} defaultValue={50}/>
                </Col>
                <Col span={8}>
                    {/*    Fechas*/}
                    <Text style={{paddingRight: "10px", marginLeft: "-45px"}}>Fechas</Text>
                    <RangePicker/>
                </Col>
            </Row>



        </div>
    )
}

export default Selector




