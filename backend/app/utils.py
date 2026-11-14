from pathlib import Path

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


def safe_event_path(directory: Path, name: str) -> Path:
    """Resolve an event file inside ``directory``, rejecting path traversal."""
    path = (directory / name).resolve()
    if not path.is_relative_to(directory.resolve()):
        raise FileNotFoundError(name)
    return path


class BaseSchema(BaseModel):
    """Base schema, converts snake_case to camelCase JSON keys"""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        str_strip_whitespace=True,
        validate_assignment=True,
        use_enum_values=True,
    )
