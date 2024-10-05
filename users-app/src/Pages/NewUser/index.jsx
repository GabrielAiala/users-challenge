import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useForm, Controller, useFieldArray } from "react-hook-form"

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { createUser, getUser, updateUser } from "../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const schema = yup
  .object({
    name: yup.string().required(),
    cpf: yup.string().required(),
    email: yup.string().email().required(),
    addresses_attributes: yup
      .array()
      .of(
        yup.object({
          id: yup.number().nullable(),
          address: yup.string().required("Address is required"),
          number: yup.number().required("Address is required"),
          city: yup.string().required("Address is required"),
        })
      )
  })
  .required()

export default function NewUser() {
  const [serverAddresses, setServerAddresses] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses_attributes",
  });


  const onSubmit = async(data) => {
    try {

      const currentAddresses = data.addresses_attributes;

      const addressesWithDestroyFlag = serverAddresses.map((serverAddress) => {
        const stillExists = currentAddresses.some(
          (current) => current.id === serverAddress.id
        );
        if (!stillExists) {
          return { ...serverAddress, _destroy: true };
        }
        return serverAddress;
      });

      const finalAddresses = [...currentAddresses, ...addressesWithDestroyFlag];
      const finalData = { ...data, addresses_attributes: finalAddresses };

      if (id) {
        await updateUser(id, finalData);
      } else {
        await createUser(data);
      }
    }catch(error) {
      console.log(error);
    } finally {
      navigate("/");
    }
  }

  useEffect(() => {
    getUser(id).then((data) => {
      setValue('name', data.name);
      setValue('cpf', data.cpf);
      setValue('email', data.email);

      if ( getValues("addresses_attributes").length === 0 &&data.addresses && data.addresses.length > 0) {
        setServerAddresses(data.addresses);
        data.addresses.forEach(address => {
          append({
            id: address.id,
            address: address.address || "",
            number: address.number || "",
            city: address.city || "",
          });
        });
      }

    })
  }, [id, append, setValue]);

  return (
    <Container >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography>
          Novo Usuario
        </Typography>
        <Stack spacing={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="name"
                variant="outlined"
                {...field}
                error={"name" in errors && touchedFields.name == true}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="email"
                variant="outlined"
                {...field}
                error={"email" in errors && touchedFields.email == true}
              />
            )}
          />
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <TextField
                label="cpf"
                variant="outlined"
                {...field}
                error={"cpf" in errors && touchedFields.cpf == true}
              />
            )}
          />

          <Typography>
            Endereços
          </Typography>

          {fields.map((field, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={2}>
              <Controller
                name={`addresses_attributes.${index}.address`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="endereço"
                    variant="outlined"
                    {...field}
                    error={errors.addresses_attributes && "address" in errors.addresses_attributes[index] && touchedFields.addresses_attributes && touchedFields.addresses_attributes[index].address == true}
                  />
                )}
              />
              <Controller
                name={`addresses_attributes.${index}.number`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="numero"
                    variant="outlined"
                    {...field}
                    error={errors.addresses_attributes && "number" in errors.addresses_attributes[index] && touchedFields.addresses_attributes && touchedFields.addresses_attributes[index].number == true}

                  />
                )}
              />
              <Controller
                name={`addresses_attributes.${index}.city`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="cidade"
                    variant="outlined"
                    {...field}
                    error={errors.addresses_attributes && "city" in errors.addresses_attributes[index] && touchedFields.addresses_attributes && touchedFields.addresses_attributes[index].city == true}
                  />
                )}
              />
              <Button
                variant="outlined"
                onClick={() => remove(index)}
              >
                Remover
              </Button>
            </Stack>
          ))}
          <Button
            variant="outlined"
            onClick={() => append({ address: "", number: null, city: "" })}
          >
            Adicionar endereço
          </Button>

          <Button variant="contained" type="submit">Salvar usuario</Button>
        </Stack >
      </form>
    </Container >
  );
}