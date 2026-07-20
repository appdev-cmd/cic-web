from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class ApplicationError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApplicationError)
    async def application_error_handler(_: Request, exc: ApplicationError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
