import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment'

// import Swal from 'sweetalert2';


import config from '../config/config'
import https from 'https';
const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});




class Reports extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        searchedColumn: '',
        source:[]
      };
      this.charge = this.charge.bind(this)
      this.charge();
    };
  charge(){
    const data = [], obj = this;
    let start_dateObj, start, end, end_dateObj;
axiosInstance.get('/booking/booking')
    .then(async function (response) {
       // console.log(response.data)
        for (let i = 0; i < response.data.length; i++) {
          if(response.data[i].boo_start_date == "--" || response.data[i].boo_end_date == "--"){
            start = response.data[i].boo_start_date
            end = response.data[i].boo_end_date
          }else{
            start_dateObj = new Date(response.data[i].boo_start_date.split("T")[0]);
            start = moment(start_dateObj).add(1, 'day').format("DD-MM-YYYY");
            end_dateObj = new Date(response.data[i].boo_end_date.split("T")[0]);
            end = moment(end_dateObj).add(1, 'day').format("DD-MM-YYYY");
          }
            data.push({
                key: i,
                name: response.data[i].usr_name,
                client: response.data[i].cli_name,
                task: response.data[i].req_title,
                pert: response.data[i].boo_percentage,
                start:  start,
                end: end
            });
        }
        obj.setState({source: data})
    })
    .catch(function (error) {
        // handle error
       // console.log(error);
    })
    .then(function () {
        // always executed
       // console.log("Data successfully fetched")

    });
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
    const columns = [
      {
        title: 'Colaborador',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name','Colaborador'),
      },
      {
        title: 'Cliente',
        dataIndex: 'client',
        key: 'client',
        ...this.getColumnSearchProps('client',"Cliente"),
      },
      {
        title: 'Asignación',
        dataIndex: 'task',
        key: 'Task',
        ...this.getColumnSearchProps('task',"Asignación"),
      },
      {
          title: 'Porcentaje',
          align: 'right',
          dataIndex: 'pert',
          key: 'pert',
          ...this.getColumnSearchProps('pert',"Porcentaje"),
      },
      {
          title: 'Fecha Inicio',
          align: 'center',
          dataIndex: 'start',
          key: 'start',
      },
      {
          title: 'Fecha Fin',
          align: 'center',
          dataIndex: 'end',
          key: 'end',
      },
    ];
    return <Table columns={columns} dataSource={this.state.source} pagination={false}/>;
  }
}

export default Reports;