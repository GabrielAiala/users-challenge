import {
  useState,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { delteUser, getUsers } from "../../services/userService";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(query);  // Chama o serviço que consome a API
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  const handleClickDelete = (id) => {
    delteUser(id).then(() => {
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== id))
    }).catch((error) => {
      console.error('Erro ao carregar usuários:', error)
    });
  }

  const handleClickPesquisar = () => {
    setQuery(inputValue);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} >
          <TextField
            id="search"
            label="Pesquisa"
            defaultValue="Hello World"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <Button
            variant="contained"
            onClick={handleClickPesquisar}
          >
            Pesquisar
          </Button>
        </Stack>
        <Button
          variant="contained"
          to="novo"
        >
          Novo usuario
        </Button>
        {users.map(user => (
          <Card key={user.id}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {user.name}
              </Typography>
              <Typography variant="body1" >
                email: {user.email}
              </Typography>
              <Typography variant="body1">
                cpf: {user.cpf}
              </Typography>
              <Typography variant="h5">
                Endereços:
              </Typography>
              {user.addresses?.map(address => (
                <Typography key={address.id} variant="body1">
                  - {address.address} n° {address.number}, {address.city}
                </Typography>
              ))}

            </CardContent>
            <CardActions>
              <Button
                size="small"
                to={`editar/${user.id}`}
              >
                Editar
              </Button>
              <Button
                size="small"
                onClick={() => handleClickDelete(user.id)}
              >
                Deletar
              </Button>
            </CardActions>
          </Card>
        ))}

      </Stack>
    </Container>
  );
}