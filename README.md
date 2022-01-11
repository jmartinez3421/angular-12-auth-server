# angular-12-auth-server
Backend de la aplicacion 12-auth-app creado con node y express

### Login
Para hacer el login de un usuario haremos una petición POST a la dirección `/api/auth/`, con el siguiente body:
```
{
    "email": "Test1@test.com",
    "password": "123456"
}
```


### Register
Para registrar a un nuevo usuario en la base de datos haremos una petición POST a la dirección `/api/auth/new`, con el siguiente body:
```
{
    "name": "Test1",
    "email": "Test1@test.com",
    "password": "123456"
}
```


### Renew JsonWebToken
Para renovar el JsonWebToken haremos una petición GET a la dirección `/api/auth/renew` con el header `x-token` con el valor del token del usuario

La función para generar un nuevo JWT es `generarJWT` y está en la carpeta helpers

