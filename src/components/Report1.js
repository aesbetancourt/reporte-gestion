import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Select, Space, Table, Typography} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

// import Swal from 'sweetalert2';


import config from '../config/config'
import https from 'https';

const { Option } = Select;
const { Text } = Typography;

const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});








class Report2 extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        requests: [],
        searchText: '',
        searchedColumn: '',
        source:[]
      };
      this.charge = this.charge.bind(this)
      this.charge();
    };
  charge(){
      let obj = this;
      axiosInstance.get('/report/get_req_desv')
      .then(async function (response) {
          obj.setState({data: response.data.map( (el,i) => {
              return {
                client: response.data[i].cli_name,
                title: response.data[i].req_title,
                responsable: response.data[i].responsable,
                req_date: response.data[i].req_date == null ? null : response.data[i].req_date.split("T")[0],
                start: response.data[i].req_init_date == null ? null : response.data[i].req_init_date.split("T")[0], 
                end: response.data[i].req_final_date == null ? null : response.data[i].req_final_date.split("T")[0], 
                estimated_end: response.data[i].req_real_final_date == null ? null : response.data[i].req_real_final_date.split("T")[0], 
                deviation_days: response.data[i].req_day_desv,
                desv_pert: response.data[i].req_deviations_ptge
              }
          })})
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Buscar ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const report1 = [
        {
            title: 'Cliente',
            dataIndex: 'client',
            ...this.getColumnSearchProps('client','Cliente'),
        },
        {
            title: 'Titulo',
            dataIndex: 'title',
            ...this.getColumnSearchProps('title','Titulo'),
        },
        {
            title: 'Responsable',
            dataIndex: 'responsable',
            ...this.getColumnSearchProps('responsable','Responsable'),
        },
        {
            title: 'Fecha Solicitud',
            align: 'center',
            dataIndex: 'req_date',
            ...this.getColumnSearchProps('req_date','Fecha Solicitud'),
        },
        {
            title: 'Fecha Inicio',
            align: 'center',
            dataIndex: 'start',
            ...this.getColumnSearchProps('start','Fecha Inicio'),
        },
        {
            title: 'Fecha Fin',
            align: 'center',
            dataIndex: 'end',
            ...this.getColumnSearchProps('end','Fecha Fin'),
        },
        {
            title: 'Fecha Fin Estimada Real',
            align: 'center',
            dataIndex: 'estimated_end',
            ...this.getColumnSearchProps('estimated_end','Fecha Fin Estimada Real'),
        },
        {
            title: 'Dias Desviación',
            align: 'right',
            dataIndex: 'deviation_days',
            ...this.getColumnSearchProps('deviation_days','Dias Desviación'),
        },
        {
            title: '% Desviación',
            align: 'right',
            dataIndex: 'desv_pert',
            ...this.getColumnSearchProps('desv_pert','% Desviación'),
        },


    ];
    return (
        <div>
        <Table
            columns={report1}
            dataSource={this.state.data}
            title={() => 'Desviación real vs plan de solicitudes'}
            bordered
            pagination={false}
        />
        </div>
    );
  }
}

export default Report2;
