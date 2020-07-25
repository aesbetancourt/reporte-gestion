import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Select, Space, Table, Typography} from 'antd';
import { Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
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
        source:[],
        tableFontSize: 11,
        tableHeaderSize: 12
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
    console.log(response.data)
    obj.setState({ data: response.data.map((el) => {
          return {
              client: el.cli_name,
              request: el.req_title,
              activity: el.act_trello_name,
              responsable: el.req_responsable,
              start: el.act_init_date == null ? null : el.act_init_date.split("T")[0],
              end: el.act_end_date == null ? null : el.act_end_date.split("T")[0],
              estimated_end: el.act_real_end_date == null ? null : el.act_real_end_date.split("T")[0],
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
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Cliente
          </Text>),
            dataIndex: 'client',
            ...this.getColumnSearchProps('client','Cliente'),
            render: (client, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {client}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Solicitud
          </Text>),
            dataIndex: 'request',
            ...this.getColumnSearchProps('request','Solicitud'),
            render: (request, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {request}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Actividad
          </Text>),
            dataIndex: 'activity',
            ...this.getColumnSearchProps('activity','Actividad'),
            render: (activity, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {activity}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Responsable
          </Text>),
            dataIndex: 'responsable',
            ...this.getColumnSearchProps('responsable','Responsable'),
            render: (responsable, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {responsable}
              </Typography.Text>)
        },

        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Fecha Inicio
          </Text>),
            align: 'center',
            dataIndex: 'start',
            ...this.getColumnSearchProps('start','Fecha Inicio'),
            render: (start, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {start}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Fecha Fin
          </Text>),
            align: 'center',
            dataIndex: 'end',
            ...this.getColumnSearchProps('end','Fecha Fin'),
            render: (end, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {end}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Fecha Fin Estimada Real
          </Text>),
            align: 'center',
            dataIndex: 'estimated_end',
            ...this.getColumnSearchProps('estimated_end','Fecha Fin Estimada Real'),
            render: (estimated_end, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {estimated_end}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Dias Desviación
          </Text>),
            align: 'right',
            dataIndex: 'deviation_days',
            ...this.getColumnSearchProps('deviation_days','Dias Desviación'),
            render: (deviation_days, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {deviation_days}
              </Typography.Text>)
        },
        {
            title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
              % Desviación
            </Text>),
            align: 'right',
            dataIndex: 'desv_pert',
            ...this.getColumnSearchProps('desv_pert','% Desviación'),
            render: (desv_pert, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {desv_pert}
              </Typography.Text>)
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
            pagination={false}
            size="small"
        />


        </div>
    );
  }
}

export default Report2;
