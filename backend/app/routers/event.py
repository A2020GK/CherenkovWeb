from fastapi import APIRouter, HTTPException, status

from ..models import Event, EventData
from ..telescope import get_telescope as instantiate_telescope

router = APIRouter(tags=["Event"])

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

    return telescope.event_list or []

@router.get("/{telescope_name}/{event_name}")
async def get_event(telescope_name: str, event_name: str) -> EventData:
    """Get an event by it's name"""
    try:
        telescope = instantiate_telescope(telescope_name)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telescope {telescope_name!r} not found",
        ) from exc

    # try:
    event = telescope.get_event(event_name)
    # except Exception as exc:
    #     raise HTTPException(
    #         status_code=404,
    #         detail=f"Event {event_name!r} for telescope {telescope_name!r} not found",
    #     ) from exc

    return event
