import React from 'react';
import 'antd/dist/antd.css';
import { Select, Divider, Table, Space, Row, Col, Typography, DatePicker, InputNumber, Button } from 'antd';
import {
    DeleteFilled,
    EditFilled
} from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;


const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

const Selector = () => {

    function onChange(value) {
        console.log(`selected ${value}`);
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
            dataIndex: 'Resource',
        },
        {
            title: 'Grupo',
            dataIndex: 'group_name',
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
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {children}
            </Select>
            <Divider/>
            <Table
                columns={columns}
                //dataSource={data}
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
                        {children}
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
                        {children}
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
                        {children}
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




