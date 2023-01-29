import { notification } from "antd";
import UserForm from "../components/UserForm";

const CreateUser = () => {
  const [api, contextHolder] = notification.useNotification();

  const onFinish = (val: any) => {
    fetch("https://reqres.in/api/users", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(val),
    })
      .then(() => {
        api.success({ message: "User created!" });
      })
      .catch((e) => {
        api.error({ message: "User not created!" });
      });
  };

  return (
    <>
      {contextHolder}
      <h1>Create User</h1>
      <hr />
      <UserForm onFinish={onFinish} />
    </>
  );
};

export default CreateUser;
