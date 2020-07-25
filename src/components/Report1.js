import React from 'react';
import 'antd/dist/antd.css';
import {Button, Input, Select, Space, Table, Typography, Empty} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment'

// import Swal from 'sweetalert2';


import config from '../config/config'
import https from 'https';

const { Option } = Select;
const { Text, Title } = Typography;

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
      this.charge();
    };
  charge(){
      let obj = this;
      axiosInstance.get('/report/get_req_desv')
      .then(async function (response) {
          //console.log(response.data)
          obj.setState({data: response.data.map( (el,i) => {
            let req_dateObj = response.data[i].req_date === null ? new Date("0000-00-00") : new Date(response.data[i].req_date.split("T")[0]);
            let req_date = moment(req_dateObj).format("DD-MM-YYYY");

            let startObj = response.data[i].req_init_date === null ? new Date("0000-00-00") : new Date(response.data[i].req_init_date.split("T")[0]);
            let start = moment(startObj).format("DD-MM-YYYY");

            let endObj = response.data[i].req_final_date === null ? new Date("0000-00-00") : new Date(response.data[i].req_final_date.split("T")[0]);
            let end = moment(endObj).format("DD-MM-YYYY");

            let estimatedObj = response.data[i].req_real_final_date === null ? new Date("0000-00-00") : new Date(response.data[i].req_real_final_date.split("T")[0]);
            let estimated_end = moment(estimatedObj).format("DD-MM-YYYY");

              return {
                client: response.data[i].cli_name,
                title: response.data[i].req_title,
                responsable: response.data[i].req_responsable,
                req_date: req_date,
                start: start,
                end: end,
                estimated_end: estimated_end,
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
            title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
              Cliente
            </Text>),
            dataIndex: 'client',
            ...this.getColumnSearchProps('client','Cliente'),
            render: (client, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {client}
              </Typography.Text>
            )
        },
        {
          title: (<Text style={{ fontSize: this.state.tableHeaderSize }}>
            Título
          </Text>),
            dataIndex: 'title',
            ...this.getColumnSearchProps('title','Titulo'),
            render: (title, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {title}
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
            Fecha Solicitud
          </Text>),
            align: 'center',
            dataIndex: 'req_date',
            ...this.getColumnSearchProps('req_date','Fecha Solicitud'),
            render: (req_date, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {req_date}
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
            width: "5%",
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
            width: "5%",
            dataIndex: 'desv_pert',
            ...this.getColumnSearchProps('desv_pert','% Desviación'),
            render: (desv_pert, record) => (
              <Typography.Text style={{ fontSize: this.state.tableFontSize }}>
                {desv_pert}
              </Typography.Text>)
        }
    ];

    let locale = {
      emptyText: (<Empty description={
      <span>
        Sin Datos
      </span>
    }/>),
    };
    return (
        <div>
        <Table
            locale={locale}
            columns={report1}
            dataSource={this.state.data}
            title={() => 'Desviación real vs plan de solicitudes'}
            pagination={false}
            size="small"
        />
        </div>
    );
  }
}

export default Report2;
