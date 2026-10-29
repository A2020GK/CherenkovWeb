from fastapi import APIRouter, HTTPException, status

from ..models import Telescope, TelescopeLayout, Event
from ..telescope import TELESCOPE_REGISTRY
from ..telescope import get_telescope as instantiate_telescope

router = APIRouter(prefix="/telescope", tags=["Telescope"])


@router.get("/list")
async def get_telescopes() -> list[Telescope]:
    """Get a list of all registered telescopes."""
    return [instantiate_telescope(name) for name in sorted(TELESCOPE_REGISTRY)]


@router.get("/{telescope_name}")
async def get_telescope(telescope_name: str) -> TelescopeLayout:
    """Get the layout of a specific telescope."""
    try:
        telescope = instantiate_telescope(telescope_name)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telescope {telescope_name!r} not found",
        ) from exc

    return telescope.layout

@router.get("/{telescope_name}/events")
async def get_telescope_events(telescope_name: str) -> list[Event]:
    """Get the list of events for a specific telescope."""
    try:
        telescope = instantiate_telescope(telescope_name)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telescope {telescope_name!r} not found",
        ) from exc

    return telescope.event_list