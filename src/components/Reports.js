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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
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
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Cliente',
        dataIndex: 'client',
        key: 'client',
        ...this.getColumnSearchProps('client'),
      },
      {
        title: 'Asignación',
        dataIndex: 'Task',
        key: 'Task',
        ...this.getColumnSearchProps('Task'),
      },
      {
          title: 'Porcentaje',
          dataIndex: 'pert',
          key: 'pert',
          ...this.getColumnSearchProps('pert'),
      },
      {
          title: 'Fecha Inicio',
          dataIndex: 'start',
          key: 'start',
          ...this.getColumnSearchProps('start'),
      },
      {
          title: 'Fecha Fin',
          dataIndex: 'end',
          key: 'end',
          ...this.getColumnSearchProps('end'),
      },
    ];
    return <Table columns={columns} dataSource={data} pagination={false}/>;
  }
}

export default Reports;