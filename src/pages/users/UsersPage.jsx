import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";

function UsersPage() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    loadUsers();

  }, []);

  const loadUsers = async () => {

    try {

      const data = await getUsers();

      setUsers(data);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div>
      <h1>Usuarios</h1>

      {users.map((user) => (
        <div key={user.id}>

          <p>
            {user.firstName} {user.lastName}
          </p>

          <p>{user.institutionalEmail}</p>

          <p>{user.role}</p>

          <hr />

        </div>
      ))}
    </div>
  );
}

export default UsersPage;