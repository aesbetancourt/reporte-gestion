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




//cli_id: 1
//cli_name: "Mayoreo"
//req_date: null
//req_day_desv: null
//req_deviations_ptge: null
//req_final_date: "9999-12-31T00:00:00.000Z"
//req_id: 47
//req_init_date: "9999-12-31T00:00:00.000Z"
//req_real_final_date: null
//req_responsable: null
//req_title: "Modificaciones de la página Web de Beco


// Selects
let table = [];
axiosInstance.get('/report/get_req_desv')
    .then(async function (response) {
        //console.log(response.data)
        for (let i = 0; i < response.data.length; i++) {
          table.push({
            client: response.data[i].cli_name,
            title: response.data[i].req_title,
            responsable: response.data[i].responsable,
            req_date: response.data[i].req_date.split("T")[0],
            start: response.data[i].req_init_date.split("T")[0],
            end: response.data[i].req_final_date.split("T")[0],
            estimated_end: response.data[i].req_real_final_date,
            deviation_days: response.data[i].req_day_desv,
            desv_pert: response.data[i].req_deviations_ptge
          })
        }
    })
    .catch(function (error) {
      console.log(error)
    })
    .then(function () {
      console.log("Data successfully fetched! (Report1)")
    });






const Report1 = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
      setData(table)
    }, [])
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
    return (
        <div>
        <Table
            columns={report1}
            dataSource={data}
            title={() => 'Desviación real vs plan de solicitudes'}
            bordered
        />
        </div>
    )
}

export default Report1
