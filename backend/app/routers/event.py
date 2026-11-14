from fastapi import APIRouter, HTTPException, status

from ..models import Event, EventData, EventSummary, EventWaveform, Telescope
from ..telescope import get_telescope as instantiate_telescope

router = APIRouter(tags=["Event"])


def _get_telescope(telescope_name: str) -> Telescope:
    try:
        return instantiate_telescope(telescope_name)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telescope {telescope_name!r} not found",
        ) from exc


@router.get("/{telescope_name}/events")
def get_telescope_events(telescope_name: str) -> list[Event]:
    """Get the list of events for a specific telescope."""
    return _get_telescope(telescope_name).event_list or []


@router.get("/{telescope_name}/{event_name}/summary")
def get_event_summary(telescope_name: str, event_name: str) -> EventSummary:
    """Get the per-pixel summary of an event."""
    try:
        return _get_telescope(telescope_name).get_summary(event_name)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event {event_name!r} for telescope {telescope_name!r} not found",
        ) from exc


@router.get("/{telescope_name}/{event_name}/waveform/{pixel}")
def get_event_waveform(telescope_name: str, event_name: str, pixel: int) -> EventWaveform:
    """Get all channels of a single pixel's waveform."""
    try:
        return _get_telescope(telescope_name).get_waveform(event_name, pixel)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event {event_name!r} for telescope {telescope_name!r} not found",
        ) from exc
    except IndexError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Pixel {pixel} is out of range",
        ) from exc


@router.get("/{telescope_name}/{event_name}")
def get_event(telescope_name: str, event_name: str) -> EventData:
    """Get an event by its name."""
    try:
        return _get_telescope(telescope_name).get_event(event_name)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event {event_name!r} for telescope {telescope_name!r} not found",
        ) from exc
