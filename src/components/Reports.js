import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


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

const data = [];
axiosInstance.get('/booking/booking')
    .then(async function (response) {
        console.log(response.data)
        for (let i = 0; i < response.data.length; i++) {
            data.push({
                key: i,
                name: response.data[i].usr_name,
                client: response.data[i].cli_name,
                task: response.data[i].req_id,
                pert: response.data[i].boo_percentage,
                start:  response.data[i].boo_start_date,
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
        console.log("Data successfully fetched")

    });



class Reports extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
    };

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
            Reiniciar
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
          dataIndex: 'pert',
          key: 'pert',
          ...this.getColumnSearchProps('pert',"Porcentaje"),
      },
      {
          title: 'Fecha Inicio',
          dataIndex: 'start',
          key: 'start',
      },
      {
          title: 'Fecha Fin',
          dataIndex: 'end',
          key: 'end',
      },
    ];
    return <Table columns={columns} dataSource={data} pagination={false}/>;
  }
}

export default Reports;