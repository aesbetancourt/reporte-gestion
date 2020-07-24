import Swal from 'sweetalert2'
import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, DatePicker, Divider, InputNumber, Row, Select, Space, Table, Typography} from 'antd';
import { Tabs } from 'antd';
import {DeleteFilled, EditFilled} from '@ant-design/icons';
import moment from 'moment'

import config from '../config/config'
import https from 'https';
import Reports from "./Reports";

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});





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




const Report1 = () => {
    const [data, setData] = useState([]);

  

    const report1 = [
        {
            title: 'Cliente',
            dataIndex: 'client',
        },
        {
            title: 'Titulo',
            dataIndex: 'title',
        },
        {
            title: 'Responsable',
            dataIndex: 'responsable',
        },
        {
            title: 'Fecha Solicitud',
            align: 'center',
            dataIndex: 'req_date'
        },
        {
            title: 'Fecha Inicio',
            align: 'center',
            dataIndex: 'start'
        },
        {
            title: 'Fecha Fin',
            align: 'center',
            dataIndex: 'end'
        },
        {
            title: 'Fecha Fin Estimada Real',
            align: 'center',
            dataIndex: 'estimated_end'
        },
        {
            title: 'Dias Desviación',
            align: 'right',
            dataIndex: 'deviation_days'
        },
        {
            title: '% Desviación',
            align: 'right',
            dataIndex: 'desv_pert'
        },


    ];
    const report2 = [
        {
            title: 'Cliente',
            dataIndex: 'client',
        },
        {
            title: 'Solicitud',
            dataIndex: 'request',
        },
        {
            title: 'Actividad',
            dataIndex: 'activity',
        },
        {
            title: 'Responsable',
            dataIndex: 'responsable',
        },

        {
            title: 'Fecha Inicio',
            align: 'center',
            dataIndex: 'start'
        },
        {
            title: 'Fecha Fin',
            align: 'center',
            dataIndex: 'end'
        },
        {
            title: 'Fecha Fin Estimada Real',
            align: 'center',
            dataIndex: 'estimated_end'
        },
        {
            title: 'Dias Desviación',
            align: 'right',
            dataIndex: 'deviation_days'
        },
        {
            title: '% Desviación',
            align: 'right',
            dataIndex: 'desv_pert'
        },


    ];
    return (
        <div>
        <Table
            columns={report1}
            //  dataSource={data}
            title={() => 'Desviación real vs plan de solicitudes'}
            bordered
        />

        </div>
    )
}

export default Report1
