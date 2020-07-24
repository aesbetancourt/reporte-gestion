import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Select, Space, Table, Typography} from 'antd';
import { Empty } from 'antd';
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
      this.onChangeReq = this.onChangeReq.bind(this)
      this.charge();
    };
  charge(){
      let obj = this;
    axiosInstance.get('/report/get_request')
    .then(async function (response) {
        let requests2 = [];
        for (let i = 0; i < response.data.length; i++) {
            requests2.push(<Option key={response.data[i].req_id}>{response.data[i].req_title}</Option>);
        }
        obj.setState({ requests: requests2 })
    })
  }
   onChangeReq(value) {
    let obj = this;
    axiosInstance.get('/report/get_act_desv/'+value)
  .then(async function (response) {
    obj.setState({ data: response.data.map( (el) => {
          return {
              client: el.cli_name,
              request: el.req_title,
              activity: el.act_trello_name,
              responsable: el.req_responsable,
              start: el.act_init_real_date == null ? null : el.act_init_real_date.split("T")[0],
              end: el.act_end_real_date == null ? null : el.act_end_real_date.split("T")[0],
              estimated_end: el.act_end_date == null ? null : el.act_end_date.split("T")[0],
              deviation_days: el.act_day_desv,
              desv_pert: el.act_desv_percentage
          }
      }) })
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
    const ColReport2 = [
        {
            title: 'Cliente',
            dataIndex: 'client',
            ...this.getColumnSearchProps('client','Cliente'),
        },
        {
            title: 'Solicitud',
            dataIndex: 'request',
            ...this.getColumnSearchProps('request','Solicitud'),
        },
        {
            title: 'Actividad',
            dataIndex: 'activity',
            ...this.getColumnSearchProps('activity','Actividad'),
        },
        {
            title: 'Responsable',
            dataIndex: 'responsable',
            ...this.getColumnSearchProps('responsable','Responsable'),
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
    let locale = {
      emptyText: (<Empty description={
      <span>
        Seleccione una Solicitud
      </span>
    }/>),
    };
    
    return (
        <div>


        <div style={{paddingBottom: "20px"}}>
          <Text style={{paddingRight: "10px"}}>Selección de Solicitud</Text>
          <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Seleccione una solicitud"
              optionFilterProp="children"
              onChange={this.onChangeReq}
              filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
          >
              {this.state.requests}
          </Select>
        </div>
        <Table
            columns={ColReport2}
            locale={locale}
            title={() => 'Desviación real vs plan de actividades'}
            dataSource={this.state.data}
            bordered
            pagination={false}
        />


        </div>
    );
  }
}

export default Report2;
