from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

API_VERSION = "v1"


class ApiStatus(BaseModel):
    status: Literal["ok"]
    version: str = API_VERSION


class ApiError(BaseModel):
    error: str
    detail: str | None = None
    code: str | None = None


class CapabilityStatus(BaseModel):
    name: str
    status: Literal["available", "planned"]
    endpoints: list[str] = Field(default_factory=list)


class CapabilitiesResponse(BaseModel):
    version: str = API_VERSION
    capabilities: list[CapabilityStatus]
    available_endpoints: list[str] = Field(default_factory=list)


class ContractBaseModel(BaseModel):
    model_config = ConfigDict(extra="allow")
