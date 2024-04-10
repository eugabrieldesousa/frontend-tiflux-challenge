import React, { useState, useEffect } from 'react';
import { Layout, Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import logo from './img/image.png';
const { Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;

const App = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:3001/clientes');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleCreateCliente = async (values) => {
    try {
      const response = await fetch('http://localhost:3001/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const novoCliente = await response.json();
        setData([...data, novoCliente]);
        setOpen(false);
        message.success('Cliente cadastrado com sucesso!');
      } else {
        throw new Error('Erro ao cadastrar o cliente');
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      message.error('Erro ao cadastrar o cliente');
    }
  };

  const handleEditCliente = async (values) => {
    const id = modalData.id;
    try {
      const response = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const clienteAtualizado = await response.json();
        setData(data.map(cliente => (cliente.id === id ? clienteAtualizado : cliente)));
        setModalData({});
        setEditMode(false);
        setOpen(false);
        message.success('Cliente atualizado com sucesso!');
      } else {
        throw new Error('Erro ao atualizar o cliente');
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      message.error('Erro ao atualizar o cliente');
    }
  };

  const handleDeleteCliente = async (id) => {
    try {
      await fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'DELETE',
      });
      setData(data.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const handleEditClick = (record) => {
    // Remove espaços extras dos valores antes de definir o estado do modal
    const trimmedRecord = Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    setModalData(trimmedRecord);
    setEditMode(true);
    setOpen(true);
  };

  const handleModalCancel = () => {
    setModalData({});
    setEditMode(false);
    setOpen(false);
  };

  const NovoClienteForm = ({ onCreate, editMode, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }, [editMode, form, initialValues]);

    const onFinish = (values) => {
      if (editMode) {
        handleEditCliente(values);
      } else {
        onCreate(values);
      }
      form.resetFields();
    };

    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Por favor, insira o nome do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cpf_cnpj" label="CPF/CNPJ" rules={[{ required: true, message: 'Por favor, insira o CPF/CNPJ do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="endereco_cep" label="CEP" rules={[{ required: true, message: 'Por favor, insira o CEP do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="endereco_rua" label="Rua" rules={[{ required: true, message: 'Por favor, insira a rua do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="endereco_numero" label="Número" rules={[{ required: true, message: 'Por favor, insira o número do endereço do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="telefone" label="Telefone" rules={[{ required: true, message: 'Por favor, insira o telefone do cliente!' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editMode ? 'Atualizar Cliente' : 'Criar Cliente'}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider className="custom-sider" style={{ backgroundColor: '#03363D' }}>
        <div className="demo-logo-vertical" />
        <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '35px' }}>
          <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button type="text" style={{ color: 'white', margin: '20px'}}  onMouseEnter={(e) => e.target.style.color = '#1890ff'} onMouseLeave={(e) => e.target.style.color = 'white'}>
            Clientes
          </Button>
          <Button type="text" style={{ color: 'white', margin: '0px'}}  onMouseEnter={(e) => e.target.style.color = '#1890ff'} onMouseLeave={(e) => e.target.style.color = 'white'}>
            Desconectar
          </Button>
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '350px', marginTop: '130px'}}>
              <Button type="primary" onClick={() => setOpen(true)} style={{ width: '120px', backgroundColor: '#0CC4B6', border: 'none' }} icon={<PlusOutlined />}>
               Cliente
              </Button>
              <Modal
                title={editMode ? 'Editar Cliente' : 'Novo Cliente'}
                visible={open}
                onCancel={handleModalCancel}
                footer={null}
              >
                <NovoClienteForm onCreate={handleCreateCliente} editMode={editMode} initialValues={modalData} />
              </Modal>
            </div>
          </div>
          <div style={{ padding: 24, minHeight: 360, background: '#E5E5E5', borderRadius: '10px', fontWeight: 'bold', fontSize: '25px' }}>
            <Table dataSource={data}>
              <ColumnGroup title="Clientes">
                <Column title="Nome" dataIndex="nome" key="nome" />
                <Column title="CPF/CNPJ" dataIndex="cpf_cnpj" key="cpf_cnpj" />
                <Column
                  title="Endereço"
                  key="endereco"
                  render={(text, record) => (
                    <span>{record.endereco_cep}, {record.endereco_rua}, {record.endereco_numero}</span>
                  )}
                />
                <Column
                  title="Contatos"
                  key="contato"
                  render={(text, record) => (
                    <span>{record.email}, {record.telefone}</span>
                  )}
                />
                <Column
                  title="Ações"
                  key="action"
                  render={(_, record) => (
                    <Space size="middle">
                      <EditOutlined onClick={() => handleEditClick(record)} />
                      <DeleteOutlined onClick={() => handleDeleteCliente(record.id)} />
                    </Space>
                  )}
                />
              </ColumnGroup>
            </Table>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Desafio Full-Stack ©{new Date().getFullYear()} Criado por Gabriel de Sousa
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
