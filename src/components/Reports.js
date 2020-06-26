import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Divider} from 'antd';
// import Swal from 'sweetalert2';


// import config from "../../config/config";
// import https from 'https';
// const axios = require('axios').default;
// axios.defaults.baseURL = config.backURL;
// const axiosInstance = axios.create({
//     httpsAgent: new https.Agent({
//         rejectUnauthorized: false
//     })
// });





const Reports = () =>  {

    const columns = [
        {
            title: 'Colaborador',
            dataIndex: 'name',
        },
        {
            title: 'Cliente',
            dataIndex: 'client',
        },
        {
            title: 'Asignación',
            dataIndex: 'task',
        },
        {
            title: 'Porcentaje',
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

    ];
    // Llenado de datos de prueba
    const data = [];
    for (let i = 0; i < 46; i++) {
        data.push({
            key: i,
            name: `Colaborador ${i}`,
            client: `Cliente ${i}`,
            task: `Asignacion ${i}`,
            pert: `pert ${i}`,
            start:  `Inicio ${i}`,
            end: `Fin ${i}`,
        });
    }



    return(
        <div>
            <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={false}
            />
        </div>
    )

};

export default Reports