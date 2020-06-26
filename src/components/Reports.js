import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
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
        dataIndex: 'Task',
        key: 'Task',
        ...this.getColumnSearchProps('Task',"Asignación"),
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