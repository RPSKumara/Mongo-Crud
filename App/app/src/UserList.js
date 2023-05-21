import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const url = "http://localhost:3000/";
  const fetchUsers = () => {
    axios
      .get(`${url}users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createUser = () => {
    axios
      .post(`${url}users`, { name, email, age })
      .then((response) => {
        console.log(response.data);
        fetchUsers();
        setName("");
        setEmail("");
        setAge("");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteUser = (userId) => {
    axios
      .delete(`${url}users/${userId}`)
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const startEdit = (user) => {
    setEditUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    axios
      .patch(`${url}users/${editUserId}`, { name, email, age })
      .then(() => {
        fetchUsers();
        cancelEdit();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setName("");
    setEmail("");
    setAge("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={createUser} variant="contained" color="primary">
                Add User
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {users.map((user) => (
            <Card key={user._id} sx={{ mb: 2 }}>
              <CardContent>
                {editUserId === user._id ? (
                  <form onSubmit={handleUpdateUser}>
                    <TextField
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="contained"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <Typography variant="h5" component="h2">
                      {user.name}
                    </Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Typography>Age: {user.age}</Typography>
                    <Button
                      onClick={() => startEdit(user)}
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteUser(user._id)}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="User added successfully!"
      />
    </Container>
  );
};

export default UserList;
