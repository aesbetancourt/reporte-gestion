import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
import './assets/css/navigation.css';
import Reports from './Reports';
import Selector from './Occupation';
import Report1 from './Report1';
import Report2 from './Report2';

//Keycloak disabled
// import keycloak from '../config/keycloak';


// Components

// Icons
import {
    FormOutlined,
    PieChartOutlined,
    LogoutOutlined,
    BarChartOutlined
} from '@ant-design/icons';
// import config from "../../config/config";
// import https from 'https';
// const axios = require('axios').default;
// axios.defaults.baseURL = config.backURL;
// const axiosInstance = axios.create({
//     httpsAgent: new https.Agent({
//         rejectUnauthorized: false
//     })
// });
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
    state = {
        collapsed: false,
        selected: 1
    };
    // Keycloak disabled
    //  logout() {
    //      keycloak.logout();
    // }
    render() {
        return (
            <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <a href="/">                    <img src={require('./assets/img/logo.png')} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px"}} alt="logo" />
            </a>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => this.setState({selected: 1})} className="customclass">
            Reporte de Ocupación de Colaboradores
            </Menu.Item>
            <Menu.Item key="2" icon={<FormOutlined />} onClick={() => this.setState({selected: 2})} className="customclass">
            Ocupación
            </Menu.Item>
            <SubMenu key="sub1" icon={<BarChartOutlined />} title="Reportes de Solicitudes">
              <Menu.Item key="5" onClick={() => this.setState({selected: 3})} className="customclass">
                Desv Solicitudes
              </Menu.Item>
              <Menu.Item key="6" onClick={() => this.setState({selected: 4})} className="customclass">
                Desv Actividades
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="4" icon={<LogoutOutlined />} className="customclass" onClick={()=> this.logout()} >
                Salir
            </Menu.Item>
        </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
        {/* eslint-disable-next-line react/jsx-no-undef */}
    <Title level={4} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px"}}>Reporte de Gestión</Title>
        </Header>
        <Content
        className="site-layout-background"
        style={{
            margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                flex: 'none',

        }}
    >
        {this.state.selected === 1 ? <Reports/> : null}
        {this.state.selected === 2 ? <Selector/> : null}
        {this.state.selected === 3 ? <Report1/> : null}
        {this.state.selected === 4 ? <Report2/> : null}
    </Content>
        </Layout>
        </Layout>
    );
    }
}

export default SiderDemo
