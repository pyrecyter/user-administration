import { notification, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";

const EditUser = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://reqres.in/api/users/${id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        if (!data) navigate("/");
        setData(data);
        setIsLoading(false);
      })
      .catch((e) => {
        navigate(-1);
      });
  }, [id]);

  const onFinish = (val: any) => {
    fetch(`https://reqres.in/api/users/${id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(val),
    })
      .then(() => {
        api.success({ message: "User updated!" });
      })
      .catch((e) => {
        api.error({ message: "User not updated!" });
      });
  };

  return (
    <>
      {contextHolder}
      <h1>Edit User</h1>
      <hr />
      {isLoading ? (
        <Skeleton />
      ) : (
        <UserForm initialValues={data} onFinish={onFinish} />
      )}
    </>
  );
};

export default EditUser;
