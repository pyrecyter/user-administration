import {
  Alert,
  Button,
  Col,
  Input,
  notification,
  Row,
  Table,
  TablePaginationConfig,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Link } from "react-router-dom";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
}

interface DataType {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const Home = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const [api, contextHolder] = notification.useNotification();
  const [searchVal, setSearchVal] = useState("");

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
      },
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: {
        compare: (a, b) => a.last_name.localeCompare(b.last_name),
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (val) => <a href={"mailto:" + val}>{val}</a>,
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "Actions",
      render: (val, rec, index) => (
        <div>
          <Link to={"edit/" + rec.id}>
            <Button style={{ marginRight: "10px" }} type="primary">
              Edit
            </Button>
          </Link>
          <Button type="primary" danger onClick={() => deleteUser(rec.id)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const deleteUser = (id: number) => {
    fetch(`https://reqres.in/api/users/${id}`, { method: "delete" })
      .then(() => {
        api.success({
          message: "User removed",
        });
        fetchData();
      })
      .catch((e) => {
        api.error({
          message: "Error removing user!",
        });
      });
  };

  const fetchData = () => {
    setLoading(true);
    fetch(
      qs.stringifyUrl({
        url: "https://reqres.in/api/users",
        query: {
          per_page: tableParams.pagination?.pageSize,
          page: tableParams.pagination?.current,
        },
      })
    )
      .then((res) => res.json())
      .then(({ data, total, page }) => {
        setData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: page,
            total: total,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onSearch = (event: any) => {
    setSearchVal(event.target.value);
  };

  return (
    <>
      {contextHolder}
      <Row align="middle" justify="space-between">
        <Col>
          <h1>User Administration</h1>
        </Col>
        <Col>
          <Link to="/create">
            <Button type="primary">Create User</Button>
          </Link>
        </Col>
      </Row>
      <Input
        style={{
          padding: "10px",
          marginBottom: "10px",
          marginTop: "10px",
          width: "30%",
          minWidth: "200px",
        }}
        placeholder="Search..."
        onChange={onSearch}
      />
      <Table
        sticky
        columns={columns}
        dataSource={
          searchVal === ""
            ? data
            : data?.filter(
                (e) =>
                  e.first_name.toLowerCase().includes(searchVal) ||
                  e.last_name.toLowerCase().includes(searchVal) ||
                  e.email.toLowerCase().includes(searchVal)
              )
        }
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Home;
