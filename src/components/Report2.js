import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Select, Space, Table, Typography} from 'antd';
import { Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';



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
        clients: [],
        searchText: '',
        searchedColumn: '',
        source:[],
        tableFontSize: 11,
        tableHeaderSize: 12,
        selectReq: false
      };
      this.charge = this.charge.bind(this)
      this.onChangeReq = this.onChangeReq.bind(this)
      this.onChangeCli = this.onChangeCli.bind(this)
      this.charge();
    };
  charge(){
      let obj = this;
    axiosInstance.get('/report/get_client')
    .then(async function (response) {
        let requests3 = [];
        for (let i = 0; i < response.data.length; i++) {
            requests3.push(<Option key={response.data[i].cli_id}>{response.data[i].cli_name}</Option>);
        }
        obj.setState({ clients: requests3 })
    })
  }
   onChangeReq(value) {
    let obj = this;
    axiosInstance.get('/report/get_act_desv/'+value)
  .then(async function (response) {
    let startObj, start, endObj, end, estimated_endObj, estimated_end;
    obj.setState({ data: response.data.map((el) => {
      startObj = el.act_init_date === null ? "Fecha invalida" : el.act_init_date.split("T")[0];
      start = startObj === "Fecha invalida"  ? startObj : moment(startObj).format("DD-MM-YYYY");
      endObj = el.act_end_date === null ? "Fecha invalida" : el.act_end_date.split("T")[0];
      end = endObj === "Fecha invalida"  ? endObj : moment(endObj).format("DD-MM-YYYY");
      estimated_endObj = el.act_real_end_date === null ? "Fecha invalida" : el.act_real_end_date.split("T")[0];
      estimated_end = estimated_endObj === "Fecha invalida"  ? estimated_endObj : moment(estimated_endObj).format("DD-MM-YYYY");
          return {
              client: el.cli_name,
              request: el.req_title,
              activity: el.act_trello_name,
              responsable: el.req_responsable,
              start: start,
              end: end,
              estimated_end: estimated_end,
              deviation_days: el.act_day_desv,
              desv_pert: el.act_desv_percentage
          }
      }) })
  })
  }

  onChangeCli(value){
    let obj = this;
    console.log(value)

    axiosInstance.get('/report/get_reqbycli/'+value)
    .then(async function (response) {
        let requests2 = [];
        for (let i = 0; i < response.data.length; i++) {
            requests2.push(<Option key={response.data[i].req_id}>{response.data[i].req_title}</Option>);
        }
        obj.setState({ requests: requests2 })
        obj.setState({ selectReq: true })


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
        {/*
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
        */},
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
            F. Inicio
          </Text>),
            align: 'center',
            dataIndex: 'start',
            width: "10%",
            ...this.getColumnSearchProps('start','F. Inicio'),
            render: (start, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {start}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            F. Fin
          </Text>),
            align: 'center',
            dataIndex: 'end',
            width: "10%",
            ...this.getColumnSearchProps('end','F. Fin'),
            render: (end, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {end}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            F. Fin Real
          </Text>),
            align: 'center',
            dataIndex: 'estimated_end',
            width: "10%",
            ...this.getColumnSearchProps('estimated_end','Fecha Fin Estimada Real'),
            render: (estimated_end, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {estimated_end}
              </Typography.Text>)
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Dias Desv
          </Text>),
            align: 'right',
            dataIndex: 'deviation_days',
            ...this.getColumnSearchProps('deviation_days','Dias Desv'),
            render: (deviation_days, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {deviation_days}
              </Typography.Text>)
        },
        {
            title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
              % Desv
            </Text>),
            align: 'right',
            dataIndex: 'desv_pert',
            ...this.getColumnSearchProps('desv_pert','% Desv'),
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
          <Input.Group compact>
          <Select
            placeholder="Seleccione un cliente"
            showSearch
            onChange={this.onChangeCli}
            style={{ width: 300 }}
          >
            {this.state.clients}
          </Select>
          {this.state.selectReq === false ?
              <Select
                disabled
                showSearch
                style={{ width: 770 }}
                placeholder="Seleccione una solicitud"
              >
              </Select>
             :
               <Select
                   showSearch
                   style={{ width: 770 }}
                   placeholder="Seleccione una solicitud"
                   optionFilterProp="children"
                   onChange={this.onChangeReq}
                   filterOption={(input, option) =>
                       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                   }
               >
                   {this.state.requests}
               </Select>
            }


          </Input.Group>

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
