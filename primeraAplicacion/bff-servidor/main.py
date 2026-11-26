import asyncio
import json
import time
from datetime import datetime
import strawberry
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from strawberry.fastapi import GraphQLRouter

# Datos simulados en memoria
perfil_db = {
    "id": 1,
    "nombre": "Fulanito Perez Gomez",
    "email": "hola@ejemplo.com",
    "telefono": "5555555555",
}

@strawberry.type
class Perfil:
    id: int
    nombre: str
    email: str
    telefono: str

@strawberry.type
class Query:
    @strawberry.field
    def perfil(self) -> Perfil:
        return Perfil(**perfil_db)

@strawberry.type
class Mutation:
    @strawberry.mutation
    def actualizar_telefono(self, telefono: str) -> Perfil:
        perfil_db["telefono"] = telefono
        return Perfil(**perfil_db)

schema = strawberry.Schema(query=Query, mutation=Mutation)

app = FastAPI(title="BFF simulado")
app.include_router(GraphQLRouter(schema), prefix="/graphql")

@app.get("/")
def raiz():
    return {"mensaje": "BFF simulado funcionando"}

# --- Punto 4.2: Servicio SSE ---
conexiones_sse: set[asyncio.Queue] = set()
contador_notificaciones = 0

class NuevaNotificacion(BaseModel):
    mensaje: str = "Notificación de prueba"

@app.get("/notificaciones/eventos")
async def eventos():
    async def generador():
        cola: asyncio.Queue = asyncio.Queue()
        conexiones_sse.add(cola)
        try:
            while True:
                # Espera hasta que el POST genere una notificacion
                notificacion = await cola.get()
                yield {
                    "event": "notificacion",
                    "id": str(notificacion["id"]),
                    "data": json.dumps(notificacion),
                }
        finally:
            # Al cerrarse la conexion se elimina su cola
            conexiones_sse.discard(cola)

    return EventSourceResponse(generador())

@app.post("/notificaciones/generar")
async def generar(datos: NuevaNotificacion = NuevaNotificacion()):
    global contador_notificaciones
    contador_notificaciones += 1
    notificacion = {
        "id": contador_notificaciones,
        "mensaje": datos.mensaje,
        "hora": datetime.now().strftime("%H:%M:%S"),
        "emitida": time.time() * 1000,
    }
    for cola in list(conexiones_sse):
        cola.put_nowait(notificacion)
    return {"enviada": True, "conexiones": len(conexiones_sse)}

# --- Punto 4.3: Servicio WebSocket ---
@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("bienvenido")
    try:
        while True:
            mensaje = await websocket.receive_text()
            print(f"Mensaje recibido: {mensaje}")
            await websocket.send_text("hola")
    except WebSocketDisconnect:
        print("adios")
